interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  SESSION_SECRET: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  ALLOWED_GITHUB_LOGIN: string;
  ALLOWED_ORIGINS: string;
}

type StatePayload = {kind:"state"; exp:number; returnTo:string; nonce:string};
type SessionPayload = {kind:"session"; exp:number; login:string; accessToken:string};

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const MAX_ARTICLE_BYTES = 500_000;

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(normalized);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

async function encryptionKey(secret: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function seal(payload: StatePayload | SessionPayload, secret: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({name:"AES-GCM", iv}, await encryptionKey(secret), encoder.encode(JSON.stringify(payload)));
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encrypted), iv.length);
  return base64Url(result);
}

async function open<T extends StatePayload | SessionPayload>(token: string, secret: string): Promise<T> {
  const bytes = fromBase64Url(token);
  if (bytes.length < 29) throw new Error("无效会话");
  const decrypted = await crypto.subtle.decrypt({name:"AES-GCM", iv:bytes.slice(0, 12)}, await encryptionKey(secret), bytes.slice(12));
  const payload = JSON.parse(decoder.decode(decrypted)) as T;
  if (!payload.exp || payload.exp < Date.now()) throw new Error("会话已过期");
  return payload;
}

function allowedOrigins(env: Env) {
  return env.ALLOWED_ORIGINS.split(",").map(value => value.trim().replace(/\/$/, "")).filter(Boolean);
}

function requestOrigin(request: Request, env: Env) {
  const origin = request.headers.get("Origin") || "";
  return allowedOrigins(env).includes(origin) ? origin : "";
}

