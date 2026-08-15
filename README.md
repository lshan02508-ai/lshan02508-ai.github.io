# 刘世安的个人主页

一个面向 GitHub Pages 的中文个人网站，展示教育经历、实习、Agent 项目、科研论文、竞赛荣誉、开源工作与技术博客。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

静态产物位于 `dist/`。

## 发布到 GitHub Pages

推送到 `main` 分支后，仓库中的 GitHub Actions 会自动构建和发布。首次发布时，在仓库 `Settings → Pages` 中将 Source 设置为 `GitHub Actions`。

## 内容维护

- 首页和经历：`app/page.tsx`
- 博客数据：`app/site-data.ts`
- 视觉样式：`app/globals.css`
- 浏览器入口：`src/main.tsx`
