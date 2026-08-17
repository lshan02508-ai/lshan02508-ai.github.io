---
title: 从 ReAct 到 Planner–Executor–Replanner
slug: planner-executor-replanner
category: AI Agent
date: 2026.07.28
readingTime: 8 分钟
excerpt: 复杂诊断任务中，如何把计划、执行和反思拆开，让 Agent 少走弯路。
lead: 复杂任务需要的不只是更多工具，而是明确的状态、证据与退出条件。
---

## ReAct 的边界

ReAct 适合短链路探索，但在故障排查中容易重复调用工具、遗漏关键步骤，或在错误假设上持续深入。

## 拆分三种职责

Planner 生成可检查的计划；Executor 只执行当前步骤并结构化记录证据；Replanner 判断证据是否充分，并决定是否调整路径。
