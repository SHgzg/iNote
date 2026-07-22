---
title: "初识 Harness"
description: "从结构、流程、控制权、状态、安全与评测等维度认识 Harness，理解它如何把模型能力转化为可持续执行的 Agent 系统。"
pubDate: 2026-07-22
updatedDate: 2026-07-22
category: "study-notes"
tags: ["Harness", "AI Agent", "Agent 架构"]
featured: false
heroImage: "images/covers/study.svg"
draft: false
---

# 初识 Harness

## 核心判断

在 AI 领域，**Harness 通常指围绕模型搭建的一套控制、执行与约束系统**。它负责组织模型如何获得信息、调用工具、维持状态、处理失败、接受约束，并最终完成任务。

这个词原本有马具、安全带或线束的含义：Harness 本身不提供动力，却能连接、引导和约束力量。放到 AI 系统中，可以用一句话概括：

> 模型主要负责理解和判断下一步做什么，Harness 负责让这一步真正发生，并使整个过程可持续、可控制、可观察。

Harness 并没有唯一而严格的行业定义。不同产品可能把 Runtime、编排器、安全层或部分环境能力也算入 Harness。因此，理解它时不应只背组件列表，而要先确认讨论中的系统边界。

可以先用一个近似公式定位它：

```text
Agent System = Model + Harness + Runtime + Environment
```

- **Model**：理解、推理、生成和局部决策。
- **Harness**：组织模型如何观察、行动、纠错和结束任务。
- **Runtime**：让任务能够运行、暂停、恢复和持久化。
- **Environment**：Agent 能观察和改变的外部世界。

“Agent”有时指整个系统，有时只指模型加执行循环。讨论具体架构时，需要先说明这个词的边界。

## 为什么模型需要 Harness

LLM 本身通常能够接收上下文、生成文本，也可以生成结构化的工具调用请求。但“提出调用工具”并不等于“执行工具”。

例如，模型可能输出：

```json
{
  "tool": "read_file",
  "arguments": {
    "path": "package.json"
  }
}
```

这只表达了一个动作意图。要真正读取文件，外部系统还要完成：

1. 解析模型输出；
2. 校验参数；
3. 检查权限；
4. 调用文件系统；
5. 获取并规范化结果；
6. 把结果重新放入上下文；
7. 再次调用模型；
8. 重复执行，直到任务完成。

模型也不能天然地管理长期任务状态、控制权限与风险、在上下文溢出后恢复、从失败中重试、保存执行轨迹，或证明目标已经真正完成。这些正是 Harness 要补上的部分。

## 最小运行闭环

Harness 最基本的骨架是 Agent Loop：

```text
接收任务
→ 构造当前上下文
→ 调用模型
→ 获得工具调用或最终回答
→ 校验并执行工具
→ 更新状态并把结果放回上下文
→ 再次调用模型
→ 验证目标并结束
```

最小代码看起来并不复杂：

```ts
while (!finished) {
  const context = buildContext(state);
  const response = await model.generate(context);

  if (response.type === "tool_call") {
    const result = await executeTool(response.toolCall);
    state.messages.push(response, result);
  } else {
    finished = await verify(response, state);
  }
}
```

真正困难的不是写出这个 `while`，而是回答下面的问题：

- 每一轮应该给模型哪些信息？
- 当前状态下应该暴露哪些工具？
- 哪些操作必须审批？
- 工具失败后应该重试还是重新规划？
- 如何发现重复循环？
- 如何判断模型是否过早宣称完成？
- 上下文满了以后保留什么？
- 怎样限制时间、成本和调用次数？

所以，Agent Loop 只是 Harness 的骨架，策略和边界才决定它的实际表现。

## Harness 的静态结构

从“由什么组成”的角度，可以把 Harness 拆成以下部分：

