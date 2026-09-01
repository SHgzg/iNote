---
title: "初识 Harness：从一次推理到可持续 Agent 系统"
description: "从真实需求出发，系统理解 LLM、Loop、Tools、Context、Filesystem、Memory、Verification、Recovery 与治理机制如何共同组成 Agent Harness。"
pubDate: 2026-07-22
updatedDate: 2026-09-01
category: "study-notes"
tags: ["Harness", "AI Agent", "Context Engineering", "Agent 架构"]
featured: false
heroImage: "images/covers/study.svg"
draft: false
---

# 初识 Harness：从一次推理到可持续 Agent 系统

## 从真实需求开始：我们到底希望 AI 做什么

如果目标只是回答一个问题，LLM 已经足够强。但真实的 Agent 需求通常不是“一次回答”，而是：

- 围绕一个长期目标持续推进；
- 自己拆解任务并维护进度；
- 查找资料、读取文件、调用系统；
- 根据环境反馈修正下一步；
- 保存跨轮次、跨会话的状态；
- 在失败后恢复，而不是简单停掉；
- 判断结果是否真的达到要求；
- 在权限、安全、成本和时间边界内行动。

因此，Agent 的目标不是让 LLM 多回答几次，而是把 LLM 的理解、推理、生成和决策能力，扩展成一个能够围绕目标持续、可靠、受控地完成任务的系统。

可以先把最核心的差距写成：

```text
我们想要：
长期目标 → 计划 → 行动 → 观察 → 验证 → 修正 → 持续推进

裸 LLM：
输入 Context → 一次 inference → 输出 token
```

两者之间缺失的系统能力，就是 Harness 为什么存在。

## LLM 本质上是什么

从 Agent Engineering 的角度，可以先把 LLM 看成一次 inference：

```text
输入 token
   ↓
理解 / 推理 / 决策
   ↓
输出 token
```

它可以非常聪明，但它本身不是一个长期运行系统。它天然不等于：

- 长期任务生命周期；
- 外部状态存储；
- 文件系统；
- 网络访问；
- 权限控制；
- 环境隔离；
- 可靠验证；
- 错误恢复；
- 长期记忆；
- 任务调度。

因此，Agent 的基本问题不是“怎样让模型更聪明”，而是：

> 怎样把一次性的智能调用组织成一个能够长期观察、行动、验证和恢复的系统？

## Agent 与 Harness 的关系

可以先用一个近似模型理解：

```text
Agent System
= Model + Harness + Runtime + Environment
```

- **Model**：负责理解、推理、生成和局部决策。
- **Harness**：组织模型如何获得信息、采取行动、维护状态、接受约束、验证结果和处理失败。
- **Runtime**：让任务能够真正运行、暂停、恢复、持久化和管理生命周期。
- **Environment**：Agent 可以观察和改变的外部世界。

“Harness”没有唯一严格的行业边界，但一个稳定的判断是：如果某个机制主要决定模型在任务中如何观察、行动、纠错和受到约束，它通常属于 Harness 的讨论范围。

## 第一步：Loop，把一次 inference 变成持续行为

裸模型只能完成一次输入到输出。真实任务却经常需要：

```text
思考
↓
行动
↓
看到新结果
↓
重新思考
↓
再次行动
```

因此最基础的扩展是 Loop：

```text
Model
  ↓ Action
Environment
  ↓ Observation
Model
```

Loop 解决的原始需求不是“多轮聊天”，而是：

> 行动会改变环境，新的环境状态必须重新影响下一轮决策。

所以 Agent 更接近一个 closed-loop control system，而不是单纯的聊天机器人。

今天常见的实现可能是 `while loop`、ReAct loop 或框架内部调度。未来更强的模型可能原生吸收部分循环能力，但“任务需要根据环境反馈持续调整”这个需求不会消失。

## 第二步：Tools，让模型能够感知和改变外部环境

LLM 输出的是 token。它可以说“应该读取文件”，但这句话本身不会真正打开文件。

Tools 的原始需求是建立：

```text
Model ↔ Environment
```

这个接口。

Tools 大体有两个方向。

### Perception：观察世界

例如：

