---
title: "Docker 核心模型：Image、Container 与分层文件系统"
description: "从 Docker 解决的部署问题出发，梳理 Dockerfile、Image、Layer、Container 与 Volume 的核心关系，并理解镜像缓存和容器可写层。"
pubDate: 2026-08-21
updatedDate: 2026-08-21
category: "study-notes"
tags: ["Docker", "Container", "Image", "Dockerfile"]
featured: false
heroImage: "images/covers/study.svg"
draft: false
---

# Docker 核心模型：Image、Container 与分层文件系统

## Docker 解决的核心问题

一个应用能否运行，不只取决于代码，还取决于完整的运行环境：

```text
应用能否运行
=
代码
+ 运行时版本
+ 系统依赖
+ 应用依赖
+ 环境变量
+ 操作系统环境
```

传统部署需要在目标服务器上分别安装 Node.js、pnpm、系统依赖，再安装项目依赖并配置启动方式。这使服务器环境本身成为应用运行条件的一部分，也容易产生“本机能运行、服务器不能运行”的环境差异。

Docker 的基本思路是把代码、运行时、系统依赖、应用依赖和启动方式组织成可复用的 Image，再由 Image 创建 Container：

```text
代码 + 运行环境 + 依赖 + 启动方式
                ↓
              Image
                ↓
            docker run
                ↓
            Container
```

Docker 因此不是单纯的程序打包工具，而是在定义一套可重复创建的应用运行环境。

## Container 不是小型虚拟机

Container 看起来拥有自己的文件系统、网络、进程空间和 hostname，但它本质上仍然是宿主机上的进程。

例如在 Windows + WSL2 环境中，可以形成这样的层次：

```text
Windows
└── WSL2 Linux
    └── Docker Engine
        ├── nginx container
        │   └── nginx process
        ├── api container
        │   └── node process
        └── postgres container
            └── postgres process
```

Docker 利用 Linux 的 namespace、cgroup 等机制隔离这些进程，使它们获得相对独立的运行视图和资源边界。

因此理解 Docker 时，更准确的模型是“隔离进程”，而不是“轻量虚拟机”。

## Docker 的几个核心对象

Docker 的基本对象关系可以概括为：

```text
Dockerfile
    │
    │ docker build
    ▼
  Image
    │
    │ docker run
    ▼
Container ───── Network ───── Container
    │
    ▼
 Volume
```

各对象的职责不同：

| 概念 | 本质 |
| --- | --- |
| Dockerfile | Image 的构建规则 |
| Image | 只读、分层的运行环境模板 |
| Layer | Image 文件系统的组成层 |
| Container | Image 创建出的运行实例，本质是隔离进程 |
| Writable Layer | Container 自己的临时可写文件层 |
| Volume | 独立于 Container 生命周期的数据存储 |
| Network | Container 之间以及 Container 与外部的通信机制 |

其中最重要的关系是：

```text
Dockerfile → Image → Container
```

可以把 Image 理解成模板，而 Container 是这个模板创建出的运行实例。同一个 Image 可以同时创建多个相互隔离的 Container。

## Image 是分层文件系统

一个 Image 并不是简单的单个巨大文件，而是由多层只读 Layer 叠加形成。

例如一个 NestJS 应用所需的环境可能抽象成：

```text
Image

Layer 5  应用代码
Layer 4  node_modules
Layer 3  pnpm
Layer 2  Node.js
Layer 1  Linux 基础文件
```

这些 Layer 叠加以后，Container 看到的是一个完整文件系统：

```text
/
├── bin
├── usr
├── etc
└── app
    ├── node_modules
    ├── package.json
    └── dist
```

因此 Image 可以概括为：

```text
Image
=
一组只读文件系统 Layer
+
启动配置
```

## Dockerfile 与 Layer

一个典型的 Node.js Dockerfile：

```dockerfile
FROM node:24

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && pnpm install

COPY . .

RUN pnpm build

CMD ["node", "dist/main.js"]
```

构建过程可以粗略理解为不断在已有结果上增加 Layer：

```text
FROM node:24
      ↓
基础 Layer

COPY package.json ...
      ↓
新 Layer

RUN pnpm install
      ↓
新 Layer

COPY . .
      ↓
新 Layer

RUN pnpm build
      ↓
新 Layer
```

这里需要严格区分 `RUN` 和 `CMD`。

`RUN` 在构建 Image 时执行：

```text
docker build
    ↓
RUN pnpm install
```

`CMD` 描述 Container 启动后的默认命令：

```text
docker run
    ↓
Container 启动
    ↓
node dist/main.js
```

所以完整生命周期是：

