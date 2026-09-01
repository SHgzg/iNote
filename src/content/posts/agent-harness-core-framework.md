---
title: "Agent Harness 核心框架：从 LLM 能力到系统能力"
description: "用原始需求、LLM 能力边界、Harness 延伸与未来可替代性四个视角，压缩理解 Agent 系统的核心框架。"
pubDate: 2026-09-01
updatedDate: 2026-09-01
category: "professional-learning"
tags: ["AI Agent", "Harness", "Context Engineering", "Agent 架构"]
featured: false
heroImage: "images/covers/professional.svg"
draft: false
---

# Agent Harness 核心框架：从 LLM 能力到系统能力

## 核心问题

理解 Agent 时，不应该先背 Tools、Memory、RAG、Subagent 等组件，而应该从需求反推：

1. 我们真正希望 AI 完成什么？
2. 裸 LLM 实际只能做什么？
3. 两者之间缺什么系统能力？
4. Harness 现在用什么机制补上这些能力？
5. 哪些机制只是当前模型能力不足的临时 scaffolding，未来可能被模型吸收？
6. 哪些机制来自外部世界和系统边界，不会因为模型变聪明而消失？

## Agent 的原始目标

Agent 的目标不是让 LLM 多回答几次，而是：

> 把 LLM 的理解、推理、生成和决策能力，扩展成能够围绕目标持续、可靠、受控地完成现实任务的系统。

我们期待的是：

```text
长期目标
  ↓
拆解任务
  ↓
寻找信息
  ↓
采取行动
  ↓
观察结果
  ↓
判断是否达标
  ↓
失败后修正
  ↓
保存状态
  ↓
持续推进
```

而裸 LLM 更接近：

```text
Context
  ↓
一次 inference
  ↓
Output
```

Harness 就是在两者之间补齐系统能力。

## 1. LLM：一次 inference，不是长期运行系统

LLM 的核心能力是：

```text
输入 token
→ 理解 / 推理 / 决策
→ 输出 token
```

它本身不天然等于长期任务生命周期、持久状态、外部权限、环境交互、验证和恢复系统。

因此 Agent 的第一层延伸是：

```text
一次智能调用
→
持续任务系统
```

今天通常由外部 Harness 管理 start / continue / pause / resume / terminate 等生命周期。

未来更强的模型可能吸收部分内部循环和长期规划，但任务的开始、停止、取消、超时和恢复仍然是系统层需求。

## 2. Tools：让模型观察和改变外部环境

原始需求：模型不能只在 token 世界里推理，它必须与现实环境交互。

Tools 建立：

```text
Model ↔ Environment
```

包括两类能力：

```text
Perception
- read file
- search web
- query DB
- run tests
- inspect logs

Action
- write file
- call API
- modify code
- operate business system
```

今天的 tool calling 是一种实现。

未来模型可能原生获得 browser、shell、computer use 等能力，因此具体工具接口可能变化，但“感知和影响外部环境”不会消失。

## 3. Loop：把一次 inference 变成闭环行为

原始需求：真实任务中，行动会改变环境，新的环境状态必须影响下一步决策。

因此需要：

```text
Observe
  ↓
Think
  ↓
Act
  ↓
Observe
  ↓
...
```

Loop 的本质不是“多轮聊天”，而是 closed-loop control。

今天的 while loop、ReAct loop 等实现未来可能被更原生的 agentic model 吸收，但根据环境反馈持续调整行为的需求不会消失。

## 4. Context：当前 inference 的 working set

Context 不是系统知道的一切，而是：

> 系统此刻决定让模型看到的一切。

即使拥有极大的 Context Window，也不能默认把所有信息塞进去，因为会出现：

- 相关性稀释；
- 旧信息干扰；
- 多方案混淆；
- 指令冲突；
- 工具输出污染。

因此 Context Window 更像工作桌，而不是知识库。

原始需求不是“扩大窗口”，而是：

> 为当前决策构造最小充分 working set。

这个需求很难因为 Context Window 变大而消失。

## 5. Filesystem：context 之外的持久状态