- 读取文件；
- 搜索网页；
- 查询数据库；
- 运行测试；
- 查看日志；
- 检查 Git diff。

### Action：改变世界

例如：

- 写文件；
- 调用 API；
- 修改代码；
- 操作业务系统；
- 提交变更。

因此，Tools 的本质不只是“让模型做事”，而是提供感知与行动接口。

未来模型可能原生拥有更强的 computer use、shell 或 browser 能力，今天具体的 tool-calling interface 可能变化，但“模型必须与外部环境交互”这个需求不会消失。

## 为什么 Loop + Tools 仍然不够

有了循环和工具，Agent 已经可以持续行动，但马上会出现更难的问题：

- 什么时候应该退出？
- 什么样的结果算完成？
- 如何证明模型没有过早宣称完成？
- 工具失败后应该重试、重规划还是回滚？
- 上下文越来越长怎么办？
- 哪些历史信息应该继续保留？
- 哪些工具当前允许调用？
- 哪些操作必须人工审批？
- 一个任务运行几个小时后，状态保存在哪里？
- 多个任务如何避免上下文互相污染？

因此：

```text
Loop + Tools
= 能持续行动

生产级 Agent Harness
= 能持续、正确、可恢复、受约束地完成任务
```

真正困难的 Harness Engineering 从这里开始。

## Harness 机制来自四类根本需求

Harness 不能只理解为“补模型能力”。它至少来自四类问题。

### 1. Capability：模型当前做不到什么

例如：

- 长任务容易偏离；
- 不能稳定维护长期状态；
- 不会可靠自测；
- 当前 Context 有限；
- 无法直接访问外部环境。

对应机制包括：

- Planning；
- Memory；
- Context Management；
- Tools；
- Verification。

这类 scaffolding 最有可能随着模型能力提升而减少。

### 2. Reliability：系统失败以后怎么办

现实系统会遇到：

- API 503；
- network timeout；
- tool crash；
- 输出格式错误；
- 状态中断。

对应机制包括：

- Retry；
- Recovery；
- Checkpoint；
- Rollback；
- Fallback。

这类机制解决的是可靠性，不只是模型智力问题。

### 3. Governance：系统允许模型做什么

即使模型判断完全正确，也不代表它自动拥有无限权限。

例如：

- 不能随便删除文件；
- 不能访问未授权数据库；
- 不能泄露敏感信息；
- 高金额操作必须人工审批；
- 高风险操作必须被审计。

对应机制包括：

- Permissions；
- Sandbox；
- Authentication；
- Human Approval；
- Privacy Policy；
- Audit。

这类机制不会因为模型变聪明而消失。模型能力越强，某些控制反而越重要。

### 4. Economics：任务能花多少资源

Agent 不能无限消耗：

- token；
- 时间；
- API 成本；
- 算力；
- 并发；
- 工具调用次数。

因此还需要：

- Budget；
- Rate Limit；
- Timeout；
- Cache；
- Resource Limit。

## Context：系统此刻决定让模型看到什么

Context Window 不是整个知识库，而是模型这一次 inference 真正能够直接处理的 working set。

里面可能包含：

- system prompt；
- 用户当前目标；
- 对话历史；
- 检索到的文档；
- 工具输出；
- Memory；
- Plan；
- 文件片段。

因此：

```text
Context Window ≠ 系统知道的一切
Context Window = 模型此刻真正看到的工作集
```

Context Engineering 的问题也不只是“装不下”。即使 context window 足够大，把所有信息塞进去仍然可能让模型表现下降，因为会发生注意力稀释、旧状态干扰、多个方案混淆和指令冲突。

可以用一句话概括：

> Context 不是系统知道的一切，而是系统此刻决定让模型看到的一切。

## Context Window、Filesystem、Memory 与 Retrieval 的区别

这是容易混淆、但必须明确的四个概念。

### Context Window：当前工作桌

Context Window 是当前 inference 中真正参与模型计算的信息。

类比：

```text
Context Window = 办公桌
```

桌上的内容必须是当前决策真正需要的 working set。

### Filesystem：持久状态

Filesystem 首先是 context 外部的 durable external state。

例如：

