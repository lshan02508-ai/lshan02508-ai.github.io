export type Article = {
  slug: string; title: string; category: string; date: string; readingTime: string;
  excerpt: string; lead: string; sections: { heading: string; paragraphs: string[] }[];
};

export const articles: Article[] = [
  {
    slug: "rag-for-composite-questions", title: "复合问题为什么容易让 RAG 漏召回？", category: "RAG / 检索", date: "2026.08", readingTime: "6 分钟",
    excerpt: "从整题表征的信息稀释出发，拆解题干抽取、子问题分解与候选融合的完整链路。",
    lead: "当一道题同时包含多个知识点时，单个向量往往无法完整表达所有检索意图。",
    sections: [
      { heading: "问题从哪里开始", paragraphs: ["复合问题将公共题干、多个子问和隐含约束压缩进同一个向量。语义中心会偏向显著词汇，次要知识点因此难以进入候选集合。", "只增加召回数量并不能根治问题，还会把更多噪声交给重排模型。"] },
      { heading: "一条更可控的链路", paragraphs: ["实践中可以先抽取公共题干，再将各子问题改写为语义完整的独立查询，分别检索后统一融合与去重。", "评测也应从整题命中转为知识点覆盖，观察每个子意图是否获得了可用证据。"] },
      { heading: "工程上的取舍", paragraphs: ["问题分解增加了调用成本与时延，因此需要限制子查询数量、缓存公共上下文，并在简单问题上跳过分解。最终目标不是更复杂的链路，而是可解释、可评测的检索行为。"] },
    ],
  },
  {
    slug: "planner-executor-replanner", title: "从 ReAct 到 Planner–Executor–Replanner", category: "AI Agent", date: "2026.07", readingTime: "8 分钟",
    excerpt: "复杂诊断任务中，如何把计划、执行和反思拆开，让 Agent 少走弯路。",
    lead: "复杂任务需要的不只是更多工具，而是明确的状态、证据与退出条件。",
    sections: [
      { heading: "ReAct 的边界", paragraphs: ["ReAct 适合短链路探索，但在故障排查中容易重复调用同一工具、遗漏关键步骤，或者在错误假设上持续深入。", "当上下文持续增长，模型也更难区分计划、观察和已经验证的事实。"] },
      { heading: "拆分三种职责", paragraphs: ["Planner 根据故障描述、Runbook 和相似案例生成可检查的计划；Executor 只负责执行当前步骤并结构化记录证据；Replanner 则判断证据是否充分以及下一步是否需要调整。"] },
      { heading: "证据比答案更重要", paragraphs: ["诊断 Agent 的最终输出应显式关联关键指标、日志和调用结果。即使工具失败，也应把失败转化成结构化 Observation，让系统知道证据缺口在哪里。"] },
    ],
  },
  {
    slug: "vertical-qwen-sft", title: "垂直领域 Qwen 微调：数据比参数更重要", category: "模型微调", date: "2026.06", readingTime: "7 分钟",
    excerpt: "从原始 QA 到多轮 ChatML，记录领域数据清洗、任务重构与验证集设计。",
    lead: "LoRA 降低了训练门槛，但真正决定领域能力上限的仍然是数据定义。",
    sections: [
      { heading: "先定义模型应该会什么", paragraphs: ["领域微调不应从收集数据开始，而应先列出任务类型、输入状态、输出约束和失败边界。只有任务定义稳定，数据清洗规则才有一致标准。"] },
      { heading: "把 QA 变成任务过程", paragraphs: ["教学场景不只是问题与答案，还包括教师出题、学生作答、正误反馈和知识解析。将这些状态重构为多轮对话，可以让模型学习指令遵循和反馈方式，而不只是记忆知识。"] },
      { heading: "验证集需要贴近真实分布", paragraphs: ["随机切分容易泄漏同类题型。更稳妥的方式是按知识点、实验阶段或问题模板分组划分，并分别报告准确性、格式遵循和解释质量。"] },
    ],
  },
];