Filesystem 的原始需求是 durable external state。

它首先解决保存：

```text
Context 外的信息
仍然可以长期存在
```

例如：

```text
articles/
notes/
progress.md
logs/
```

必须区分：

```text
Filesystem ≠ Retrieval
Storage ≠ Search
```

`grep`、索引、语义搜索等才属于检索机制。

未来模型即使拥有更强内部记忆，代码、业务数据、文件、审计记录等外部状态仍然属于系统，因此不会简单消失。

## 6. Memory：被选择长期保留的过去状态

Memory 不是完整历史对话，也不等于 Filesystem。

它是：

> 系统选择长期保存、未来可能重新参与决策的过去状态。

例如：

- 已确认事实；
- 用户偏好；
- 学习进度；
- 历史决策；
- 可复用经验。

Memory 是逻辑概念，可以存储在 filesystem、数据库或其他介质中。

今天很多 memory extraction、summarization 和 retrieval 机制可能随着模型能力提升而变化，但“什么值得记住、何时重新使用、保存多久、哪些允许遗忘”仍然是系统问题。

## 7. Context Engineering：管理 working set 的信噪比

Context Engineering 可以先用四个动作理解。

### write

把当前不需要持续占用 Context、但未来可能需要的信息写到外部状态。

```text
Context
  ↓ write
External State
```

核心是把“长期保存”和“当前可见”解耦。

### select

从庞大的外部状态中，只选当前决策真正需要的信息进入 Context。

```text
Knowledge / Memory / Files
          ↓ select
     Active Context
```

RAG 是 select 的一种实现，不是原始需求本身。

### compress

对未来仍有价值、但不再需要原始粒度的信息进行有损压缩。

目标不是越短越好，而是保留未来决策需要的 minimum sufficient context。

### isolate

给不同任务建立独立 working set，避免中间过程互相污染。

Subagent 是 isolate / parallelism 的一种实现，而不是复杂任务的默认答案。

四个动作的统一目标是：

> 管理当前 working set 的 signal-to-noise ratio。

## 8. Context 的四种典型失败

```text
Poisoning
= 错的信息还活着

Distraction
= 对的信息太多

Confusion
= 多个合理方案分不清

Clash
= 指令互相打架
```

因此 Context Engineering 不只是管理 token 数量，还要管理：

- 信息状态；
- 来源；
- 时间；
- 可信度；
- 适用条件；
- 指令优先级。

Context Item 可以进一步带有：

```text
content
provenance
timestamp
confidence
status
```

其中 status 可以区分 FACT、INFERENCE、OPEN、STALE、INVALIDATED，避免推断逐轮固化成“事实”。

## 9. Planning：把长期目标变成可跟踪状态

Planning 的原始需求不是简单“防止模型跑偏”，而是：

```text
Goal
 ↓
Decomposition
 ↓
Intermediate State
 ↓
Progress Tracking
 ↓
Replanning
```

显式 plan、todo、task graph 都是当前实现。

这是较可能被未来更强模型大量吸收的 Harness scaffolding，但外部计划仍可能因为协作、审计和恢复需求而保留。

## 10. Verification：模型说完成，不代表真的完成

Agent 不能只会执行，还必须验证。

```text
Act
 ↓
Observe
 ↓
Verify
```

模型自评只能提供一种较弱信号。更客观的验证可能来自：

```text
self-check
↓
independent evaluator
↓
rubric
↓
executable test
↓
deterministic invariant
```

Self-verification 可能随着模型能力提升而增强，但外部测试、真实环境反馈和业务约束不会因为模型变聪明而失去价值。

## 11. Recovery：验证失败以后怎么继续

失败后的原始需求不是“一律重试”，而是恢复正确状态。

可能使用：

- retry；
- repair；
- replan；
- rollback；
- resume；
- switch tool；
- ask human；
- reset context。

因此比单纯 ReAct 更稳定的抽象是：

```text
Observe → Verify → Recover
```

## 12. Multi-Agent：真正需求是 isolation 与 parallelism

