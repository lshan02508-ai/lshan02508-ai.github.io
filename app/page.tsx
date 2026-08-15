import { articles } from "./site-data";

const skills=[
  ["模型训练",["Python","PyTorch","Qwen","SFT","LoRA / QLoRA","DeepSpeed"]],
  ["Agent 与检索",["LangGraph","MCP","RAG","Milvus","Qdrant","Prompt Engineering"]],
  ["工程与部署",["FastAPI","vLLM","昇腾 NPU","Linux","Git","模型评测"]],
];
const awards=[
  ["中国研究生数学建模竞赛","国家三等奖"],
  ["全国大学生数学建模竞赛","省级一等奖"],
  ["蓝桥杯全国软件和信息技术专业人才大赛","二等奖"],
  ["研究生学业奖学金","二等奖、三等奖"],
  ["国家励志奖学金","国家级奖学金"],
  ["全国大学生数学竞赛","三等奖"],
];

function SectionTitle({index,title,desc}:{index:string;title:string;desc?:string}){return <header className="section-head"><div><i/>{index}<h2>{title}</h2></div>{desc&&<p>{desc}</p>}</header>}

export default function Home(){return <main>
  <header className="topbar"><a className="mini-brand" href="#top"><span>LS</span>刘世安</a><nav><a href="#education">教育</a><a href="#honors">荣誉</a><a href="#skills">技能</a><a href="#internship">实习</a><a href="#projects">项目</a><a href="#research">科研</a><a href="#blog">博客</a></nav><a className="top-contact" href="mailto:17538251135@163.com">联系 ↗</a></header>

  <div className="resume" id="top">
    <section className="profile">
      <img src="/profile.jpg" alt="刘世安的 GitHub 头像"/>
      <h1>刘世安</h1>
      <p className="profile-role">大模型算法 · AI Agent · 硕士研究生</p>
      <span className="focus">当前方向：LLM 应用、RAG 与 Agent 系统工程化</span>
      <div className="profile-meta"><span>📍 南京</span><a href="mailto:17538251135@163.com">✉ 17538251135@163.com</a><a href="https://github.com/lshan02508-ai">⌁ GitHub</a></div>
    </section>

    <section className="intro-card"><p><strong>你好，我是刘世安。</strong>我关注大模型领域适配、RAG 检索优化、智能体工作流与推理部署，希望把研究中的方法做成可靠、可评估、真正能够运行的系统。</p><blockquote>研究解决“为什么有效”，工程回答“如何稳定地有效”。</blockquote></section>

    <section className="resume-section" id="education"><SectionTitle index="01" title="教育经历" desc="Education"/><div className="education-grid">
      <article><img src="/nnu-logo.png" alt="南京师范大学校徽"/><div><time>2024.09 — 2027.06</time><h3>南京师范大学</h3><p>计算机技术 · 硕士研究生</p><span>南京 · 211</span></div></article>
      <article><img src="/cqjtu-logo.png" alt="重庆交通大学校徽"/><div><time>2020.09 — 2024.07</time><h3>重庆交通大学</h3><p>数据科学与大数据技术 · 本科</p><span>重庆</span></div></article>
    </div></section>

    <section className="resume-section" id="honors"><SectionTitle index="02" title="获奖与奖学金" desc="Honors & Scholarships"/><div className="honor-grid">{awards.map(([title,result],i)=><article key={title}><b>0{i+1}</b><h3>{title}</h3><p>{result}</p></article>)}</div></section>

    <section className="resume-section" id="skills"><SectionTitle index="03" title="个人技能" desc="Skills"/><div className="skill-groups">{skills.map(([group,items])=><article key={group as string}><h3>{group}</h3><div>{(items as string[]).map(item=><span key={item}>{item}</span>)}</div></article>)}</div></section>

    <section className="resume-section" id="internship"><SectionTitle index="04" title="实习经历" desc="Experience"/><article className="case-card internship-card"><div className="case-image"><img src="/internship-cover.png" alt="AI 智能教学实验室场景"/></div><div className="case-content"><div className="case-top"><span>2025.01 — 2025.08</span><b>南京</b></div><h3>大模型应用开发实习生</h3><h4>南京百伦斯智能科技有限公司 · 算法研发部</h4><p>参与初中理化实验 AI 智能教学平台研发，负责领域数据构建、Qwen 指令微调、昇腾 NPU 推理部署与 RAG 检索优化，覆盖从训练数据准备到模型上线验证的完整流程。</p></div></article></section>

    <section className="resume-section" id="projects"><SectionTitle index="05" title="精选项目" desc="Selected Projects"/><div className="project-list">
      <article className="project-item"><img src="/agent-cover.png" alt="智能运维 Agent 项目封面"/><div><span className="project-label">FEATURED · AI AGENT</span><h3>智能运维故障诊断 Agent</h3><p>面向云原生与微服务故障排查，构建 Planner–Executor–Replanner 诊断闭环，将监控、日志、链路与 Runbook 知识统一为可追踪证据。</p><dl><div><dt>问题</dt><dd>排查路径依赖经验，跨工具证据分散</dd></div><div><dt>方案</dt><dd>Qwen + LangGraph + RAG + MCP 多智能体编排</dd></div></dl><div className="tags">{["Qwen","LangGraph","RAG","MCP","Milvus"].map(x=><span key={x}>{x}</span>)}</div></div></article>
      <article className="project-item text-only"><div><span className="project-label">DATASET · MODEL FINETUNING</span><h3>金融研究 LoRA SFT 数据集与 Qwen-14B 微调</h3><p>整合 BizFinBench、FinTruthQA、DISC-Fin-SFT、FinQA 与 TAT-QA 等中英文金融数据，覆盖财报分析、表格文本推理、数值计算、事件逻辑和结构化输出。完成统一对话格式转换、确定性数据切分、全局去重，并在此基础上完成 Qwen-14B LoRA 微调。</p><div className="tags">{["Qwen-14B","LoRA / QLoRA","FinQA","TAT-QA","金融推理"].map(x=><span key={x}>{x}</span>)}</div></div></article>
    </div></section>

    <section className="resume-section" id="research"><SectionTitle index="06" title="科研工作" desc="Research"/><article className="paper-card"><button className="paper-image" aria-label="查看算法图"><img src="/bpm-algorithm.png" alt="BPM 在线推理算法"/></button><div><span className="project-label">FIRST AUTHOR · UNDER REVIEW</span><h3>Boundary-Process Matching for Online Temporal Action Localization</h3><p>将在线时序动作定位建模为边界发现、过程兼容性验证与边界精修的统一框架，通过候选边界与内部时序过程的双向交互，提升动作完整性判断与严格边界定位。</p><div className="paper-results"><span><b>+2.5</b> THUMOS14</span><span><b>+2.4</b> MUSES</span><span><b>+1.6</b> ActivityNet-1.3</span></div><small>IEEE Transactions on Multimedia · 在投</small></div></article></section>

    <section className="resume-section" id="blog"><SectionTitle index="07" title="个人博客" desc="Notes & Essays"/><div className="article-list">{articles.map((a,i)=><a href={`#/blog/${a.slug}`} key={a.slug}><time>{a.date}</time><div><span>{a.category}</span><h3>{a.title}</h3><p>{a.excerpt}</p></div><b>0{i+1} ↗</b></a>)}</div><a className="all-posts" href="#/blog">查看全部文章 →</a></section>

    <footer><p>© 2026 刘世安 · Research, Engineering & Writing</p><div><a href="mailto:17538251135@163.com">Email</a><a href="https://github.com/lshan02508-ai">GitHub</a><a href="#top">Top ↑</a></div></footer>
  </div>
</main>}