```text
articles/
notes/
progress.md
logs/
```

Filesystem 的核心是保存，不是检索。

必须区分：

```text
Storage ≠ Retrieval
Filesystem ≠ Search
```

`grep`、`find`、索引、语义搜索等才是检索机制。

类比：

```text
Filesystem = 书柜
Retrieval = 去书柜找资料的方法
```

### Memory：被选择长期保留的过去状态

Memory 不是“全部历史对话”，而是系统认为未来可能有价值，因此选择长期保留的信息。

例如：

- 已确认事实；
- 用户偏好；
- 学习进度；
- 历史架构决策；
- 可复用经验。

Memory 可以存储在 filesystem、数据库、向量库或其他介质中。因此 Memory 是逻辑概念，Filesystem 是存储 primitive。

Memory 只有在未来被重新选择时，才重新进入 Context Window。

## Context Engineering：write / select / compress / isolate

Context Engineering 的目标不是保存更多，而是管理 working set 的信噪比。

### Write：把信息移出当前 Context，但不丢失

`write` 不是“往 Context 里增加内容”，而是把当前不需要持续占用 Context、但未来可能回看的信息写到外部状态。

例如：

```text
20,000 token 工具输出
        ↓ write
logs/result.txt
        ↓
Context 只保留：关键结果 + 文件位置
```

它解决的是：

> 把“长期保存”与“当前可见”解耦。

### Select：只取当前真正需要的信息

当系统拥有大量文章、历史问答、工具结果和 Memory 时，不应该全部进入 Context。

Select 的目标是：

```text
External State
      ↓ select
Minimum Sufficient Context
```

RAG 是一种 select implementation，而不是原始需求本身。

原始需求是：

> 从庞大的外部信息中，找到当前任务真正需要的部分。

### Compress：降低粒度，而不是机械缩短

当原始细节未来不太可能逐字需要，但整体语义仍有价值时，可以压缩。

例如把几十轮讨论压成：

```text
已确认：
- 使用 filesystem 作为 durable state
- verification 需要外部证据

未解决：
- memory lifecycle
- context reset threshold
```

Compression 是有损操作，因此不能默认“每轮都压缩”。判断标准应是：

> 未来决策还需要什么粒度的信息？

目标是保留 minimum sufficient context，而不是越短越好。

### Isolate：隔离不同任务的 working set

当两个任务需要的资料、工具输出和中间过程差异很大时，把它们混进同一个 Context 会造成污染。

例如：

```text
任务 A：精读 Context Engineering
任务 B：调研 10 个 Agent Framework
```

可以拆成独立 context / subagent，只共享最小任务契约和最终结构化产物。

一个更合理的生命周期是：

```text
spawn
↓
work in isolation
↓
produce artifact
↓
validate artifact
↓
merge useful result
↓
destroy transient context
```

核心原则是：

> 隔离过程，传递状态。

## 四种典型 Context Failure

长 Context 的问题不仅是长度，还包括内容质量和结构。

### Poisoning：错的信息还活着

例如项目已经确认使用 MySQL，但旧的 PostgreSQL 推断仍长期留在 Context。

旧错误会被后续推理不断继承，形成上下文中毒。

修复方向包括：

- invalidation；
- provenance；
- state versioning；
- 将错误状态移出 active context。

### Distraction：对的信息太多，但当前没用

例如只修登录 Bug，却把整个仓库、全部日志和过去一个月的 PR 都塞入 Context。

信息都可能正确，但会稀释当前任务的信号。

修复方向包括：

- select；
- compress；
- isolate。

### Confusion：多个正确方案缺少适用边界

例如同时提供不同版本框架的五套正确实现，但没有说明版本、前置条件和适用范围。

模型可能把不同方案局部拼接成一个实际不存在的组合。

修复重点不是简单缩短，而是补充：

- applicability；
- version；
- precondition；
- priority。

### Clash：指令互相冲突

例如：

```text
System：删除操作必须先确认
User：不要问我，直接删除
```

这类问题即使 Context 很短也存在。它需要明确 instruction hierarchy 和 deterministic policy，不能完全依赖模型临场判断。

可以用四句话记住：

