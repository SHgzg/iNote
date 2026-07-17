---
title: "Prompt 与 Skill 的区别：从文本到能力抽象"
description: "梳理 Prompt 与 Skill 的真正区别，明确二者并非按文本内容区分，而是处于模型调用层与 Agent 能力层的不同抽象层级。"
pubDate: 2026-07-17
updatedDate: 2026-07-17
category: "professional-learning"
tags: ["Prompt Engineering", "Agent", "Skill", "Context Engineering"]
featured: false
heroImage: "images/covers/professional.svg"
draft: false
---

# 核心结论

Prompt 与 Skill 在内容上并不存在绝对边界。

一段包含角色、流程、适用范围、异常处理和工具规则的复杂 Prompt，其文本内容完全可以与一个 Skill 定义几乎一致。

真正的区别不在于写了什么，而在于系统如何对待这段内容。

可以用一句话概括：

```text
Prompt 是模型调用时的输入。
Skill 是 Agent 系统中被管理和调度的能力模块。
```

## Prompt 的关注点

Prompt 关注的是：

```text
本次推理时，模型应该看到什么。
```

它通常包括：

- 当前任务
- 上下文信息
- 输入数据
- 输出要求
- 约束条件

Prompt 的生命周期通常是：

```text
构造
→ 发送给模型
→ 获得结果
→ 调用结束
```

## Skill 的关注点

Skill 关注的是：

```text
系统具备什么能力。
什么时候使用这种能力。
如何加载并执行这种能力。
```

一个 Skill 通常包含：

- 触发条件
- 能力描述
- 工具权限
- 执行流程
- 外部资源引用
- 错误处理规则
- 输出协议

其生命周期通常是：

```text
定义
→ 存储
→ 注册
→ 发现
→ 匹配
→ 加载
→ 执行
→ 更新版本
```

# 两者的关系

Skill 并不是 Prompt 的替代品。

在绝大多数 Agent 系统中：

```text
Skill
    ↓ 加载
Prompt / Context
    ↓ 输入
Model
```

因此：

```text
Skill 最终通常会转化为 Prompt 的一部分。
```

但反过来：

```text
并非所有 Prompt 都会成为 Skill。
```

# 为什么容易混淆

因为下面两段文字可能完全一致：

```text
适用于 Java 代码审查。
执行步骤：...
出现异常时停止。
```

如果直接粘贴进当前聊天，它只是一次 Prompt。

如果它被保存为：

```text
skills/java-review/SKILL.md
```

并被 Agent 根据用户意图自动选择和加载，那么它就是 Skill 的定义内容。

因此二者不是按文本内容区分，而是按系统角色区分。

# 与编程中的类比

更容易理解的方式是：

```text
Skill ≈ 函数定义
Prompt ≈ 函数调用时的参数和输入
```

例如：

```python
def review_java_code(code):
    检查事务
    检查并发
    检查空指针
```

用户当前输入：

```text
请帮我审查这段代码。
```

类似于：

```python
review_java_code(current_code)
```

虽然函数内部最终也会变成机器指令执行，但函数定义与一次函数调用显然属于不同层级。

Prompt 与 Skill 也是类似关系。

# Skill 的真正价值

Skill 的核心价值并不是让 Prompt 更复杂，而是让能力变得：

- 可发现
- 可复用
- 可按需加载
- 可独立测试
- 可版本管理
- 可绑定权限

如果一个 Agent 拥有数十种能力：

```text
代码审查
修复 CI
发送邮件
更新博客
数据库操作
创建日程
```

将所有规则全部放入一个超长 System Prompt 往往会导致：

- 上下文膨胀
- 规则冲突
- 工具误用
- 难以维护

Skill 本质上是一种能力模块化和上下文路由机制。

# 最终理解

从抽象层级看：

```text
Prompt Engineering
    ↓
Context Engineering
    ↓
Skill / Capability System
    ↓
Agent Engineering
```

Prompt 解决的是：

```text
模型这次应该怎么思考。
```

Skill 解决的是：

```text
系统什么时候应该让模型使用哪一种思考方式。
```

二者并不是互斥关系，而是不同层级的抽象：

```text
Skill = 被系统管理的能力
Prompt = 能力执行时实际注入模型的内容
```