| 组成部分 | 主要职责 |
| --- | --- |
| 模型接口 | 统一模型调用、消息和结构化输出 |
| Context | 选择、组织、压缩并注入当前所需信息 |
| Tool System | 注册工具、校验参数、执行调用并处理错误 |
| State | 保存任务进度、计划和环境变化 |
| Memory | 在当前任务或跨任务范围内保存可复用信息 |
| Skill | 封装某一类任务的触发条件、知识与操作流程 |
| Planning | 分解任务、维护阶段和完成条件 |
| Guardrail | 权限、审批、预算、沙箱和危险操作限制 |
| Trace | 记录模型调用、工具执行、耗时和错误 |
| Eval | 判断动作、过程和最终结果是否合格 |

组件名称并不决定系统质量。即使两个 Harness 都有 Tool、Memory 和 Planning，它们也可能因为上下文选择、控制权分配、终止条件和错误恢复策略不同而表现完全不同。

## 认识 Harness 的九个维度

分析一个具体 Harness 时，可以依次问九个问题。

### 1. 目标：它要完成什么任务

首先确认 Harness 服务的任务类型，例如编程、资料研究、客服、数据分析或业务流程执行。目标决定它需要哪些信息、工具、权限和验证机制。

同一套通用循环很难直接适配所有任务。编程 Agent 要关心文件变化和测试结果，研究 Agent 要关心检索覆盖、证据与引用，业务 Agent 则可能更重视身份、审批和幂等性。

### 2. 边界：各部分分别负责什么

需要明确 Model、Harness、Runtime 和 Environment 的分工。

一个实用判断是：

> 如果某个功能主要决定模型在任务中如何观察、判断、行动和纠错，它通常更接近 Harness；如果它主要保证进程如何持久运行、调度、恢复和扩缩容，它更接近 Runtime。

实际系统中二者会交叉，但先做这种区分有助于定位问题。

### 3. 信息：每一步模型知道什么

Harness 本质上也是信息管理系统。模型每一轮可能看到：

- 用户目标与输出要求；
- System Prompt、项目规范与安全策略；
- 对话历史和近期工具结果；
- 文件、数据库或页面的当前状态；
- 计划、待办与完成进度；
- RAG 或搜索获得的知识；
- 工具定义与可加载的 Skill；
- 用户偏好与长期项目背景。

这里的关键动作是：

```text
获取 → 选择 → 组织 → 注入
```

Context Engineering 不只是控制 Token 数量，而是在管理模型每一步的认知边界。

### 4. 决策：控制权掌握在谁手中

Agent 系统通常有三类决策者：

| 决策者 | 更适合负责 |
| --- | --- |
| 程序代码 | 固定规则、权限、参数校验、流程边界 |
| 模型 | 语义理解、动态规划、工具选择、异常分析 |
| 人类 | 高风险审批、模糊目标确认、价值判断 |

研究 Harness 时，不能只问“是否支持规划”，而应进一步问：

> 规划权、执行权、验证权和终止权，分别由模型、程序还是人类掌握？

完全固定的 Workflow 由程序预先确定路径；高度自主的 Agent 让模型动态选择行动。生产系统常见的形态是外层确定性流程加内层自主 Agent：程序规定阶段与边界，模型决定阶段内的行动，程序再验证阶段结果。

### 5. 行动：模型意图如何影响现实

完整工具链不只是一个函数列表，而是一条执行管道：

```text
能力发现
→ 工具选择
→ 参数生成
→ Schema 校验
→ 权限判断
→ 实际执行
→ 结果规范化
→ 错误恢复
→ 状态更新
```

需要关注工具是静态注册还是动态加载、是否区分读写操作、是否支持审批和并行、是否具备幂等性，以及工具结果怎样压缩后重新进入上下文。

工具能力越强，系统越不能只依赖 Prompt 中的软约束。

### 6. 状态：任务如何跨越时间持续

可以把状态分为四个时间尺度：

| 状态类型 | 示例 |
| --- | --- |
| 短期状态 | 当前消息、最近工具结果、临时变量 |
| 任务状态 | 已完成步骤、待办项、文件修改和测试结果 |
| 持久化状态 | Checkpoint、工作目录、执行轨迹、待审批动作 |
| 长期记忆 | 用户偏好、项目约定、历史决策和可复用经验 |

Memory 只是状态问题的一部分。更完整的问题是：

