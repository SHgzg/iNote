---
title: "JavaScript 模块化：从语法、运行时、工具到架构"
description: "从模块边界、运行时语义、构建优化和依赖方向理解 JavaScript 模块化，而不只停留在 import/export 语法。"
pubDate: 2026-07-21
updatedDate: 2026-07-21
category: "study-notes"
tags: ["JavaScript", "ESM", "CommonJS", "模块化"]
featured: false
heroImage: "images/covers/study.svg"
draft: false
---

# JavaScript 模块化：从语法、运行时、工具到架构

理解 JavaScript 模块化，不能只停留在 `import/export` 的语法层面。更完整的视角是：

> 模块化是在管理代码的边界、依赖关系、初始化顺序、运行时状态和发布方式。

它最终解决的不是“怎样拆文件”，而是如何限制系统复杂度，使依赖关系、变化范围和运行行为保持可控。

## 一、模块的核心模型

一个模块可以抽象为：

```text
模块 = 私有实现 + 公开接口 + 外部依赖 + 初始化行为
```

例如：

```js
// counter.js
let count = 0

export function increment() {
  count++
}

export function getCount() {
  return count
}
```

其中：

- `count` 是模块私有状态；
- `increment` 和 `getCount` 是公开接口；
- 当前模块没有外部依赖；
- 模块第一次加载时会初始化 `count`。

因此，评价模块化设计时，需要关注：

1. 哪些实现细节应该隐藏；
2. 哪些能力允许外部使用；
3. 模块依赖谁，又被谁依赖；
4. 模块何时执行和初始化；
5. 模块状态是否被多个调用方共享；
6. 代码如何被浏览器、Node.js 和构建工具解析与加载。

将大文件拆成多个互相随意访问、充满全局状态和循环依赖的小文件，只是文件拆分，并没有形成可靠的模块边界。

## 二、文件、模块、包与构建工具

### 1. 文件不完全等于模块

在现代 ESM 中，通常一个文件就是一个模块，但两者的抽象层次不同：

- 文件是物理组织单位；
- 模块是逻辑封装单位；
- 包是发布和依赖管理单位。

一个业务模块可以包含多个文件：

```text
user/
├── index.ts
├── user.service.ts
├── user.repository.ts
├── user.types.ts
└── user.validator.ts
```

整个 `user` 目录可以被视为一个逻辑模块，`index.ts` 是它对外公开的入口。

### 2. 模块不等于包

```js
import { debounce } from 'lodash-es'
```

这里，`lodash-es` 是包，包内具体文件是模块，`debounce` 是模块导出的绑定。`package.json` 描述包，`import/export` 描述模块之间的关系。

### 3. 模块系统不等于构建工具

模块系统包括 ESM、CommonJS、AMD 和 UMD；Vite、Rollup、Webpack、esbuild、SWC 等则是模块处理工具。

模块系统定义依赖如何声明、加载和执行；构建工具负责分析、转换、合并和优化模块。

## 三、模块化的历史演进

### 1. 全局变量阶段

早期 JavaScript 通过多个 `script` 标签按顺序加载：

```html
<script src="utils.js"></script>
<script src="user.js"></script>
<script src="app.js"></script>
```

所有脚本共享全局作用域，容易造成命名冲突、隐式依赖、加载顺序敏感和私有状态缺失。

### 2. 命名空间与 IIFE

IIFE 利用函数作用域隐藏内部变量：

```js
const App = {}

App.user = (function () {
  let currentUser = null

  function login() {}

  return { login }
})()
```

它改善了封装，但依赖关系仍不够明确。

### 3. CommonJS

Node.js 生态采用 CommonJS：

```js
const userService = require('./user-service')

module.exports = {
  createUser
}
```

它适合本地磁盘和同步读取场景，也允许在执行过程中动态加载模块。

### 4. ESM

ES2015 将模块系统纳入语言标准：

