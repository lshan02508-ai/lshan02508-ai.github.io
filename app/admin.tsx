import {useEffect, useMemo, useState} from "react";
import {articles, serializeArticle, type Article} from "./blog-content";
import RichMarkdownEditor from "./rich-markdown-editor";

const DRAFTS_KEY = "lsa-blog-drafts-v1";
const SESSION_KEY = "lsa-blog-admin-session";
const API_KEY = "lsa-blog-admin-api";
const DEFAULT_API = (import.meta.env.VITE_ADMIN_API_URL || "").replace(/\/$/, "");

type DraftMap = Record<string, Article>;
type Notice = {kind:"success"|"error"|"info"; text:string} | null;

function today() {
  const date = new Date();
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function newArticle(): Article {
  return {
    slug: `new-article-${Date.now().toString().slice(-6)}`,
    title: "未命名文章",
    category: "AI Agent",
    date: today(),
    readingTime: "5 分钟",
    excerpt: "用一句话概括这篇文章解决的问题。",
    lead: "在这里写文章导语，告诉读者为什么值得继续阅读。",
    body: "## 问题背景\n\n从这里开始写正文。\n\n## 方法与实践\n\n记录你的判断、实现和结果。",
  };
}

function readDrafts(): DraftMap {
  try { return JSON.parse(localStorage.getItem(DRAFTS_KEY) || "{}"); }
  catch { return {}; }
}

function saveDraftMap(value: DraftMap) {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(value));
}

function consumeSession() {
  const params = new URLSearchParams(location.search);
  const incoming = params.get("admin_session");
  if (incoming) {
    sessionStorage.setItem(SESSION_KEY, incoming);
    params.delete("admin_session");
    const query = params.toString();
    history.replaceState(null, "", `${location.pathname}${query ? `?${query}` : ""}${location.hash || "#/admin"}`);
    return incoming;
  }
  return sessionStorage.getItem(SESSION_KEY) || "";
}

