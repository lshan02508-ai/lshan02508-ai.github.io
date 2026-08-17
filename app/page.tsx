import {articles} from "./blog-content";

const news = [
  ["2026.08", "开始在个人博客记录 RAG、Agent 与模型微调中的具体问题。"],
  ["2025.08", "完成大模型应用开发实习，覆盖领域数据、指令微调、检索优化与昇腾部署。"],
];

const skillGroups = [
  ["模型与训练", ["Python", "PyTorch", "Qwen", "SFT", "LoRA / QLoRA", "DeepSpeed"]],
  ["Agent / RAG", ["LangGraph", "MCP", "RAG", "Milvus", "Qdrant", "Prompt Engineering"]],
  ["部署与工程", ["FastAPI", "vLLM", "Ascend NPU", "Linux", "Git", "模型评测"]],
];

const honors = [
  ["中国研究生数学建模竞赛", "国家三等奖"],
  ["全国大学生数学建模竞赛", "省级一等奖"],
  ["蓝桥杯全国软件和信息技术专业人才大赛", "二等奖"],
  ["研究生学业奖学金", "二等奖、三等奖"],
  ["国家励志奖学金", "国家级奖学金"],
  ["全国大学生数学竞赛", "三等奖"],
];

function SectionHeader({title,english,description}:{title:string;english:string;description?:string}){
  return <header className="section-header"><div className="section-title-row"><h2>{title}</h2><span>{english}</span></div>{description&&<p>{description}</p>}</header>;
}

function Tags({items,primary}:{items:string[];primary?:string}){
  return <div className="tech-tags">{items.map(item=><span className={item===primary?"primary":""} key={item}>{item}</span>)}</div>;
}