```js
import { createUser } from './user.js'

export function register() {
  return createUser()
}
```

ESM 的关键价值不只是语法更简洁，而是依赖结构可以在代码执行前被静态分析。这为 Tree Shaking、静态依赖分析、浏览器原生加载、代码分割和循环依赖分析提供了基础。

## 四、ESM 的运行时语义

### 1. `import` 导入的是实时绑定

```js
// counter.js
export let count = 0

export function increment() {
  count++
}
```

```js
// app.js
import { count, increment } from './counter.js'

console.log(count) // 0
increment()
console.log(count) // 1
```

`count` 不是被复制到导入方的普通值，而是一个实时绑定。导出模块中的值改变后，导入方可以观察到变化；但导入方不能直接修改该绑定：

```js
import { count } from './counter.js'

count++ // 报错
```

状态的修改权仍属于导出模块。

### 2. 模块通常只初始化一次

```js
// store.js
console.log('初始化 store')

export const state = {
  count: 0
}
```

多个文件导入它时，通常共享同一个模块实例，而不是各自创建一份 `state`。因此模块顶层对象天然具有单例特征：

```js
export const cache = new Map()
```

这也可能造成全局共享状态、测试污染、SSR 请求间数据泄漏和初始化顺序问题。若状态不应共享，可以导出工厂函数：

```js
export function createStore() {
  return {
    count: 0
  }
}
```

### 3. 模块加载是分阶段的

ESM 的加载过程可以简化为：

```text
解析 → 建立依赖关系 → 创建绑定 → 执行模块代码
```

运行时会先形成模块依赖图，再处理模块实例化与执行，而不是遇到一条 `import` 就简单执行一次文件。

这个模型可以解释：

- 静态 `import` 为什么必须位于顶层；
- 同一模块为什么通常只执行一次；
- 循环依赖为什么有时可用、有时会失败；
- 顶层副作用为什么会影响加载与构建优化。

### 4. 静态导入与动态导入

静态导入：

```js
import { createUser } from './user.js'
```

依赖在执行前即可确定，通常进入主模块依赖图，构建工具可以静态分析。

动态导入：

```js
const userModule = await import('./user.js')
```

它返回 Promise，可以按需加载，并常形成独立 chunk。Vue Router 的路由懒加载就是典型场景：

```js
const routes = [
  {
    path: '/users',
    component: () => import('./pages/UserPage.vue')
  }
]
```

动态导入改变的不只是语法，还包括模块加载时机和打包边界。

## 五、ESM 与 CommonJS

| 维度 | ESM | CommonJS |
| --- | --- | --- |
| 语法 | `import/export` | `require/module.exports` |
| 标准来源 | ECMAScript 标准 | Node.js 生态规范 |
| 依赖分析 | 以静态分析为主 | 运行时动态执行 |
| 导出关系 | 实时绑定 | 通常获得导出对象或值 |
| 加载模型 | 支持异步模块加载 | 传统实现以同步加载为主 |
| Tree Shaking | 更友好 | 相对困难 |
| 浏览器支持 | 原生支持 | 通常需要构建转换 |
| 动态加载 | `import()` | `require()` |

CommonJS 可以在运行时选择模块：

```js
const moduleName = condition ? './a' : './b'
const mod = require(moduleName)
```

静态 ESM 不能将变量直接用作模块标识：

```js
import mod from moduleName
```

需要使用动态导入：

```js
const mod = await import(moduleName)
```

即使如此，构建工具仍需要推断可能涉及的文件，过于动态的路径可能无法正确打包。

## 六、命名导出与默认导出

命名导出：

```js
export function createUser() {}
export function deleteUser() {}
```

```js
import { createUser, deleteUser } from './user.js'
```

默认导出：

```js
export default function createUser() {}
```

```js
import whateverName from './user.js'
```

默认导入可以被调用方任意命名。大型项目中，命名导出通常更利于统一命名、自动补全、重构追踪和公共能力表达。默认导出适合文件明显只有一个核心概念的情况，例如 Vue 组件。

