import assert from "node:assert/strict";
import {readFile, readdir} from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("builds the GitHub Pages application shell", async () => {
  const [html, assets] = await Promise.all([
    readFile(new URL("dist/index.html", root), "utf8"),
    readdir(new URL("dist/assets/", root)),
  ]);

  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<title>刘世安｜LLM &amp; Agent<\/title>|<title>刘世安｜LLM & Agent<\/title>/);
  assert.match(html, /<div id="root"><\/div>/);
  assert.ok(assets.some(file => file.endsWith(".js")), "missing JavaScript bundle");
  assert.ok(assets.some(file => file.endsWith(".css")), "missing CSS bundle");
});

test("keeps blog content and publishing tools wired together", async () => {
  const [main, content, admin, worker, workflow, articleFiles] = await Promise.all([
    readFile(new URL("src/main.tsx", root), "utf8"),
    readFile(new URL("app/blog-content.tsx", root), "utf8"),
    readFile(new URL("app/admin.tsx", root), "utf8"),
    readFile(new URL("admin-worker/index.ts", root), "utf8"),
    readFile(new URL(".github/workflows/deploy-pages.yml", root), "utf8"),
    readdir(new URL("content/blog/", root)),
  ]);

  assert.match(main, /route==="\/admin"/);
  assert.match(content, /import\.meta\.glob\("\.\.\/content\/blog\/\*\.md"/);
  assert.match(content, /serializeArticle/);
  assert.match(admin, /lsa-blog-drafts-v1/);
  assert.match(admin, /发布到 GitHub/);
  assert.match(worker, /\/auth\/callback/);
  assert.ok(worker.includes("api\\/articles"));
  assert.match(worker, /ALLOWED_GITHUB_LOGIN/);
  assert.match(workflow, /VITE_ADMIN_API_URL/);
  assert.equal(articleFiles.filter(file => file.endsWith(".md")).length, 3);

  for (const file of articleFiles.filter(file => file.endsWith(".md"))) {
    const article = await readFile(new URL(`content/blog/${file}`, root), "utf8");
    assert.match(article, /^---\n/);
    assert.match(article, /\nslug: [a-z0-9-]+\n/);
    assert.match(article, /\n---\n\n## /);
  }
});