export default function Home(){return <main className="site">
  <header className="navbar">
    <div className="nav-inner">
      <a className="nav-brand" href="#top"><span>LS</span><strong>刘世安</strong></a>
      <nav aria-label="主导航"><a href="#top">首页</a><a href="#projects">项目</a><a href="#research">科研</a><a href="#writing">博客</a></nav>
      <div className="nav-actions"><a href="https://github.com/lshan02508-ai" target="_blank" rel="noreferrer">GitHub ↗</a><a href="mailto:17538251135@163.com">Email</a></div>
    </div>
  </header>

  <div className="site-container" id="top">
    <section className="profile">
      <img className="profile-avatar" src="/profile.jpg" alt="刘世安的头像"/>
      <div className="profile-copy"><h1>刘世安</h1><p className="profile-role">LLM / AI Agent Engineer</p><p className="profile-school">南京师范大学 · 计算机技术硕士研究生</p><p className="profile-desc">专注大模型领域微调、RAG 检索优化、Agent 工作流与模型推理部署，希望把模型能力真正转化为可靠、可评估的 AI 系统。</p><div className="profile-links"><a href="https://github.com/lshan02508-ai" target="_blank" rel="noreferrer">GitHub ↗</a><a href="mailto:17538251135@163.com">Email ↗</a><span>南京</span></div></div>
    </section>

    <section className="section about" id="about"><SectionHeader title="关于我" english="About"/><p>你好，我是刘世安，目前就读于南京师范大学计算机技术专业。我的工作横跨领域数据构建、Qwen 微调、RAG 检索、智能体编排和推理部署。我关注的不只是模型能否回答问题，也关心它能否在真实流程中稳定运行、留下可验证证据，并持续接受评测。</p></section>

    <section className="section news-section"><SectionHeader title="最新动态" english="Latest"/><div className="news-list">{news.map(([date,text])=><div key={date}><time>{date}</time><p>{text}</p><span>↗</span></div>)}</div></section>

    <section className="section" id="projects"><SectionHeader title="精选项目" english="Selected Work" description="近期完成的 AI / LLM 工程与模型工作。"/><div className="project-list">
      <article className="project-card featured-project">
        <div className="project-content"><span className="badge">AI Agent</span><h3>智能运维故障诊断 Agent</h3><p className="project-summary">面向云原生与微服务场景的证据驱动故障诊断系统。</p><div className="project-sequence"><div className="project-detail-row"><b>01</b><strong>PROBLEM</strong><p>日志、指标、Trace 与 Runbook 分散，故障排查高度依赖人工经验。</p></div><div className="project-detail-row"><b>02</b><strong>SYSTEM</strong><p>Planner → Executor → Replanner，联合 RAG、MCP 工具调用与动态重规划。</p></div><div className="project-detail-row result-row"><b>03</b><strong>RESULT</strong><div className="result-grid"><div><span>ROOT CAUSE ACC.</span><em>62% → 84%</em></div><div><span>EVIDENCE RECALL@1</span><em>42% → 78%</em></div></div></div></div><div className="project-footer"><Tags items={["LangGraph","MCP","Qwen","Milvus","FastAPI"]} primary="LangGraph"/><a className="text-link" href="#writing">查看详情 →</a></div></div>
      </article>

      <article className="compact-project">
        <div className="compact-content"><div className="compact-meta"><span>MODEL FINE-TUNING</span><b>QWEN-14B</b></div><h3>金融研究数据集与 Qwen-14B 微调</h3><p>整合 BizFinBench、FinTruthQA、DISC-Fin-SFT、FinQA 与 TAT-QA，覆盖财报分析、表格文本推理、数值计算、事件逻辑与结构化输出。</p><div className="compact-facts"><div><span>DATA</span><strong>金融研究问答</strong></div><div><span>METHOD</span><strong>LoRA / QLoRA</strong></div><div><span>BASE MODEL</span><strong>Qwen-14B</strong></div></div><div className="compact-footer"><Tags items={["Qwen","LoRA","FinQA","TAT-QA"]} primary="Qwen"/><a className="text-link" href="#writing">查看详情 →</a></div></div>
      </article>
    </div></section>

    <section className="section" id="research"><SectionHeader title="科研工作" english="Research" description="关注在线时序动作定位中的过程建模与边界精修。"/><article className="paper-item"><figure><img src="/bpm-algorithm.png" alt="Boundary-Process Matching 算法图"/></figure><div className="paper-content"><span>IEEE TRANSACTIONS ON MULTIMEDIA</span><small>UNDER REVIEW · 2026</small><h3>Boundary–Process Matching for Online Temporal Action Localization</h3><p>将在线时序动作定位建模为边界发现、过程兼容性验证与边界精修的统一框架，通过候选边界与内部时序过程的双向交互，提升动作完整性判断与严格边界定位。</p><div className="paper-metrics"><div><span>THUMOS14</span><strong>+2.5</strong></div><div><span>MUSES</span><strong>+2.4</strong></div><div><span>ActivityNet-1.3</span><strong>+1.6</strong></div></div></div></article></section>

    <section className="section"><SectionHeader title="实习经历" english="Experience"/><div className="timeline"><article><i/><h3>南京百伦斯智能科技有限公司</h3><p className="timeline-role">大模型应用开发实习生 · 算法研发部</p><time>2025.01 — 2025.08 · 南京</time><p>参与初中理化实验 AI 智能教学平台研发，负责领域数据构建、Qwen 指令微调、昇腾 NPU 推理部署与 RAG 检索优化，覆盖从训练数据准备到模型上线验证的完整流程。</p><p className="timeline-stack">Qwen · LoRA · RAG · vLLM-Ascend</p></article></div></section>

    <section className="section"><SectionHeader title="技术能力" english="Skills"/><div className="skill-matrix">{skillGroups.map(([group,items])=><div className="skill-group" key={group as string}><h3>{group}</h3><div>{(items as string[]).map((item,index)=><span className={index<2?"core":""} key={item}>{item}</span>)}</div></div>)}</div></section>

    <section className="section"><SectionHeader title="教育经历" english="Education"/><div className="education-list"><article><img src="/nnu-logo.png" alt="南京师范大学校徽"/><div><h3>南京师范大学</h3><p>计算机技术 · 硕士研究生</p><span>南京 · 211</span></div><time>2024 — 2027</time></article><article><img src="/cqjtu-logo.png" alt="重庆交通大学校徽"/><div><h3>重庆交通大学</h3><p>数据科学与大数据技术 · 本科</p><span>重庆</span></div><time>2020 — 2024</time></article></div></section>

    <section className="section"><SectionHeader title="荣誉与奖学金" english="Honors"/><div className="award-grid">{honors.map(([title,result],index)=><article key={title}><b>{String(index+1).padStart(2,"0")}</b><h3>{title}</h3><span>{result}</span></article>)}</div></section>

    <section className="section writing" id="writing"><SectionHeader title="博客" english="Writing" description="关于 Agent、RAG 与模型训练的实践记录。"/><div className="article-list">{articles.map(article=><a className="article-item" href={`#/blog/${article.slug}`} key={article.slug}><time>{article.date}</time><div><h3>{article.title}</h3><span>{article.category}</span></div><b>↗</b></a>)}</div><a className="writing-all" href="#/blog">查看全部文章 →</a></section>

    <footer className="footer"><div><strong>刘世安</strong><span>LLM / AI Agent Engineer</span></div><div><a href="mailto:17538251135@163.com">Email</a><a href="https://github.com/lshan02508-ai" target="_blank" rel="noreferrer">GitHub</a><a href="#top">Top ↑</a></div></footer>
  </div>
</main>}