> Harness 如何在上下文窗口、模型调用、进程和任务之间维持连续性？

长任务通常还需要历史压缩、工具结果截断、重要事实提取、状态持久化和按需重新加载。

### 7. 约束：能力边界在哪里

安全机制可以分为四层：

| 层次 | 示例 |
| --- | --- |
| 认知约束 | Prompt 中说明禁止事项 |
| 能力约束 | 不向模型暴露危险工具 |
| 执行约束 | 参数校验、沙箱、文件权限和网络白名单 |
| 人类约束 | 删除、付款、发送消息前要求审批 |

提示词中的“不要删除文件”只是软约束。更可靠的 Harness 会在执行层禁止未授权操作。

除了权限，还要考虑 Token 和成本上限、最大循环次数、超时、数据隔离、敏感信息过滤、审计、撤销与补偿机制。成熟系统不仅要说明“能做什么”，还要明确“在什么条件下绝对不能做什么”。

### 8. 反馈：失败后怎样恢复

Agent 的失败不只包括程序异常，还可能是选错工具、参数语义错误、工具执行成功但目标没有实现、陷入循环、上下文遗漏信息或过早宣称完成。

需要区分四类恢复方式：

- **Retry**：同一个动作再做一次，适合临时网络错误。
- **Replan**：承认原策略有问题，重新决定行动路径。
- **Rollback**：撤销已经造成的环境变化。
- **Resume**：从可靠检查点继续执行。

成熟 Harness 需要判断何时采用哪一种，而不是对所有失败机械重试。

### 9. 评测：怎样证明任务真的完成

评测不能只看最终回答是否“像是正确的”，至少要覆盖四层：

| 评测层级 | 评测对象 |
| --- | --- |
| 模型级 | 理解、推理和生成能力 |
| 动作级 | 工具选择与参数是否正确 |
| 过程级 | 路径是否合理，是否存在无效循环 |
| 结果级 | 外部环境是否达到目标状态 |

例如修复代码 Bug，最终标准应是文件正确修改、测试通过、没有明显回归、未修改无关文件，并且高风险动作经过了必要审批，而不是模型只回复“已修复”。

## 相近概念的边界

| 概念 | 主要解决的问题 | 与 Harness 的关系 |
| --- | --- | --- |
| Agent Framework | 怎样用通用抽象构建 Agent | 提供积木；Harness 更像带有策略和默认行为的组装方案 |
| Runtime | 任务怎样持久、调度、暂停和恢复 | 与 Harness 经常重叠，但更偏稳定运行 |
| Orchestrator | 模型、工具、步骤或多个 Agent 怎样协调 | 通常是 Harness 的一部分或实现手段 |
| Scaffold | 模型外围的 Prompt、循环、重试和验证脚手架 | 在论文和评测语境中常与 Harness 近似 |
| Skill | 某类任务应怎样完成 | Harness 可按需加载的程序性经验 |
| Tool | 实际执行一个动作 | Harness 负责选择、校验、调用和管理工具 |
| MCP | 外部工具和资源怎样统一接入 | 可以作为 Harness 的能力接入层 |
| RAG | 怎样检索并注入相关知识 | 通常是 Harness 的一种上下文获取能力 |
| Workflow | 怎样按预定路径执行步骤 | 可作为外层确定性流程，与内层 Agent Harness 组合 |

可以用三句话记住 Skill、Tool 与 Harness：

```text
Harness：决定 Agent 如何持续工作
Skill：说明某一类任务具体怎样完成
Tool：提供可以真正执行的动作
```

## Agent Harness 与 Evaluation Harness

“Harness”还有另一个常见含义：**Evaluation Harness，评测执行系统**。二者不能混为一谈。

| 类型 | 作用 |
| --- | --- |
| Agent Harness | 让模型使用信息和工具完成真实任务 |
| Evaluation Harness | 批量运行测试、记录轨迹、评分并聚合结果 |

Evaluation Harness 通常包含测试集、测试环境、多次 Trial、结果记录、确定性断言、模型评分或人工评分，以及成功率、成本、延迟等统计。

