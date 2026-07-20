---
title: "package.json：JavaScript 工程中的边界、契约与依赖图"
description: "从声明式协议、模块边界、依赖责任和交付产物等视角，建立理解 package.json 的统一模型。"
pubDate: 2026-07-20
updatedDate: 2026-07-20
category: "professional-learning"
tags: ["package.json", "JavaScript", "模块系统", "工程化"]
featured: false
heroImage: "images/covers/professional.svg"
draft: false
---

# package.json：JavaScript 工程中的边界、契约与依赖图

理解 `package.json` 的关键，不是记忆字段，而是理解它在 JavaScript 工程中承担的抽象职责：

> `package.json` 是一个 package 对身份、依赖、运行方式、公共边界和交付形式的声明。

它不是单纯的“项目配置文件”，也不是只供 npm 使用的清单，而是一份由包管理器、Node.js、TypeScript、构建工具和 Registry 分别解释的多方协议。

## 一份由多个系统共同解释的协议

`package.json` 没有唯一的完整解释器。不同字段属于不同系统：

| 关注的问题 | 典型字段 | 主要解释者 |
| --- | --- | --- |
| package 是谁 | `name`、`version`、`private` | 包管理器、Registry |
| package 依赖谁 | `dependencies`、`peerDependencies` | 包管理器 |
| 模块如何加载 | `type`、`main`、`exports` | Node.js、构建工具 |
| 类型如何查找 | `types`、`exports` | TypeScript |
| 可以执行什么 | `scripts`、`bin` | 包管理器、Shell |
| 交付哪些内容 | `files`、`exports` | Registry、消费者 |
| 要求什么环境 | `engines`、`packageManager` | 包管理器、开发环境 |

因此，分析某个字段时，首先应该问：

1. 谁读取它？
2. 它改变安装、解析、构建、运行还是发布行为？
3. 不同工具对它的解释是否一致？

`package.json` 更像一门声明式语言：它没有普通代码中的流程控制，却通过依赖关系、条件导出和生命周期脚本驱动工程行为。

## package 是工程边界，不只是文件夹

一个 package 是拥有独立身份、依赖和公共接口的工程单元。目录只是它在文件系统中的表现，`package.json` 才真正声明了这个边界。

其中，`exports` 不只是入口配置，也是在定义公共 API：

- 哪些路径允许外部访问；
- 哪些文件属于内部实现；
- 不同运行环境应该获得哪个入口；
- 运行时代码和类型声明如何对应。

如果其他模块通过相对路径直接穿透 package 内部，即使目录已经分开，架构边界仍然没有真正建立。通过 package 名称、依赖声明和 `exports` 访问，才能形成稳定的模块关系。

## 依赖字段表达的是责任归属

依赖分类不能只理解成“开发环境”和“生产环境”的区别，更重要的是谁负责提供和控制这个依赖：

- `dependencies`：当前 package 对依赖的存在负责；
- `devDependencies`：当前 package 的开发和构建过程需要，消费者不承担；
- `peerDependencies`：由宿主提供，当前 package 声明可兼容的范围；
- `optionalDependencies`：能力可选，缺失时允许降级。

判断依赖类型时，可以连续追问：

1. 消费者运行时是否需要它？
2. 谁应该决定它的版本？
3. 是否必须与宿主共享同一个实例？
4. 安装失败后是否仍然可以工作？

从这个角度看，`package.json` 同时也是依赖责任的分配协议。

## package.json 描述约束，锁文件描述结果

依赖版本范围表达的是对未来版本的允许程度，锁文件记录的是包管理器在当前时刻求解出的确定依赖图：

```text
package.json  → 依赖约束
lockfile      → 确定的解析结果
node_modules  → 结果在文件系统中的实现
```

因此，`package.json` 与锁文件不是重复信息：

- 前者描述允许什么；
- 后者固定实际选择了什么；
- 安装目录实现这次选择。

版本范围与语义化版本共同构成时间维度上的兼容性契约。

## 源码、构建产物与发布内容是三个层次

开发者看到的源码结构，不等于消费者实际获得的 package。

```text
源码结构 → 构建结构 → 发布结构
```

例如，开发时使用 `src/index.ts`，构建后产生 `dist/index.js` 与 `dist/index.d.ts`，最终发布内容再由 `files` 和 `exports` 限定。

所以，一个 package 是否正确不能只看源码能否运行，还要检查：

- 构建产物是否完整；
- 运行时入口是否存在；
- 类型入口是否与运行时入口对应；
- 发布包是否包含了消费者真正需要的文件。

`package.json` 在这里承担的是交付物描述，而不只是源码配置。

## 在 Monorepo 中，它还是依赖图节点

Monorepo 中每个 `package.json` 都对应一个独立节点：

```text
web     → contracts
api     → contracts
worker  → agent-core → contracts
```

这种依赖图可以进一步决定：

- 构建顺序；
- 修改影响范围；
- 哪些任务可以并行；
- 哪些结果可以复用缓存。

根目录和子 package 的 `package.json` 虽然格式相同，职责却不同：

- 根 package 负责工具链、统一命令和仓库治理；
- 应用 package 负责启动、构建和部署；
- 库 package 负责公共 API、类型入口和消费边界。

因此，Monorepo 的价值不只是把代码放在同一个仓库，而是通过 package 声明形成可计算、可约束的工程拓扑。

## 统一理解模型

可以把 `package.json` 概括为七份契约的叠加：

```text
身份契约：我是谁
依赖契约：我依赖谁，谁负责提供
边界契约：别人可以怎样使用我
运行契约：我的模块如何被解释
命令契约：我可以执行哪些任务
交付契约：消费者最终获得什么
治理契约：我要求怎样的工具链和环境
```

这套模型比字段记忆更稳定。面对陌生配置时，只要判断它属于哪份契约、由哪个系统解释、对依赖图和交付结果产生什么影响，就能逐步推导出它的真实作用。

最终，`package.json` 应该被理解为 JavaScript 工程中 package 边界的声明文件：它把一个目录转化为一个有身份、有责任、有公共接口、能够参与依赖图的工程单元。