function cors(origin = "") {
  const headers: Record<string,string> = {
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Cache-Control": "no-store",
    "Vary": "Origin",
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(data: unknown, status = 200, origin = "") {
  return new Response(JSON.stringify(data), {status, headers:{"Content-Type":"application/json; charset=utf-8", ...cors(origin)}});
}

function cookie(request: Request, name: string) {
  const match = request.headers.get("Cookie")?.split(";").map(value => value.trim()).find(value => value.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function safeReturnTo(value: string | null, env: Env) {
  const fallback = allowedOrigins(env)[0];
  if (!fallback) throw new Error("ALLOWED_ORIGINS 未配置");
  try {
    const url = new URL(value || fallback);
    if (!allowedOrigins(env).includes(url.origin)) return fallback;
    return `${url.origin}${url.pathname}`;
  } catch { return fallback; }
}

async function githubRequest(env: Env, accessToken: string, path: string, init: RequestInit = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${accessToken}`,
      "User-Agent": "lsa-blog-admin",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers || {}),
    },
  });
}

async function readSession(request: Request, env: Env) {
  const authorization = request.headers.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) throw new Error("请先登录 GitHub");
  const session = await open<SessionPayload>(authorization.slice(7), env.SESSION_SECRET);
  if (session.kind !== "session" || session.login.toLowerCase() !== env.ALLOWED_GITHUB_LOGIN.toLowerCase()) throw new Error("没有发布权限");
  return session;
}

function githubFilePath(env: Env, slug: string) {
  const owner = encodeURIComponent(env.GITHUB_OWNER);
  const repo = encodeURIComponent(env.GITHUB_REPO);
  return `/repos/${owner}/${repo}/contents/content/blog/${encodeURIComponent(slug)}.md`;
}

async function githubError(response: Response) {
  try {
    const data = await response.json() as {message?:string};
    return data.message || `GitHub API 返回 ${response.status}`;
  } catch { return `GitHub API 返回 ${response.status}`; }
}

async function currentFile(env: Env, accessToken: string, slug: string) {
  const response = await githubRequest(env, accessToken, `${githubFilePath(env, slug)}?ref=${encodeURIComponent(env.GITHUB_BRANCH)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(await githubError(response));
  return response.json() as Promise<{sha:string; html_url:string}>;
}

async function handleLogin(request: Request, env: Env) {
  const url = new URL(request.url);
  const payload: StatePayload = {
    kind: "state",
    exp: Date.now() + 10 * 60_000,
    returnTo: safeReturnTo(url.searchParams.get("return_to"), env),
    nonce: crypto.randomUUID(),
  };
  const state = await seal(payload, env.SESSION_SECRET);
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorize.searchParams.set("scope", "public_repo");
  authorize.searchParams.set("state", state);
  return new Response(null, {status:302, headers:{Location:authorize.toString(), "Set-Cookie":`oauth_state=${encodeURIComponent(state)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`}});
}

async function handleCallback(request: Request, env: Env) {
  const url = new URL(request.url);
  const state = url.searchParams.get("state") || "";
  const code = url.searchParams.get("code") || "";
  if (!state || !code || cookie(request, "oauth_state") !== state) return new Response("OAuth state 校验失败", {status:400});
  const statePayload = await open<StatePayload>(state, env.SESSION_SECRET);
  if (statePayload.kind !== "state") return new Response("OAuth state 无效", {status:400});

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {"Accept":"application/json", "Content-Type":"application/json", "User-Agent":"lsa-blog-admin"},
    body: JSON.stringify({client_id:env.GITHUB_CLIENT_ID, client_secret:env.GITHUB_CLIENT_SECRET, code}),
  });
  const tokenData = await tokenResponse.json() as {access_token?:string; error_description?:string};
  if (!tokenData.access_token) return new Response(tokenData.error_description || "GitHub 登录失败", {status:401});

  const userResponse = await githubRequest(env, tokenData.access_token, "/user");
  if (!userResponse.ok) return new Response("无法读取 GitHub 用户信息", {status:401});
  const user = await userResponse.json() as {login:string};
  if (user.login.toLowerCase() !== env.ALLOWED_GITHUB_LOGIN.toLowerCase()) return new Response("当前 GitHub 账号没有发布权限", {status:403});

  const session = await seal({kind:"session", exp:Date.now() + 60 * 60_000, login:user.login, accessToken:tokenData.access_token}, env.SESSION_SECRET);
  const redirect = new URL(statePayload.returnTo);
  redirect.searchParams.set("admin_session", session);
  redirect.hash = "/admin";
  return new Response(null, {status:302, headers:{Location:redirect.toString(), "Set-Cookie":"oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"}});
}

async function handlePut(request: Request, env: Env, slug: string, origin: string) {
  const session = await readSession(request, env);
  const raw = await request.text();
  if (encoder.encode(raw).byteLength > MAX_ARTICLE_BYTES) return json({message:"文章内容过大"}, 413, origin);
  const body = JSON.parse(raw) as {content?:string};
  if (!body.content || !body.content.includes(`\nslug: ${slug}\n`)) return json({message:"文章内容或 slug 不一致"}, 400, origin);
  const existing = await currentFile(env, session.accessToken, slug);
  const payload: Record<string,string> = {
    message: `${existing ? "update" : "publish"} blog: ${slug}`,
    content: base64(encoder.encode(body.content)),
    branch: env.GITHUB_BRANCH,
  };
  if (existing) payload.sha = existing.sha;
  const response = await githubRequest(env, session.accessToken, githubFilePath(env, slug), {method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
  if (!response.ok) return json({message:await githubError(response)}, response.status, origin);
  const data = await response.json() as {commit?:{html_url?:string}};
  return json({ok:true, commitUrl:data.commit?.html_url || ""}, 200, origin);
}

async function handleDelete(request: Request, env: Env, slug: string, origin: string) {
  const session = await readSession(request, env);
  const existing = await currentFile(env, session.accessToken, slug);
  if (!existing) return json({message:"文章不存在"}, 404, origin);
  const response = await githubRequest(env, session.accessToken, githubFilePath(env, slug), {
    method: "DELETE",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({message:`delete blog: ${slug}`, sha:existing.sha, branch:env.GITHUB_BRANCH}),
  });
  if (!response.ok) return json({message:await githubError(response)}, response.status, origin);
  const data = await response.json() as {commit?:{html_url?:string}};
  return json({ok:true, commitUrl:data.commit?.html_url || ""}, 200, origin);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = requestOrigin(request, env);
    try {
      if (request.method === "OPTIONS") return new Response(null, {status:204, headers:cors(origin)});
      if (url.pathname === "/auth/login" && request.method === "GET") return handleLogin(request, env);
      if (url.pathname === "/auth/callback" && request.method === "GET") return handleCallback(request, env);
      if (url.pathname === "/api/health" && request.method === "GET") return json({ok:true}, 200, origin);
      if (url.pathname === "/api/me" && request.method === "GET") {
        const session = await readSession(request, env);
        return json({login:session.login}, 200, origin);
      }
      const match = url.pathname.match(/^\/api\/articles\/([a-z0-9][a-z0-9-]*)$/);
      if (match && request.method === "PUT") return handlePut(request, env, match[1], origin);
      if (match && request.method === "DELETE") return handleDelete(request, env, match[1], origin);
      return json({message:"Not found"}, 404, origin);
    } catch (error) {
      const message = error instanceof Error ? error.message : "服务器错误";
      return json({message}, /登录|权限|会话/.test(message) ? 401 : 500, origin);
    }
  },
};
