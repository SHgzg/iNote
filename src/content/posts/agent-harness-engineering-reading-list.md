---
title: "Agent / Harness Engineering 阅读清单"
description: "系统阅读 2025–2026 年 Agent / Harness Engineering 一手工程文章，建立模型之外系统层的完整心智模型。"
pubDate: 2026-09-04
updatedDate: 2026-09-04
category: "reading-notes"
tags: ["AI Agent", "Harness", "Context Engineering", "阅读清单"]
featured: false
heroImage: "images/covers/reading.svg"
draft: false
---

# Agent / Harness Engineering 阅读清单

## 阅读目标

系统啃完 2025–2026 年 Agent 领域值得重点阅读的一手工程博客，建立“模型之外那层系统”的完整心智模型。

核心命题：

> **Agent = Model + Harness。模型决定上限，Harness 决定下限。**

先记住三层关系：

```text
Prompt Engineering
→ 解决“怎么表达任务”

Context Engineering
→ 解决“给 Agent 看什么”

Harness Engineering
→ 解决“系统怎么防崩、怎么持续运转、怎么纠错”
```

Harness 包含：系统提示词、工具定义与实现、文件系统、沙箱环境、编排逻辑、Hooks / Middleware、长期记忆、日志与可观测。

一个用于校准边界的判断是：如果讨论的不是模型训练本身，那么多数 Agent 工程工作都发生在 Harness 这一层。

## 三个用于校准认知的数据点

| 现象 | 数据 |
| --- | --- |
| 同一模型换一套 harness | Opus 4.5 在 Claude Code 中 78%，在 Smolagents 中 42% |
| 只改文件编辑接口 | 编码基准 6.7% → 68.3%，模型与 prompt 均未变 |
| 模型固定，只改 harness | LangChain Terminal Bench 2.0：52.8 → 66.5，Top 30 → Top 5 |

这些数字要表达的不是“模型不重要”，而是：同一个模型在不同 Harness 中可能表现出完全不同的可靠性下限。

---

# A. 建立心智模型

## A1. The Anatomy of an Agent Harness

- 来源：LangChain
- 链接：<https://langchain.com/blog/the-anatomy-of-an-agent-harness>
- 为什么读：给 Harness 一个非常干净的定义，并从模型做不到什么出发，逐项推导文件系统、bash、subagent、hooks 为什么存在。
- 读完要能回答：Harness 有哪些组件？每一项分别在补模型什么缺陷？
- 状态：☐ 未读 ☐ 在读 ☐ 已读

## A2. Building Effective Agents

- 来源：Anthropic Engineering
- 入口：<https://anthropic.com/engineering>
- 为什么读：理解 Agent 基本闭环、ReAct、任务拆解，以及什么时候不该用 Agent。
- 读完要能回答：Workflow 和 Agent 的边界在哪里？哪些场景用确定性流程更合适？
- 状态：☐ 未读 ☐ 在读 ☐ 已读

## A3. Building Agents with the Claude Agent SDK

- 来源：Anthropic Engineering
- 入口：<https://anthropic.com/engineering>
- 为什么读：核心设计原则是“给 Agent 一台电脑”。重点理解为什么一套为 coding 设计的 harness，可以迁移到金融分析、研究、视频创作等非编码场景。
- 读完要能回答：“给模型一台电脑”具体指什么？`gather context → take action → verify work → repeat` 这个 loop 如何迁移到业务？
- 状态：☐ 未读 ☐ 在读 ☐ 已读

---

# B. 上下文工程：Agent 的核心瓶颈

## B1. Effective Context Engineering for AI Agents

- 来源：Anthropic Engineering
- 入口：<https://anthropic.com/engineering>
- 核心：把 LLM 类比为 CPU、Context Window 类比为 RAM，重点理解上下文为什么需要精细管理。
- 状态：☐

## B2. Context Engineering for Agents

- 来源：LangChain（Lance Martin）
- 链接：<https://blog.langchain.com/context-engineering-for-agents/>
- 核心：四大策略 `write / select / compress / isolate`，并结合真实 Agent 的实现案例。
- 状态：☐

## B3. How Contexts Fail — and How to Fix Them

- 来源：Drew Breunig
- 链接：<https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html>
- 核心：上下文四大失败模式：`Poisoning / Distraction / Confusion / Clash`，用于打破“长上下文 = 高质量”的直觉。
- 状态：☐

## B4. The New Skill in AI is Not Prompting, It's Context Engineering

- 来源：Philipp Schmid（Google DeepMind）
- 链接：<https://www.philschmid.de/context-engineering>
- 核心：用“六层上下文”模型建立术语框架：指令、历史、长期记忆、RAG、工具、输出格式。
- 状态：☐

## B5. Context Engineering for AI Agents — Lessons from Building Manus