二者的关系是：Evaluation Harness 可以批量运行 Agent Harness，并检查它工作得怎么样。

## Harness Engineering

Harness Engineering 可以理解为：

> 设计模型外围的软件、环境、反馈与约束机制，使模型能够稳定地产生有价值的实际结果。

它比 Prompt Engineering 的范围更大：

```text
Prompt Engineering
→ Context Engineering
→ Harness Engineering
→ Agent System Engineering
```

- Prompt Engineering 关注一次调用中怎样表达任务。
- Context Engineering 关注每一轮应该给模型什么信息。
- Harness Engineering 关注模型怎样持续使用工具完成任务。
- Agent System Engineering 关注整个生产系统怎样安全、可靠和可扩展地运行。

Harness Engineering 的优化对象包括 Prompt、工具描述、工具返回格式、上下文选择、规划策略、终止条件、错误恢复、权限模型、Skills、子 Agent 和验证反馈。

它的演化通常来自失败闭环：

```text
发现失败
→ 分析 Trace
→ 判断问题来自模型、上下文、工具还是策略
→ 修改 Harness
→ 加入验证机制
→ 更新评测集
→ 重新运行
```

核心目标不是不断堆叠功能，而是把模型偶然表现出的正确行为，逐步固化为系统能够稳定产生的行为。

## 一个编程 Agent 的例子

假设任务是“为项目增加登录功能，并确保测试通过”。

**模型主要负责：**

- 理解需求；
- 判断要读取哪些文件；
- 分析架构；
- 规划修改；
- 生成代码；
- 根据测试结果调整方案。

**Harness 主要负责：**

- 把仓库规则放入上下文；
- 提供文件、搜索和 Shell 工具；
- 执行模型提出的工具调用；
- 限制可访问目录；
- 保存和跟踪文件变化；
- 处理过长的测试日志；
- 在上下文不足时压缩历史；
- 拦截未经授权的危险命令；
- 记录执行轨迹；
- 验证是否真的运行了测试。

**Runtime 主要负责：**

- 创建并维持运行环境；
- 保持工作目录；
- 运行测试进程；
- 保存 Checkpoint；
- 处理超时、暂停和恢复；
- 管理任务生命周期。

这个例子说明：真正的 Agent 能力并不完全等于模型能力。同一个模型搭配不同 Harness，在长期任务、工具使用、可靠性和安全性上可能表现出明显差异。

## 建议的学习顺序

可以沿着以下顺序逐步掌握 Harness：

1. 最小 Agent Loop；
2. Context 构造；
3. Tool 定义与执行；
4. State 与 Memory；
5. Planning 与终止条件；
6. 权限与安全；
7. 错误恢复；
8. Trace 与 Eval；
9. Runtime 与生产部署。

学习时不应停留在“是否拥有某个组件”，而要持续追问：信息怎样流动、控制权如何分配、动作如何落地、失败如何恢复、结果如何验证。

## 最终认识

Harness 不是模型外围的一组零散辅助功能，而是让模型成为行动主体的外部认知与控制系统：

- Prompt 是当前指令；
- Context 是工作记忆；
- Memory 是跨时间保存的信息；
- Tool 是手和感官；
- Skill 是程序性经验；
- Runtime 是持续运行的环境；
- Agent Loop 是行动循环；
- Guardrail 是行为边界；
- Trace 是经历记录；
- Eval 是能力测量；
- Harness 负责把这些部分组织成一个闭环。

因此，可以把 Agent 的实际能力表示为：

```text
Agent 实际能力 = f(模型, Harness, 工具, 上下文, 环境, 评测与迭代)
```

模型决定局部智能的上限，Harness 则在很大程度上决定这种智能能否稳定、安全地转化为现实结果。

## 参考资料

- [OpenAI：Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [OpenAI：Equipping the Responses API with a computer environment](https://openai.com/index/equip-responses-api-computer-environment/)
- [Anthropic：Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Anthropic：Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [LangChain：Frameworks, runtimes, and harnesses](https://docs.langchain.com/oss/python/concepts/products)