关键不在于绝对禁止某种形式，而在于团队采用稳定、清晰的约定。

## 七、Tree Shaking 与模块副作用

Tree Shaking 的核心是：构建工具通过静态分析删除未使用的导出。

```js
// math.js
export function add(a, b) {
  return a + b
}

export function multiply(a, b) {
  return a * b
}
```

当调用方只导入 `add` 时，`multiply` 理论上可以从最终产物中移除。但使用 ESM 并不等于一定能成功 Tree Shaking，它还取决于：

- 模块是否存在副作用；
- 构建工具配置；
- 包的 `sideEffects` 声明；
- 转译时是否把 ESM 转成 CommonJS；
- 导出方式能否被静态分析；
- 顶层是否执行不可预测的逻辑。

例如：

```js
// analytics.js
registerGlobalListener()

export function track() {}
```

即使没有使用 `track`，构建工具也不一定能删除整个文件，因为导入文件本身会注册全局监听。

典型的顶层副作用还包括：

```js
window.addEventListener('resize', handleResize)
registerPlugin()
connectDatabase()
startTimer()
```

这类行为会造成初始化顺序依赖、测试困难、Tree Shaking 困难、SSR 兼容问题和隐式全局变化。更明确的设计是导出初始化函数：

```js
export function setupResizeListener() {
  window.addEventListener('resize', handleResize)

  return function cleanup() {
    window.removeEventListener('resize', handleResize)
  }
}
```

调用方决定行为何时发生：

```js
import { setupResizeListener } from './resize.js'

const cleanup = setupResizeListener()
```

可以将这一原则概括为：

> 导入表达依赖，函数调用表达行为。

## 八、循环依赖

假设两个模块相互依赖：

```js
// a.js
import { b } from './b.js'

export const a = b + 1
```

```js
// b.js
import { a } from './a.js'

export const b = a + 1
```

依赖图形成 `A → B → A`。ESM 能建立循环中的绑定，但不保证模块一定可以正确执行。某个变量可能在完成初始化前就被另一个模块访问，从而出现：

- `Cannot access ... before initialization`；
- 获得部分初始化的对象；
- 在不同构建环境中表现不一致；
- 改变导入顺序后问题暂时消失。

常见处理方法包括：

1. 抽取共同依赖，使 A 和 B 都依赖 C；
2. 通过参数依赖接口或能力，而不是直接依赖具体模块；
3. 将共享类型单独提取；
4. 重新判断两个模块是否本应属于同一个内聚单元。

并非所有循环依赖都必须机械消除，但核心业务模块之间的循环通常意味着边界或依赖方向值得重新审视。

## 九、从架构角度划分模块边界

### 1. 内聚性

模块内部内容应围绕同一个职责和变化原因组织。将无关函数都放入 `utils.js`，只是因为“不知道放哪里”，会形成缺乏内聚性的工具箱。

```js
// utils.js
export function formatDate() {}
export function validateEmail() {}
export function calculatePrice() {}
export function parseToken() {}
```

更合适的组织方式是：

```text
date/format-date.ts
auth/parse-token.ts
pricing/calculate-price.ts
user/validate-email.ts
```

### 2. 耦合性

调用方不应了解被依赖模块的内部结构：

```js
userStore.internalState.cache.users.push(user)
```

更稳定的公共接口是：

```js
userStore.add(user)
```

### 3. 变化方向

经常一起变化的代码应该靠近，变化原因不同的代码应该分开。因此按业务组织：

```text
user/
├── user-api.ts
├── user-service.ts
├── user-validator.ts
└── user.types.ts
```

通常比将所有 `services`、`validators` 和 `types` 分散在全局技术目录中更容易扩展。

## 十、依赖方向与依赖注入

一个前端系统可以粗略划分为：