- 来源：Manus 团队
- 入口：搜索 `Manus context engineering lessons`
- 核心：一线产品团队对放弃微调、转向上下文工程的复盘，以及 KV-cache、工具遮蔽、文件系统作为外部记忆等工程问题。
- 状态：☐

---

# C. 长任务与 Harness 架构设计

## C1. Effective Harnesses for Long-Running Agents

- 来源：Anthropic Engineering
- 入口：<https://anthropic.com/engineering>
- 核心：跨 Context Window 的长任务问题。重点是 initializer agent + coding agent 的双角色设计，以及结构化交接状态。
- 状态：☐

## C2. Harness Design for Long-Running Application Development

- 来源：Anthropic Engineering
- 入口：<https://anthropic.com/engineering>
- 核心：planner / generator / evaluator 三智能体架构。
- 重点关注：
  1. Context Reset 与 Compaction 的差异；
  2. Agent 自评偏差及独立 evaluator 的必要性。
- 状态：☐

## C3. Agent Harness Design: 3 Patterns for Harnessing Claude's Intelligence

- 来源：Anthropic
- 入口：搜索 `Anthropic agent harness design 3 patterns`
- 核心：重点不是继续加 Harness，而是问哪些东西该删。模型能力提升后，一些“模型做不到所以 Harness 兜底”的假设会过期。
- 状态：☐

## C4. Agent Harness: Scaling the Claw or Harness Capabilities

- 来源：Microsoft Dev Blogs
- 链接：<https://devblogs.microsoft.com/agent-framework/agent-harness-scaling-the-claw-or-harness-capabilities>
- 核心：四条扩展轴：Skills 按需加载、Shell 工具、CodeAct、后台 Subagent 并发。
- 状态：☐

## C5. How Middleware Lets You Customize Your Agent Harness

- 来源：LangChain Blog
- 链接：<https://blog.langchain.com/how-middleware-lets-you-customize-your-agent-harness>
- 核心：`before_agent / before_model / wrap_model_call / wrap_tool_call / after_model / after_agent` 等 hooks。重点判断哪些规则不能只放 Prompt，而必须 deterministic 地触发，例如 PII 脱敏与内容审核。
- 状态：☐

---

# D. 迭代方法论与工程化

## D1. Improving Deep Agents with Harness Engineering

- 来源：LangChain Blog
- 链接：<https://blog.langchain.com/improving-deep-agents-with-harness-engineering>
- 核心：模型固定，只改 Harness，通过 Trace → 错误分析 → 定向修改 Harness → 再评测的方式提升 Agent。
- 可复制方法：
  1. 从 LangSmith 拉 Trace；
  2. 并行分析失败样本；
  3. 由主 Agent 综合问题；
  4. 人只在修改 Harness 时把关，防止过拟合。
- 关键问题：模型是否会主动进入 build → verify 循环？如果不会，Harness 怎样强制验证？
- 状态：☐

## D2. Harness Engineering: Leveraging Codex in an Agent-First World

- 来源：OpenAI
- 链接：<https://openai.com/index/harness-engineering/>
- 核心：工程师的主要工作逐渐从直接写代码，转向设计环境、表达意图、构建可靠反馈回路。
- 四个关键词：`constrain / inform / verify / correct`。
- 关键心态：失败时不要只是“再试一次”，而要问“系统缺什么能力？如何让能力对 Agent 可见并可强制执行？”
- 状态：☐

## D3. Unlocking the Codex Harness: How We Built the App Server

- 来源：OpenAI
- 入口：搜索 `OpenAI Codex App Server harness`
- 核心：Thread 生命周期与持久化、配置与鉴权、工具执行、MCP 集成，以及对外接口设计。
- 状态：☐

## D4. Agentic Harness Engineering（复旦 AHE）

- 来源：复旦大学 + 北大 + 上海奇绩智峰
- 链接：<https://dawning-road.github.io/blog/agentic-Harness-engineering>
- 核心：让 Agent 自动优化 Agent Harness。重点看组件可观测、经验可观测、决策可观测三层设计，以及如何让 Debugger 把大规模 Trace 转成可消费反馈。
- 状态：☐

---

# E. 反主流观点：用于校准

## E1. Don't Build Multi-Agents

- 来源：Cognition Labs
- 链接：<https://cognition.ai/blog/dont-build-multi-agents>
- 核心：反对简单角色拆分导致的上下文碎片化、决策冲突与协调损耗，强调共享完整上下文轨迹。
- 用法：读完 C2 / C4 后立刻读，用于对冲多智能体叙事。
- 状态：☐

## E2. 12-Factor Agents

- 来源：HumanLayer
- 链接：<https://github.com/humanlayer/12-factor-agents>
- 核心：12 条工程原则，尤其关注 Factor 03 “Own Your Context Window”。
- 状态：☐

## E3. 长期追更的个人站