复杂任务不等于必须使用多个 Agent。

真正需要解决的通常是：

```text
context isolation
parallelism
independent working set
```

Subagent / Multi-Agent 只是实现之一，并且会引入：

- context fragmentation；
- coordination overhead；
- communication loss；
- conflicting decisions；
- token cost。

因此默认应先考虑：

```text
single agent
+ good context
+ tools
+ filesystem
```

只有隔离或并行带来的收益足够大时，再引入 Subagent。

## 13. Harness 不只补模型能力

Harness 机制至少来自四种原因：

```text
Capability
Reliability
Governance
Economics
```

### Capability

模型现在不会或不稳定：Planning、Context Management、Memory、部分 Verification 等。

### Reliability

现实系统会失败：Retry、Checkpoint、Rollback、Fallback 等。

### Governance

系统必须规定模型允许做什么：Permissions、Sandbox、Authentication、Human Approval、Audit 等。

### Economics

任务必须受到资源限制：Budget、Rate Limit、Timeout、Cache 等。

这一区分决定了哪些 Harness 会随着模型变强而消失。

## 14. 哪些能力未来可能被大模型替代

判断时必须区分：

```text
Requirement ≠ Implementation
```

### 更可能被模型吸收

主要因为“模型目前还不会或不稳定”而存在：

- 显式 Planning；
- Reflection；
- Self-verification prompt；
- 部分外部 Loop；
- 部分 Context Selection；
- 部分 Tool Orchestration；
- 部分 Task Decomposition；
- 部分 Multi-Agent Coordination。

### 不会因为模型变聪明而自然消失

主要来自外部世界和系统边界：

- External State；
- Permissions；
- Sandbox；
- Authentication；
- Audit；
- Business Invariants；
- Resource Limits；
- Human Authority；
- Environment Feedback。

核心判断：

> 凡是因为“模型现在不会”而存在的 Harness，都可能随着模型能力提升而收缩；凡是因为“外部世界、组织规则和系统边界客观存在”而产生的 Harness，通常不会随着模型变聪明而消失。

## 15. 把所有能力串起来

```text
                  User Goal
                      │
                      ▼
                 Goal / Plan
                      │
                      ▼
               Context Selection
                      │
        ┌─────────────┼─────────────┐
        │             │             │
      Memory      Filesystem     Knowledge
        │             │             │
        └────── select / retrieve ───┘
                      │
                      ▼
                Context Window
                      │
                      ▼
                    Model
                      │
                      ▼
                    Tools
                      │
                      ▼
                 Environment
                      │
                      ▼
                 Observation
                      │
                      ▼
                Verification
                      │
               ┌──────┴──────┐
               │             │
             Pass          Fail
               │             │
               ▼             ▼
          Update State    Recovery
               │             │
               └──────┬──────┘
                      ▼
                  Next Loop
```

外层同时存在：

```text
Governance
Reliability
Economics
```

这才是生产 Agent 的完整方向。

## 最值得长期记住的十条

1. LLM 本质上是一次 inference，不是一个长期运行系统。
2. Agent 的目标是把 LLM 扩展成围绕目标持续完成现实任务的系统。
3. Tools 让模型能够观察和改变外部环境。
4. Loop 让一次 inference 变成持续的闭环行为。
5. Context 不是系统知道的一切，而是系统此刻决定让模型看到的一切。
6. Filesystem 是持久状态，不等于检索；Memory 是被选择长期保留的过去状态。
7. Context Engineering 的核心是 write / select / compress / isolate，本质是管理 working set 的信噪比。
8. Agent 不能只会执行，还必须 observe → verify → recover。
9. Multi-Agent 不是目的，真正的需求通常是 isolation、parallelism 和独立 working set。
10. Harness 不只补模型能力，还承担 Reliability、Governance 和 Economics；后三类需求不会因为模型变聪明而自动消失。

以后分析任何 Agent 设计，都可以问三个问题：

> 它解决的是哪个原始需求？
>
> 它采用了什么当前实现？
>
> 如果模型能力提升十倍，这个实现还剩多少必要性？