export default function Admin() {
  const [drafts, setDrafts] = useState<DraftMap>(readDrafts);
  const [selectedKey, setSelectedKey] = useState(articles[0]?.slug || "");
  const [editor, setEditor] = useState<Article>(articles[0] || newArticle());
  const [query, setQuery] = useState("");
  const [apiBase, setApiBase] = useState(() => localStorage.getItem(API_KEY) || DEFAULT_API);
  const [session, setSession] = useState(consumeSession);
  const [account, setAccount] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);

  const allArticles = useMemo(() => {
    const merged = new Map(articles.map(article => [article.slug, article]));
    Object.values(drafts).forEach(article => merged.set(article.slug, article));
    return [...merged.values()].sort((a, b) => b.date.localeCompare(a.date));
  }, [drafts]);

  const visibleArticles = allArticles.filter(article => `${article.title} ${article.category} ${article.slug}`.toLowerCase().includes(query.toLowerCase()));
  const isPublished = articles.some(article => article.slug === selectedKey);
  const hasDraft = Boolean(drafts[selectedKey]);

  useEffect(() => {
    if (!apiBase || !session) return;
    fetch(`${apiBase}/api/me`, {headers:{Authorization:`Bearer ${session}`}})
      .then(async response => {
        if (!response.ok) throw new Error("登录已失效");
        const data = await response.json() as {login:string};
        setAccount(data.login);
      })
      .catch(() => { sessionStorage.removeItem(SESSION_KEY); setSession(""); setAccount(""); });
  }, [apiBase, session]);

  function selectArticle(article: Article) {
    setSelectedKey(article.slug);
    setEditor({...article});
    setNotice(null);
  }

  function update<K extends keyof Article>(key: K, value: Article[K]) {
    setEditor(current => ({...current, [key]: value}));
  }

  function persistDraft() {
    if (!editor.slug.trim()) { setNotice({kind:"error", text:"Slug 不能为空。"}); return; }
    const next = {...drafts};
    if (selectedKey !== editor.slug) delete next[selectedKey];
    next[editor.slug] = {...editor};
    saveDraftMap(next);
    setDrafts(next);
    setSelectedKey(editor.slug);
    setNotice({kind:"success", text:"草稿已保存在当前浏览器。"});
  }

  function createArticle() {
    const article = newArticle();
    setSelectedKey(article.slug);
    setEditor(article);
    setNotice({kind:"info", text:"新文章尚未保存。"});
  }

  function removeLocalDraft() {
    const next = {...drafts};
    delete next[selectedKey];
    saveDraftMap(next);
    setDrafts(next);
    const published = articles.find(article => article.slug === selectedKey);
    const fallback = published || articles[0] || newArticle();
    setEditor({...fallback});
    setSelectedKey(fallback.slug);
    setNotice({kind:"info", text:published ? "已撤销本地修改。" : "本地草稿已删除。"});
  }

  function saveApi() {
    const normalized = apiBase.trim().replace(/\/$/, "");
    setApiBase(normalized);
    localStorage.setItem(API_KEY, normalized);
    setNotice({kind:"success", text:"发布服务地址已保存。"});
  }

  function login() {
    if (!apiBase) { setNotice({kind:"error", text:"请先填写发布服务地址。"}); return; }
    const returnTo = `${location.origin}${location.pathname}`;
    location.href = `${apiBase}/auth/login?return_to=${encodeURIComponent(returnTo)}`;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setSession("");
    setAccount("");
  }

  async function publish() {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(editor.slug)) {
      setNotice({kind:"error", text:"Slug 只能包含小写字母、数字和连字符。"});
      return;
    }
    if (!apiBase || !session) { setNotice({kind:"error", text:"请先配置发布服务并登录 GitHub。"}); return; }
    setBusy(true);
    setNotice({kind:"info", text:"正在提交到 GitHub…"});
    try {
      const response = await fetch(`${apiBase}/api/articles/${editor.slug}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json", Authorization:`Bearer ${session}`},
        body: JSON.stringify({content: serializeArticle(editor)}),
      });
      const data = await response.json() as {message?:string; commitUrl?:string};
      if (!response.ok) throw new Error(data.message || "发布失败");
      persistDraft();
      setNotice({kind:"success", text:"已提交到 GitHub，Pages 正在重新构建。"});
    } catch (error) {
      setNotice({kind:"error", text:error instanceof Error ? error.message : "发布失败"});
    } finally { setBusy(false); }
  }

  async function removePublished() {
    if (!isPublished) { removeLocalDraft(); return; }
    if (!apiBase || !session) { setNotice({kind:"error", text:"请先登录 GitHub。"}); return; }
    if (!confirm(`确定从网站删除《${editor.title}》吗？这会在 GitHub 中产生一次提交。`)) return;
    setBusy(true);
    try {
      const response = await fetch(`${apiBase}/api/articles/${selectedKey}`, {method:"DELETE", headers:{Authorization:`Bearer ${session}`}});
      const data = await response.json() as {message?:string};
      if (!response.ok) throw new Error(data.message || "删除失败");
      removeLocalDraft();
      setNotice({kind:"success", text:"删除提交已创建，Pages 正在重新构建。"});
    } catch (error) {
      setNotice({kind:"error", text:error instanceof Error ? error.message : "删除失败"});
    } finally { setBusy(false); }
  }

  return <main className="admin-page">
    <header className="admin-topbar"><div><a href="#/">LS</a><span>博客写作台</span></div><div className="admin-account">{account ? <><b>{account}</b><button onClick={logout}>退出</button></> : <button className="admin-login" onClick={login}>GitHub 登录</button>}<a href="#/blog">查看博客 ↗</a></div></header>

    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head"><div><strong>文章</strong><span>{allArticles.length} 篇</span></div><button onClick={createArticle}>＋ 新建</button></div>
        <input className="admin-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索标题、分类或 slug" aria-label="搜索文章"/>
        <div className="admin-article-list">{visibleArticles.map(article => <button className={article.slug === selectedKey ? "active" : ""} key={article.slug} onClick={() => selectArticle(article)}><span>{article.category}</span><strong>{article.title}</strong><small>{article.date}<i>{drafts[article.slug] ? "本地草稿" : "已发布"}</i></small></button>)}</div>
        <div className="admin-api"><label htmlFor="api-base">发布服务地址</label><div><input id="api-base" value={apiBase} onChange={event => setApiBase(event.target.value)} placeholder="https://your-worker.workers.dev"/><button onClick={saveApi}>保存</button></div><p>只保存在当前浏览器，也可通过构建变量预设。</p></div>
      </aside>

      <section className="admin-workspace">
        <div className="admin-actions"><div><span className={`admin-state ${hasDraft ? "draft" : ""}`}>{hasDraft ? "本地草稿" : isPublished ? "已发布" : "未保存"}</span>{notice && <p className={notice.kind}>{notice.text}</p>}</div><div><button onClick={removeLocalDraft} disabled={!hasDraft}>撤销草稿</button><button onClick={persistDraft}>保存草稿</button><button className="danger" onClick={removePublished} disabled={busy}>{isPublished ? "删除文章" : "删除草稿"}</button><button className="primary" onClick={publish} disabled={busy}>{busy ? "处理中…" : "发布到 GitHub"}</button></div></div>

        <div className="admin-meta-grid">
          <label><span>标题</span><input value={editor.title} onChange={event => update("title", event.target.value)}/></label>
          <label><span>Slug</span><input value={editor.slug} disabled={isPublished} title={isPublished ? "已发布文章的 Slug 不可修改" : ""} onChange={event => update("slug", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}/></label>
          <label><span>分类</span><input value={editor.category} onChange={event => update("category", event.target.value)}/></label>
          <label><span>发布日期</span><input value={editor.date} onChange={event => update("date", event.target.value)}/></label>
          <label><span>阅读时间</span><input value={editor.readingTime} onChange={event => update("readingTime", event.target.value)}/></label>
          <label className="wide"><span>列表摘要</span><textarea rows={2} value={editor.excerpt} onChange={event => update("excerpt", event.target.value)}/></label>
          <label className="wide"><span>文章导语</span><textarea rows={2} value={editor.lead} onChange={event => update("lead", event.target.value)}/></label>
        </div>

        <section className="admin-rich-editor"><header><div><strong>文章正文</strong><span>支持富文本、Markdown 源码和发布前差异对比</span></div><small>内容仍以标准 Markdown 保存</small></header><RichMarkdownEditor key={selectedKey} value={editor.body} onChange={value => update("body", value)}/></section>
      </section>
    </div>
  </main>;
}
