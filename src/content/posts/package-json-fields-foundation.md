---
title: "package.json 字段指南（上）：身份、脚本与依赖"
description: "从应用、库和 Monorepo 的实际职责出发，理解 package 身份、命令接口、依赖分类与工具链字段。"
pubDate: 2026-07-20
updatedDate: 2026-07-20
category: "professional-learning"
tags: ["package.json", "依赖管理", "pnpm", "工程化"]
featured: false
heroImage: "images/covers/professional.svg"
draft: false
---

# package.json 字段指南（上）：身份、脚本与依赖

`package.json` 字段的重要性取决于 package 的角色。业务应用关注命令与运行依赖，公共库关注版本和消费关系，Monorepo 根目录则关注工具链与依赖治理。

理解字段时可以连续追问：谁读取它、在哪个阶段生效、配置错误会影响谁。

## 身份字段

### `name`

`name` 是 package 在 Registry 和依赖图中的身份，也可以成为导入名与 pnpm 过滤条件：

```json
{
  "name": "@agent/contracts"
}
```

```ts
import type { ChatMessage } from "@agent/contracts";
```

在 Monorepo 中，即使 package 不发布，也应该使用稳定且不重复的名称。带 scope 的名称还能表达组织或项目边界。

### `version`

```json
{
  "version": "1.2.0"
}
```

发布库通过 `name + version` 形成唯一身份，版本变化还承担兼容性沟通。私有应用通常使用 Git commit、构建编号或镜像标签描述部署版本，因此该字段的重要性较低。

### `private`

```json
{
  "private": true
}
```

它用于阻止意外发布，不表示仓库私有，也不限制 workspace 内部引用。Monorepo 根目录、Vue 应用和 NestJS 应用通常都应设置为 `true`。

### 描述与治理信息

`description`、`keywords`、`homepage`、`repository`、`bugs`、`author` 和 `license` 主要服务于发现、维护与合规，而不直接改变运行行为。

其中 `repository.directory` 可以指出 Monorepo 中 package 的具体目录；`license` 对公共发布和企业依赖审计尤其重要。

## `scripts`：package 的命令接口

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "test": "vitest run",
    "typecheck": "vue-tsc --noEmit"
  }
}
```

`scripts` 向开发者、CI 和 Monorepo 工具提供稳定命令。外部调用者只需要执行 `pnpm build`，不必知道内部使用 Vite、tsc 还是其他工具。

执行脚本时，包管理器会把当前 package 的 `node_modules/.bin` 临时加入 `PATH`，因此本地安装的 CLI 可以直接写为 `vite` 或 `tsc`。

`prebuild`、`build`、`postbuild` 等前后置脚本可以组成生命周期。`preinstall`、`install`、`postinstall`、`prepare` 等脚本可能在安装或发布期间自动执行，是供应链审查的重点。

## 依赖字段表达责任归属

### `dependencies`

```json
{
  "dependencies": {
    "vue": "^3.5.0",
    "zod": "^4.0.0"
  }
}
```

表示当前 package 对这些运行依赖的存在负责。版本范围描述允许的兼容区间，锁文件记录实际选择的确定版本。

### `devDependencies`

```json
{
  "devDependencies": {
    "typescript": "^6.0.0",
    "vite": "^8.0.0",
    "vitest": "^4.0.0"
  }
}
```

表示当前 package 的开发、检查、测试或构建过程需要，但消费者运行交付物时不应直接承担。它表达依赖责任，不等同于“生产环境一定不会安装”。

### `peerDependencies`

```json
{
  "peerDependencies": {
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "vue": "^3.5.0"
  }
}
```

组件库需要与宿主共享 Vue，因此要求宿主提供兼容版本；同时，组件库自身开发和测试也需要 Vue，所以它还会出现在 `devDependencies`。两处声明分别表达消费关系和开发关系。

`peerDependenciesMeta` 可以把某项 peer dependency 标为可选，适合“支持某个框架集成，但核心功能不依赖它”的场景。

### `optionalDependencies`

用于允许安装失败的可选能力，例如平台加速模块。代码必须提供降级路径，否则它并不是真正的可选依赖。

### `bundleDependencies`

用于把指定依赖一起放入发布 tarball，适合离线或特殊分发。它会增加包体积并降低依赖升级灵活性，普通库通常不需要。

## 工具链与环境

### `engines`

```json
{
  "engines": {
    "node": ">=22"
  }
}
```

声明代码预期兼容的运行环境。它通常首先是兼容性说明，是否强制阻止安装还取决于包管理器配置。应与 Dockerfile、CI 和本地 Node 版本保持一致。

### `packageManager`

```json
{
  "packageManager": "pnpm@10.14.0"
}
```

用于统一团队和 CI 使用的包管理器版本，减少锁文件与 workspace 解析差异。Monorepo 根 package 尤其适合声明。

## Monorepo 字段

pnpm 使用根目录的 `pnpm-workspace.yaml` 发现成员：

```yaml
packages:
  - apps/*
  - packages/*
```

子 package 使用本地依赖协议建立关系：

```json
{
  "dependencies": {
    "@agent/contracts": "workspace:*"
  }
}
```

其中，workspace 文件确定成员范围，`name` 确定成员身份，`workspace:*` 建立本地依赖边。

### `overrides`

`overrides` 可以强制替换传递依赖版本，常用于临时修复漏洞或统一冲突版本。它绕过了上游原本的版本选择，因此应记录原因、充分测试并设置清理条件。

## 判断依赖类别的方法

面对一个依赖，可以依次判断：

1. 消费者运行交付物时是否需要它？
2. 当前 package 还是宿主应该决定版本？
3. 是否必须与宿主共享同一实例？
4. 安装失败后是否存在可用的降级路径？

这些问题比“开发依赖还是生产依赖”的二分法更能表达真实责任。

下一篇继续讨论决定代码如何被加载、打包和交付的字段：`type`、`main`、`exports`、`types`、`files`、`sideEffects` 与 `publishConfig`。

