import { articles } from "./site-data";

const tags = ["LLM 应用", "AI Agent", "RAG", "LangGraph", "模型微调"];

export default function Home() {
  return <main>
    <header className="site-header">
      <a className="brand" href="#top"><span className="brand-mark">LS</span><span>刘世安</span></a>
      <nav><a href="#about">关于</a><a href="#experience">经历</a><a href="#project">项目</a><a href="#research">科研</a><a href="#blog">博客</a></nav>
      <a className="nav-cta" href="mailto:17538251135@163.com">联系我 ↗</a>
    </header>

    <section className="hero section" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><i />南京 · 开放实习与合作机会</div>
        <p className="hero-no">PORTFOLIO / 2026</p>
        <h1>让大模型从<br/><em>“能回答”</em>走向<em>“能做事”</em></h1>
        <p className="hero-intro">你好，我是刘世安，南京师范大学计算机技术硕士研究生。我关注大模型领域适配、RAG 检索优化、智能体工作流与推理部署。</p>
        <div className="hero-actions"><a className="button primary" href="#project">查看代表项目 <span>↘</span></a><a className="button secondary" href="https://github.com/lshan02508-ai" target="_blank" rel="noreferrer">GitHub ↗</a></div>
        <div className="skill-row">{tags.map(tag=><span key={tag}>{tag}</span>)}</div>
      </div>
      <aside className="profile-card" aria-label="个人简介">
        <div className="profile-visual"><span className="profile-orbit"/><b>LSA</b><small>RESEARCH × ENGINEERING</small></div>
        <div className="profile-meta"><div><span>当前方向</span><b>大模型算法 / Agent</b></div><div><span>身份</span><b>硕士研究生</b></div><div><span>邮箱</span><b>17538251135@163.com</b></div></div>
      </aside>
    </section>

    <section className="about-strip" id="about"><div><span>01 / PROFILE</span><h2>研究与工程之间，<br/>做可靠、可落地的系统。</h2></div><p>我喜欢把论文里的方法变成真实可用的产品能力：从数据定义、模型训练到检索、Agent 编排和部署验证，持续追问“它为什么有效，以及如何稳定地有效”。</p></section>

    <section className="section split-section" id="experience">
      <div className="section-heading"><span>02 / EXPERIENCE</span><h2>学习与经历</h2><p>把模型指标转化为可被业务使用的系统能力。</p></div>
      <div className="timeline">
        <article><time>2025.01 — 2025.08</time><small>南京</small><h3>大模型应用开发实习生</h3><p>参与 AI 智能教学平台研发，负责领域数据、Qwen 指令微调、昇腾 NPU 推理部署与 RAG 检索优化。</p><div className="stats"><b>5,415<small>训练样本</small></b><b>86.0%<small>任务准确率</small></b><b>74%<small>Top-1 命中率</small></b></div></article>
        <article><time>2024.09 — 2027.06</time><small>硕士</small><h3>南京师范大学 · 计算机技术</h3></article>
        <article><time>2020.09 — 2024.07</time><small>本科</small><h3>重庆交通大学 · 数据科学与大数据技术</h3></article>
      </div>
    </section>

    <section className="project-section" id="project"><div className="section project-inner"><div className="section-heading light"><span>03 / FEATURED PROJECT</span><h2>智能运维故障诊断 Agent</h2></div><div className="project-grid"><p>面向云原生与微服务故障排查，构建融合 Qwen、LangGraph、RAG 与 MCP 的智能 OnCall Agent。</p><ol><li><b>01</b><span><strong>Planner</strong>生成可验证的诊断计划</span></li><li><b>02</b><span><strong>Executor</strong>调用监控、日志与知识库工具取证</span></li><li><b>03</b><span><strong>Replanner</strong>基于证据动态调整路径</span></li></ol></div></div></section>

    <section className="section research" id="research"><div className="section-heading"><span>04 / RESEARCH</span><h2>让流式视频中的动作边界更可靠</h2></div><article className="paper"><small>FIRST AUTHOR · UNDER REVIEW</small><h3>Boundary-Process Matching for Online Temporal Action Localization</h3><p>将在线时序动作定位建模为边界发现、过程兼容性验证与边界精修的统一框架。</p><div><span>+2.5 THUMOS14</span><span>+2.4 MUSES</span><span>+1.6 ActivityNet-1.3</span></div></article></section>

    <section className="blog-home" id="blog"><div className="blog-home-head"><span>05 / NOTES & ESSAYS</span><h2>博客与日记</h2><p>记录技术，也记录那些尚未想清楚的问题。</p><a href="#/blog">全部文章 ↗</a></div><div className="home-posts">{articles.map((a,i)=><a href={`#/blog/${a.slug}`} key={a.slug}><small>0{i+1}</small><div><span>{a.category} · {a.date}</span><h3>{a.title}</h3><p>{a.excerpt}</p></div><b>↗</b></a>)}</div></section>

    <footer className="site-footer"><span>© 2026 刘世安</span><span>Research · Engineering · Notes</span><a href="#top">回到顶部 ↑</a></footer>
  </main>;
}