```text
Dockerfile
    │ docker build
    ▼
  Image
    │ docker run
    ▼
Container
    │
    ▼
node dist/main.js
```

## Layer 的价值：复用与构建缓存

分层设计的重要价值之一是缓存。

第一次构建：

```text
FROM node:24
COPY package.json
RUN pnpm install
COPY .
RUN pnpm build
```

如果之后只修改业务代码，而 `package.json` 和 `pnpm-lock.yaml` 没有变化，重新构建时前面的结果可以继续复用：

```text
FROM node:24             → cache
COPY package.json        → cache
RUN pnpm install         → cache
COPY .                   → changed
RUN pnpm build           → 重新执行
```

这样最耗时的依赖安装过程就不必每次重新执行。

因此 Dockerfile 中常见：

```dockerfile
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
```

而不是先执行：

```dockerfile
COPY . .
RUN pnpm install
```

如果先 `COPY . .`，任何业务源码变化都会使这一层发生变化，并使后续依赖安装层失去缓存复用机会。

由此得到一个重要的 Dockerfile 设计原则：

> 按照文件的变化频率组织构建步骤：低频变化内容尽量靠前，高频变化内容尽量靠后。

例如依赖定义通常比业务源码变化更少，因此应先复制依赖定义、安装依赖，再复制业务代码。

## Container 如何建立在 Image 上

Image 的 Layer 基本是只读的。当执行：

```bash
docker run my-api
```

Docker 不需要为每个 Container 完整复制一套 Image，而是在 Image 的只读层之上增加属于当前 Container 的可写层：

```text
Container
┌─────────────────────────┐
│ Container Writable Layer│  ← 可写
├─────────────────────────┤
│ 应用代码                │
├─────────────────────────┤
│ node_modules            │
├─────────────────────────┤
│ Node.js                 │
├─────────────────────────┤
│ Linux                   │
└─────────────────────────┘
          Image
          只读
```

因此可以进一步定义：

```text
Container
=
Image 的只读 Layers
+
Container 自己的 Writable Layer
+
运行中的进程
+
网络与运行状态
```

## 为什么同一 Image 的多个 Container 可以相互隔离

同一个 Image 可以同时启动多个 Container：

```text
               my-api Image
                    │
          ┌─────────┴─────────┐
          ▼                   ▼

Container A               Container B
Writable Layer A          Writable Layer B
───────────────           ───────────────
共享 Image Layers         共享 Image Layers
```

底层只读 Image Layer 可以共享，但每个 Container 都拥有自己的 Writable Layer。

因此 A 在自己的容器文件系统中产生的修改不会直接写入 B 的可写层，反之亦然。

这也是 Image 和 Container 必须区分的根本原因：Image 是不可变模板，Container 是带有独立运行状态的实例。

## Container 可写层为什么不适合保存重要数据

假设 PostgreSQL 在 Container 中把数据库数据写入：

```text
/var/lib/postgresql/data
```

如果这个目录只存在于 Container 的 Writable Layer，那么删除 Container 时，这个可写层也随之消失：

```text
Container
    │
    │ docker rm
    ▼
Writable Layer 被删除
    │
    ▼
其中的数据一起消失
```

因此重要的持久数据不能只依赖 Container Writable Layer。

这正是 Volume 存在的原因：让数据生命周期从 Container 生命周期中独立出来。

## 当前核心心智模型

这一阶段最重要的不是记住 Docker 命令，而是建立以下关系：

```text
Dockerfile
    │
    │ build
    ▼
┌───────────────┐
│     Image     │
│               │
│ Layer         │
│ Layer         │
│ Layer         │
└───────┬───────┘
        │
        │ run
        ▼
┌─────────────────────┐
│     Container       │
│                     │
│ Writable Layer      │
├─────────────────────┤
│ Image Layer         │
│ Image Layer         │
│ Image Layer         │
└─────────────────────┘
        │
        │ 持久数据不应只存这里
        ▼
      Volume
```

可以把目前的知识压缩成一句话：

> Docker 用 Dockerfile 定义如何构建分层、只读的 Image；运行 Image 时，在其上建立独立的 Container 可写层并启动隔离进程；需要长期保存的数据则应脱离 Container 生命周期交给 Volume。

## 下一阶段问题

接下来需要继续解决三个直接建立在当前模型上的问题：

1. `docker stop`、`docker start`、`docker restart`、`docker rm` 分别如何影响 Container 和数据。
2. Container Writable Layer、Volume、Bind Mount 三者的生命周期和适用场景有什么区别。
3. 开发环境、应用服务和 PostgreSQL 等数据库分别应该如何选择存储方式。