```text
Poisoning   = 错的信息还活着
Distraction = 对的信息太多
Confusion   = 多个合理方案分不清
Clash       = 指令互相打架
```

## Context Item 不应该只有文本

为了避免假设逐轮固化，信息最好同时携带状态。

一个 Context Item 可以考虑：

```text
content
provenance
Timestamp
confidence
status
```

其中 `status` 可以区分：

```text
FACT
INFERENCE
OPEN
STALE
INVALIDATED
```

例如：

```text
content: 项目使用 MySQL 8.0
provenance: 用户明确确认
confidence: high
status: FACT
```

而旧推断可以保存在 historical state 中：

```text
content: 项目可能使用 PostgreSQL
status: INVALIDATED
```

这样错误信息可以从 Active Context 中移出，但仍保留版本和来源，避免简单删除造成不可追溯。

因此，Context Engineering 不只是“挑文本”，更接近：

> 管理模型运行时的认知状态。

## Planning：把长期目标变成可跟踪的中间状态

Planning 不只是防止模型跑偏。

更完整的作用是：

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

它把无法一次完成的长期目标，转换成可推进、可检查的阶段状态。

今天很多 Harness 会显式维护 plan、todo 或 task graph。未来更强模型可能原生吸收大量 planning scaffolding，但外部系统仍可能保存计划，用于协作、审计和状态恢复。

## Verification：模型说完成，不等于真的完成

Agent 常见失败之一是：

```text
模型：
“我觉得已经完成了。”
```

这不是可靠验证。

生产系统更需要：

```text
Plan
 ↓
Act
 ↓
Observe
 ↓
Verify / Evaluate
 ↓
Recover
```

验证信号可以有不同强度：

```text
模型自查
   ↓
独立 evaluator
   ↓
rubric
   ↓
executable test
   ↓
deterministic invariant
```

例如“代码看起来没问题”远弱于真实测试通过。但测试通过也不自动等于用户需求完全满足，因为测试本身可能不完整。

因此 Verification 本身也是完整的架构问题。

## Recovery：验证失败以后怎么办

失败后不应该只有机械 retry。

可能的恢复动作包括：

- **Retry**：临时错误时重新执行同一动作；
- **Repair**：修复当前产物；
- **Replan**：承认原策略有问题并改变路径；
- **Rollback**：撤销已经造成的环境变化；
- **Resume**：从可靠 checkpoint 继续；
- **Switch Tool**：更换能力路径；
- **Ask Human**：在高风险或模糊状态下请求人类介入；
- **Reset Context**：在上下文严重污染时重新构造工作集。

所以比单纯 ReAct 更稳定的抽象是：

```text
Observe → Verify → Recover
```

## Subagent / Multi-Agent：需求是隔离和并行，不是“Agent 越多越好”

复杂任务不等于必须使用 Multi-Agent。

真正的原始需求可能只是：

- context isolation；
- parallelism；
- independent working set。

Subagent 是这些需求的一种实现。

Multi-Agent 同时会带来：

- context fragmentation；
- communication loss；
- coordination overhead；
- conflicting decisions；
- duplicated reasoning；
- token cost。

因此默认不应该为了“复杂”而引入多个 Agent。很多任务先用：

```text
single agent
+ good context
+ tools
+ filesystem
```

就足够。只有 isolation 或 parallelism 的收益明显时，再支付多 Agent 的协调成本。

## 哪些 Harness 能力未来可能被模型吸收

一个非常重要的判断方法是区分：

```text
Fundamental Requirement
≠
Current Implementation
```

例如：

```text
原始需求：从庞大资料中选择当前相关信息
当前实现：RAG / vector DB
```

RAG 可能变化，但信息选择需求不会消失。

同理：

```text
原始需求：持续根据环境反馈行动
当前实现：外部 while loop / ReAct loop
```

未来模型可能原生具有更强的 recurrent / agentic 能力，外部循环实现可以变化，但闭环控制需求仍存在。

可以用下面的判断区分未来演化。

### 更可能被模型吸收的能力

这些能力主要因为“模型现在还不够稳定”而存在：