```text
页面层 → 业务层 → 领域模型
   ↓         ↓
基础设施层（HTTP、存储、日志）
```

业务逻辑若直接依赖具体 HTTP 库，会形成较强耦合：

```js
import axios from 'axios'

export async function createOrder(order) {
  return axios.post('/orders', order)
}
```

可以把依赖作为参数传入：

```js
export function createOrderService(orderRepository) {
  return {
    create(order) {
      return orderRepository.create(order)
    }
  }
}
```

再在应用组合入口连接具体实现：

```js
const orderService = createOrderService(httpOrderRepository)
```

这样做可以让业务模块独立测试、替换 HTTP 实现，并在浏览器和服务端连接不同的基础设施。

模块化的高级阶段，不是拆出更多文件，而是控制依赖从哪里指向哪里。

## 十一、公共入口与 Barrel Export

业务模块可以通过 `index.ts` 暴露稳定的公共 API：

```ts
// user/index.ts
export { createUser } from './user-service'
export type { User } from './user.types'
```

```ts
import { createUser, type User } from '@/user'
```

这样可以隐藏内部目录结构，让内部重构尽量不影响调用方。

但将整个项目汇总到一个万能入口可能造成循环依赖更隐蔽、导入来源不清、开发环境加载过多模块和同名导出冲突。

更稳妥的原则是：

> 在业务模块边界使用公共入口，但不要把整个项目汇总成一个万能入口。

## 十二、模块解析与 TypeScript 类型依赖

以下三种导入路径由不同规则解析：

```js
import App from './App.vue'                  // 相对路径
import { ref } from 'vue'                    // 裸模块标识符
import Button from '@/components/Button.vue' // 路径别名
```

解析主体可能包括浏览器、Node.js、TypeScript、构建工具、测试工具和 IDE。路径别名必须在这些工具之间保持一致，否则可能出现 TypeScript 能识别但构建工具不能识别，或开发环境能运行但测试环境失败的情况。

因此还需要理解：

- `package.json` 中的 `type`、`main`、`module`、`exports`、`imports`；
- `tsconfig.json` 中的 `module`、`moduleResolution`、`paths`；
- 构建工具的 `resolve.alias`。

TypeScript 中还应显式区分类型依赖：

```ts
import type { User } from './user.types'
```

`import type` 能区分编译期与运行时依赖，减少不必要的运行时导入，并降低循环依赖风险。

TypeScript 类型系统与 JavaScript 模块运行时是两个层面。接口在编译后通常消失，因此不能把接口当作运行时值使用：

```ts
export interface User {
  id: string
}

// User 在运行时不存在
if (value instanceof User) {
}
```

## 十三、模块设计检查清单

设计或审查模块时，可以依次检查：

1. 这个模块负责什么；
2. 它为什么会变化；
3. 哪些内容属于公共 API；
4. 外部是否依赖了它的内部实现；
5. 导入模块时是否立即产生副作用；
6. 是否隐藏了全局共享状态；
7. 依赖方向是否合理；
8. 能否不启动整个应用就独立测试；
9. 替换基础设施实现是否困难；
10. 是否存在循环依赖；
11. 公共出口是否稳定；
12. 动态导入是否落在真正的业务边界上。

## 十四、最终理解框架

JavaScript 模块化可以分为四个递进层次：

| 层次 | 关注点 |
| --- | --- |
| 语法层 | `import`、`export`、`require` |
| 运行时层 | 加载、缓存、绑定、初始化、循环依赖 |
| 工具层 | 解析、编译、打包、Tree Shaking、代码分割 |
| 架构层 | 边界、内聚、耦合、依赖方向、公共 API |

语法层回答“文件如何相互引用”，运行时层解释“代码何时加载和执行”，工具层处理“模块如何转换与优化”，架构层则决定“系统复杂度如何被边界和依赖方向约束”。

因此，模块化最终不是一种文件组织技巧，而是一种管理复杂度的方法。