- Lil'Log（Lilian Weng）：<https://lilianweng.github.io> —— Agent / 推理 / 记忆。
- Simon Willison's Weblog：<https://simonwillison.net> —— 一线实践与工具评测。
- Hamel Husain：搜索 `Hamel Husain blog` —— Evals 与错误分析。
- Eugene Yan：<https://eugeneyan.com> —— 应用侧与评测方法。
- 状态：☐ 已订阅

---

# F. 中文内容与综述

## F1. 从零开始设计实现一个 AI Agent 框架

- 来源：腾讯技术工程
- 入口：搜索 `腾讯技术工程 从零开始设计实现一个AI Agent框架`
- 核心：从 ReAct / Plan-and-Execute / Reflection 到 CodeAct 的演进，用于建立整体坐标系。
- 状态：☐

## F2. A Survey of Context Engineering for Large Language Models

- 来源：arXiv
- 链接：<https://arxiv.org/abs/2507.13334>
- PDF：<https://arxiv.org/pdf/2507.13334>
- 核心：将 Context Engineering 按基础组件与系统实现两层组织，适合作为工具书查阅。
- 重点关注：模型理解复杂上下文与生成同等复杂度长输出之间可能存在不对称。
- 状态：☐

## F3. 6.7% 到 68.3%：Harness Engineering 六大支柱

- 来源：腾讯云开发者社区
- 链接：<https://cloud.tencent.com/developer/article/2660978>
- 核心：中文综述，将 Harness 拆成六层架构，适合快速回顾。
- 状态：☐

---

# 三条阅读路线

## 速通路线

适合快速抓住骨架：

1. A1 The Anatomy of an Agent Harness
2. B1 Effective Context Engineering for AI Agents
3. D2 OpenAI Harness Engineering
4. D1 Improving Deep Agents with Harness Engineering
5. C3 Agent Harness Design: 3 Patterns

## 标准路线

按 A → B → C → D 阅读，每篇完成一次结构化笔记。

## 完整路线

A → B → C → D → E → F。

E 应放在 D 之后，用来形成架构观点上的对冲；F 更适合作为综述与查阅资料。

---

# 每篇文章的阅读笔记模板

```markdown
### [文章标题]
- 日期：
- 一句话主旨：
- 核心机制（3 条以内）：
  1.
  2.
  3.
- 最反直觉的一点：
- 可直接抄到项目里的：
- 我不同意 / 存疑的地方：
- 待验证的假设：
```

---

# 贯穿全程的三个问题

阅读每篇文章时始终带着以下三个问题：

## 1. 这个设计是在补模型的什么缺陷？

如果两年后模型能力更强，这项 Harness 机制是否仍有必要？

这用于区分：

```text
Fundamental Requirement
vs
Current Implementation
```

## 2. 失败时怎么归因？

需要持续追问：

- 有没有 Trace？
- 能不能复现？
- 问题来自模型、Context、Tool、State、Policy 还是 Eval？
- 修改以后怎样证明不是对单一 Task 过拟合？

## 3. 哪些规则必须 deterministic？

需要判断：

```text
需要开放语义判断
→ Model / Prompt

必须稳定执行、不可被绕过
→ Harness Code / Policy / Hook
```

例如权限、审批、PII 处理、硬性资源限制，不应只依赖 Prompt。

---

# 核心术语速查

| 术语 | 含义 |
| --- | --- |
| Harness | 模型之外用于组织 Context、Tools、State、执行、约束、验证与恢复的系统层 |
| Compaction | 就地压缩历史，使同一 Agent 在较小 Context 中继续运行 |
| Context Reset | 清空当前 Context，由新的 Agent / Session 依赖结构化状态继续任务 |
| Context Anxiety | 模型误判接近 Context 上限，提前草草收尾的现象 |
| Ralph Loop | 用 Hook 拦截退出尝试并重新注入任务状态，迫使 Agent 继续工作的一类模式 |
| CodeAct | 让 Agent 通过写代码完成部分动作与计算，而不是为每一步都预定义工具 |
| Middleware / Hooks | 在 Agent Loop 的各阶段插入确定性逻辑 |
| Subagent | 使用独立 Context 执行子任务，换取隔离或并行，但增加协调与 Token 成本 |
| Self-verification | 让 Agent 对自身产物进行测试或检查；可靠系统通常还需要外部验证机制 |

---

# 阅读时的总原则

不要停留在“某个框架有没有某个组件”，而应持续追问：

```text
原始需求是什么？
↓
裸模型缺什么？
↓
Harness 当前怎么补？
↓
这是 Fundamental Requirement
还是当前 Implementation？
↓
模型能力提升后还需要吗？
↓
如果失败，如何观察、归因、验证和修正？
```

最终目标不是记住 20 多篇文章，而是建立一套可以用于设计和评估 Agent 系统的 Harness Engineering 心智模型。
