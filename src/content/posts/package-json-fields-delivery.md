---
title: "package.json 字段指南（下）：模块、构建与发布"
description: "围绕运行时入口、类型入口、构建器提示和发布内容，理解 package 从源码到消费端的完整交付链路。"
pubDate: 2026-07-20
updatedDate: 2026-07-20
category: "professional-learning"
tags: ["package.json", "模块系统", "TypeScript", "npm"]
featured: false
heroImage: "images/covers/professional.svg"
draft: false
---

# package.json 字段指南（下）：模块、构建与发布

模块与发布字段共同回答三个问题：代码如何被解释，消费者可以访问什么，最终发布包里实际包含什么。

这三个问题必须保持一致。只要运行入口、类型入口和发布文件中有一处错位，就可能出现“源码正常、发布后失败”的问题。

## 运行时模块类型

### `type`

```json
{
  "type": "module"
}
```

它决定当前 package 范围内 `.js` 文件的解释方式：`module` 对应 ESM，`commonjs` 对应 CommonJS。`.mjs` 始终按 ESM 处理，`.cjs` 始终按 CommonJS 处理。

当输出代码使用 `import/export`，却被 Node.js 当作 CommonJS 加载时，会出现模块语法错误；反过来，在 ESM 中直接使用 `require` 也会失败。

## 入口与公共边界

### `main`

```json
{
  "main": "./dist/index.cjs"
}
```

`main` 是传统的默认入口，主要描述 package 被 `require` 或旧工具导入时加载哪个文件。它不是 NestJS 等应用的启动命令，应用进程通常通过 `scripts.start` 启动。

### `exports`

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./chat": {
      "types": "./dist/chat.d.ts",
      "import": "./dist/chat.js",
      "require": "./dist/chat.cjs"
    }
  }
}
```

`exports` 是现代 package 的公共 API 路由表：

- `.` 表示 package 根入口；
- `./chat` 表示允许访问的子入口；
- `import` 与 `require` 可以指向不同模块格式；
- `types` 为同一入口提供类型声明。

未声明的内部路径不应被消费者直接访问，因此 `exports` 也是架构封装边界。

### `imports`

```json
{
  "imports": {
    "#config": "./dist/config.js",
    "#core/*": "./dist/core/*.js"
  }
}
```

`imports` 定义当前 package 内部的模块别名；`exports` 控制外部如何访问当前 package。它与 TypeScript `paths` 不同，后者主要参与编译期解析，并不自动保证 Node.js 运行时认识相同别名。

## TypeScript 类型入口

### `types`

```json
{
  "types": "./dist/index.d.ts"
}
```

它为传统单入口 package 指定类型声明。多入口库更适合在每个 `exports` 子入口内配置 `types`，确保运行时代码与声明文件一一对应。

如果 JS 入口存在而声明路径错误，就会出现代码可以运行、TypeScript 却找不到类型的情况。

### `typesVersions`

它可以为不同 TypeScript 版本提供不同声明，适合需要长期兼容旧版 TypeScript 的框架或基础库。普通业务应用通常没有必要使用。

## 构建器提示

### `module`

```json
{
  "module": "./dist/index.js"
}
```

它是打包器生态形成的 ESM 入口约定，不是 Node.js 的标准主入口。现代库应优先使用 `exports.import`，只有需要兼容旧工具时再保留 `module`。

### `browser`

```json
{
  "browser": {
    "./dist/node.js": "./dist/browser.js",
    "node:fs": false
  }
}
```

它提示 Web 打包器在浏览器环境替换 Node 专用实现，适合同时支持 Node.js 和浏览器的 SDK。具体行为取决于消费它的构建工具。

### `sideEffects`

```json
{
  "sideEffects": ["**/*.css", "./dist/register.js"]
}
```

它告诉打包器哪些文件即使没有导出被使用，也不能在 Tree Shaking 时删除。错误地设置为 `false` 可能删掉 CSS、polyfill、全局注册或导入即执行的初始化代码。

## 发布内容

### `files`

```json
{
  "files": ["dist"]
}
```

`files` 决定哪些文件进入 npm tarball，`exports` 决定消费者可以通过哪些入口访问。两者必须一致：如果 `exports` 指向 `dist/chat.js`，但该文件没有被 `files` 包含，发布后的入口仍然不可用。

可以使用 `npm pack --dry-run` 检查最终交付内容，而不是只验证源码目录。

### `publishConfig`

```json
{
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

它只在发布阶段覆盖访问级别或 Registry 等配置。内部 package 可以用它确保发布到企业 Registry，公开 scope package 可以明确声明 `access: public`。

## CLI 与平台限制

### `bin`

```json
{
  "bin": {
    "agent": "./dist/cli.js"
  }
}
```

安装后提供 `agent` 命令。目标应指向构建后的可执行 JS，文件开头通常包含 `#!/usr/bin/env node`。

### `os`、`cpu`、`libc`

这些字段限制 package 可安装的平台、CPU 架构或 Linux C 库环境，主要用于原生二进制。普通纯 JS/TS package 通常不需要。

## 必须联合检查的字段

单个字段正确不代表 package 可以正常交付，至少需要检查以下组合：

1. `type` 是否与实际 JS 输出格式一致；
2. `exports` 中的运行入口是否真实存在；
3. `types` 是否与每个运行入口对应；
4. `files` 是否包含所有声明的入口；
5. `peerDependencies` 是否同时在构建器中排除，避免重复打包宿主框架；
6. `sideEffects` 是否保留 CSS 与初始化模块；
7. `engines` 是否与 CI、容器和部署环境一致。

最终应该验证三个层次：

```text
源码结构 → 构建结构 → 发布结构
```

对于可发布库，可靠的验证不是“源码能运行”，而是构建后生成 tarball，再从消费者视角检查模块入口、类型入口和实际文件是否一致。

关于 `package.json` 的整体抽象模型，可继续阅读《package.json：JavaScript 工程中的边界、契约与依赖图》；依赖和工作区字段则见本系列上篇。
