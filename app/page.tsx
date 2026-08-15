import type { ReactNode } from "react";
import { articles } from "./site-data";

function Link({href,className,children}:{href:string;className?:string;children:ReactNode}) {
  return <a href={href.startsWith("/blog") ? `#${href}` : href} className={className}>{children}</a>;
}

const skills = [
  "Qwen / LoRA", "Agent Workflow", "RAG", "LangGraph", "MCP",
  "DeepSpeed", "vLLM", "FastAPI", "Milvus / Qdrant",
];

const metrics = [
  ["86.0%", "垂直领域任务准确率"],
  ["84%", "故障根因识别准确率"],
  ["80%", "复合问题 Recall@5"],
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回首页">
          <span className="brand-mark">LS</span><span>刘世安</span>
        </a>
        <nav aria-label="主导航">
          <a href="#experience">经历</a><a href="#projects">项目</a>
          <a href="#research">科研</a><a href="#honors">荣誉</a>
          <a href="#blog">博客</a>
        </nav>
        <a className="nav-cta" href="mailto:17538251135@163.com">联系我 ↗</a>
      </header>

      <section className="hero section" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" />南京 · 开放实习与合作机会</div>
          <h1>构建可靠、可落地的<br /><em>LLM 与 Agent 系统</em></h1>
          <p className="hero-intro">
            我是刘世安，南京师范大学计算机技术硕士研究生。关注大模型领域适配、
            RAG 检索优化、智能体工作流与推理部署，也在探索在线时序动作定位。
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#projects">查看代表项目 <span>↘</span></a>
            <a className="button secondary" href="https://github.com/lshan02508-ai" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
          <div className="skill-row" aria-label="技术栈">
            {skills.slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </div>
        <aside className="hero-panel" aria-label="个人概览">
          <div className="portrait-card">
            <div className="portrait-grid" />
            <div className="monogram">LSA</div>
            <div className="portrait-caption"><span>RESEARCH × ENGINEERING</span><b>2026</b></div>
          </div>
          <div className="availability"><span>当前方向</span><strong>大模型算法 / Agent</strong></div>
        </aside>
      </section>

      <section className="metrics section" aria-label="关键成果">
        {metrics.map(([value, label], index) => (
          <div className="metric" key={label}><small>0{index + 1}</small><strong>{value}</strong><span>{label}</span></div>
        ))}
      </section>

      <section className="section split-section" id="experience">
        <div className="section-heading sticky-heading"><span>01 / 经历</span><h2>从研究到真实场景</h2><p>把模型指标转化为可被业务使用的系统能力。</p></div>
        <div className="timeline">
          <article className="timeline-item featured">
            <div className="timeline-meta"><span>2025.01 — 2025.08</span><span>南京</span></div>
            <h3>大模型应用开发实习生</h3>
            <h4>南京百伦斯智能科技有限公司 · 算法研发部</h4>
            <p>面向初中理化实验课堂，参与 AI 智能教学平台研发，负责领域数据、Qwen 指令微调、昇腾 NPU 推理部署及 RAG 检索优化。</p>
            <div className="result-grid">
              <div><b>5,415</b><span>训练样本</span></div><div><b>74.5 → 86.0%</b><span>任务准确率</span></div>
              <div><b>50 → 74%</b><span>Top-1 命中率</span></div><div><b>已落地</b><span>多所学校</span></div>
            </div>
          </article>
          <article className="timeline-item education">
            <div className="timeline-meta"><span>2024.09 — 2027.06</span><span>硕士</span></div>
            <h3>南京师范大学</h3><h4>计算机技术 · 211</h4>
          </article>
          <article className="timeline-item education">
            <div className="timeline-meta"><span>2020.09 — 2024.07</span><span>本科</span></div>
            <h3>重庆交通大学</h3><h4>数据科学与大数据技术</h4>
          </article>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="section-heading"><span>02 / 精选项目</span><h2>智能运维故障诊断 Agent</h2></div>
        <article className="project-showcase">
          <div className="project-copy">
            <p className="project-lead">面向云原生与微服务故障排查，构建融合 Qwen、LangGraph、RAG 与 MCP 的智能 OnCall Agent。</p>
            <ul className="clean-list">
              <li><b>领域适配</b><span>统一运维 QA、Telemetry 根因定位与多步诊断轨迹，完成 Qwen-7B LoRA 微调。</span></li>
              <li><b>检索优化</b><span>约 500 篇 Runbook 构建 Milvus 知识库，以诊断语义块和两阶段检索重组证据。</span></li>
              <li><b>Agent 闭环</b><span>Planner 规划、Executor 取证、Replanner 动态调整路径并生成 RCA 报告。</span></li>
              <li><b>工具容错</b><span>通过 MCP 封装监控工具，将调用异常转化为 Agent 可消费的 Observation。</span></li>
            </ul>
            <div className="skill-row">{skills.slice(1).map((skill) => <span key={skill}>{skill}</span>)}</div>
          </div>
          <div className="agent-diagram" aria-label="Agent 工作流示意图">
            <div className="diagram-kicker">DIAGNOSTIC LOOP</div>
            <div className="agent-node main-node"><small>01</small><b>Planner</b><span>生成诊断计划</span></div>
            <div className="flow-line"><span>↓</span></div>
            <div className="agent-node"><small>02</small><b>Executor</b><span>调用工具取证</span></div>
            <div className="tool-nodes"><span>Metrics</span><span>Logs</span><span>Trace</span><span>RAG</span></div>
            <div className="flow-line"><span>↓</span></div>
            <div className="agent-node accent-node"><small>03</small><b>Replanner</b><span>评估证据并调整路径</span></div>
            <div className="loop-label">↖ Observation feedback</div>
          </div>
        </article>
      </section>

      <section className="section research" id="research">
        <div className="section-heading light"><span>03 / 科研</span><h2>让流式视频中的动作边界更可靠</h2></div>
        <div className="paper-card">
          <div className="paper-index">P.01</div>
          <div className="paper-content">
            <div className="paper-status">FIRST AUTHOR · UNDER REVIEW</div>
            <h3>Boundary-Process Matching for<br />Online Temporal Action Localization</h3>
            <p>将在线时序动作定位建模为“因果边界发现、边界-过程兼容性验证与边界精修”的统一框架，通过候选边界与内部时序过程证据的双向交互，提升动作完整性判断与严格边界定位。</p>
            <div className="paper-results"><span><b>+2.5</b> THUMOS14</span><span><b>+2.4</b> MUSES</span><span><b>+1.6</b> ActivityNet-1.3</span></div>
            <small>IEEE Transactions on Multimedia 在投 · CCF-A 类一区期刊</small>
          </div>
        </div>
      </section>

      <section className="section split-section" id="honors">
        <div className="section-heading sticky-heading"><span>04 / 荣誉</span><h2>竞赛与成长轨迹</h2><p>建模、算法与持续学习留下的阶段性坐标。</p></div>
        <div className="honor-list">
          <article><span className="honor-year">2025</span><div><h3>中国研究生数学建模竞赛</h3><p>“华为杯”第二十二届 · 国家三等奖</p></div><b>03</b></article>
          <article><span className="honor-year">2022</span><div><h3>全国大学生数学建模竞赛</h3><p>省级一等奖</p></div><b>01</b></article>
          <article><span className="honor-year">—</span><div><h3>第十三届蓝桥杯</h3><p>二等奖</p></div><b>02</b></article>
          <article><span className="honor-year">2024—25</span><div><h3>研究生学业奖学金</h3><p>二等奖、三等奖</p></div><b>奖</b></article>
        </div>
      </section>

      <section className="section" id="opensource">
        <div className="section-heading row-heading"><div><span>05 / 开源</span><h2>代码与实验记录</h2></div><a href="https://github.com/lshan02508-ai" target="_blank" rel="noreferrer">查看 GitHub 主页 ↗</a></div>
        <div className="repo-grid">
          <article className="repo-card"><div className="repo-top"><span>FEATURED REPOSITORY</span><b>↗</b></div><h3>OnCall Agent</h3><p>面向云原生故障诊断的多智能体工作流、Runbook RAG 与 MCP 工具封装。</p><footer><span>Python</span><span>整理中</span></footer></article>
          <article className="repo-card muted-card"><div className="repo-top"><span>RESEARCH CODE</span><b>↗</b></div><h3>Boundary-Process Matching</h3><p>在线时序动作定位研究代码。将在论文公开条件允许后同步。</p><footer><span>PyTorch</span><span>Coming soon</span></footer></article>
        </div>
      </section>

      <section className="section blog-section" id="blog">
        <div className="section-heading row-heading"><div><span>06 / 思考与记录</span><h2>个人博客</h2></div><Link href="/blog">查看全部文章 →</Link></div>
        <div className="article-grid">
          {articles.slice(0, 3).map((article, index) => (
            <Link className="article-card" href={`/blog/${article.slug}`} key={article.slug}>
              <div><span>{article.category}</span><time>{article.date}</time></div>
              <h3>{article.title}</h3><p>{article.excerpt}</p><footer><span>阅读 {article.readingTime}</span><b>0{index + 1} ↗</b></footer>
            </Link>
          ))}
        </div>
      </section>

      <section className="contact section" id="contact">
        <span className="contact-label">LET&apos;S BUILD SOMETHING MEANINGFUL</span>
        <h2>对研究、工程或一次<br />有趣的合作保持开放。</h2>
        <div className="contact-actions"><a href="mailto:17538251135@163.com">发送邮件 ↗</a><a href="https://github.com/lshan02508-ai" target="_blank" rel="noreferrer">GitHub ↗</a></div>
      </section>

      <footer className="site-footer"><span>© 2026 刘世安</span><span>Research · Engineering · Open Source</span><a href="#top">回到顶部 ↑</a></footer>
    </main>
  );
}