- 显式 Planning scaffolding；
- Reflection；
- Self-verification prompt；
- 部分 loop orchestration；
- 部分 context selection；
- 部分 tool orchestration；
- 部分 task decomposition；
- 部分 Multi-Agent coordination。

### 不会因为模型变聪明而自然消失的能力

这些能力来自外部世界、系统所有者和组织边界：

- External State；
- Permissions；
- Sandbox；
- Authentication；
- Audit；
- Business Invariants；
- Resource Limits；
- Human Authority；
- Environment Feedback。

因此，一个很稳定的判断原则是：

> 凡是因为“模型现在不会”而存在的 Harness，都可能随着模型能力提升而收缩；凡是因为“外部世界、组织规则和系统边界客观存在”而产生的 Harness，通常不会因为模型变聪明而消失。

## 把所有部分串成完整闭环

可以把目前的 Agent Harness 心智模型串成：

```text
                         User Goal
                             │
                             ▼
                       Goal / Plan
                             │
                             ▼
                    Context Selection
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
       Memory            Filesystem         Knowledge
          │                  │                  │
          └──────────── select / retrieve ──────┘
                             │
                             ▼
                      Context Window
                             │
                             ▼
                          Model
                             │
                             ▼
                          Action
                             │
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
                   ┌─────────┴─────────┐
                   │                   │
                 Pass                Fail
                   │                   │
                   ▼                   ▼
              Update State         Recovery
                   │                   │
                   └──────────┬────────┘
                              │
                              ▼
                          Next Loop
```

外部还需要三类控制层：

```text
Governance
├── permissions
├── sandbox
├── approval
├── privacy
└── audit

Reliability
├── retry
├── timeout
├── checkpoint
└── fallback

Economics
├── token budget
├── cost limit
├── rate limit
└── cache
```

这时才逐渐接近一个生产级 Agent，而不是简单的 `LLM + while loop + tools`。

## 一组用于分析任何 Harness 的问题

以后阅读 Agent / Harness 文章，可以持续追问：

1. 这个设计解决的原始需求是什么？
2. 它是在补模型能力，还是解决可靠性、治理或资源约束？
3. 这里看到的是 fundamental requirement，还是当前 implementation？
4. 当前一轮模型真正需要看到什么？
5. 哪些状态应该留在 Context，哪些应该写入外部状态？
6. 谁拥有规划权、执行权、验证权和终止权？
7. 模型说“完成”以后，外部系统如何证明它真的完成？
8. 失败以后应该 retry、repair、replan、rollback 还是 ask human？
9. 如果模型能力提升十倍，这个 Harness 机制还剩多少必要性？

## 最终认识

目前可以把整个框架压成几句话：

- LLM 本质上是一次 inference，不是一个长期运行系统。
- Agent 的目标，是把 LLM 扩展成围绕目标持续完成现实任务的系统。
- Tools 让模型能够观察和改变外部环境。
- Loop 让一次 inference 变成持续的闭环行为。
- Context 不是系统知道的一切，而是系统此刻决定让模型看到的一切。
- Filesystem 是持久状态，不等于检索；Memory 是被选择长期保留的过去状态。
- Context Engineering 的核心是 write / select / compress / isolate，本质是管理 working set 的信噪比。
- Agent 不能只会执行，还必须 observe → verify → recover。
- Multi-Agent 不是目的，真正需求通常是 isolation、parallelism 和独立 working set。
- Harness 不只补模型能力，还承担 Reliability、Governance 和 Economics。
- Capability scaffolding 会随着模型变强而变化；外部状态、权限、治理、资源边界和真实环境反馈不会因为模型变聪明而自然消失。

最终可以把 Agent Engineering 理解为：

> 围绕一个概率模型，设计正确的信息边界、状态系统、行动接口、反馈闭环和确定性约束，使它能够把局部智能稳定地转化为现实结果。

## 参考资料

- [OpenAI：Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [OpenAI：Equipping the Responses API with a computer environment](https://openai.com/index/equip-responses-api-computer-environment/)
- [Anthropic：Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Anthropic：Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [LangChain：Frameworks, runtimes, and harnesses](https://docs.langchain.com/oss/python/concepts/products)
