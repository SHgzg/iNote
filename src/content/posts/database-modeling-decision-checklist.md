---
title: "数据库建模判断清单"
description: "提炼实体、关系、属性、键、参照完整性、弱实体与继承建模中的核心判断方法。"
pubDate: 2026-08-26
updatedDate: 2026-08-27
category: "study-notes"
tags: ["数据库建模", "ER模型", "数据模型"]
featured: false
heroImage: "images/covers/study.svg"
draft: false
---
# 数据库建模判断清单
## 核心判断
### 实体
有独立身份、独立生命周期、多个自身属性、会被其他对象引用、关系会重复发生、需要保存历史 → 考虑独立实体。不是出现名词就建表，核心是：**是否需要被系统独立管理。**
### 属性归属
“这个字段和谁有关？” → 不够准确。
“什么决定这个值？” → 用决定因素判断归属。
保持 A 不变、更换 B，属性随 B 改变 → 属性通常属于 A-B 关系。
### 当前状态与历史事实
`PRODUCT.current_price` → 当前状态。
`ORDER_ITEM.transaction_price` → 当时事实。
需要“现在” → 读取当前实体；需要“当时” → 保存历史事实/快照。
值相同 ≠ 业务事实相同。
### M:N 与关联实体
M:N 关系具有自己的属性、生命周期或历史 → 关系本身应建模为关联实体。
同一 A+B 能重复发生 → `(a_id,b_id)` 通常不足以标识一次关系实例。
### 身份与业务唯一性
Primary Key → 主要身份。
UNIQUE → 业务上什么不能重复。
两者不是同一个问题。
### 基数与可选性
完整基数统一写 `min..max`：
```text
0..1 → 零个或一个
1..1 → 恰好一个
0..* → 零个或多个
1..* → 一个或多个
```
关系类型由 Maximum Cardinality 判断：
```text
1:1 → 两端最大值都是 1
1:N → 一端最大值 1，另一端 *
M:N → 两端最大值都是 *
```
Minimum Cardinality 判断参与约束：
```text
0 → Optional Participation
1 → Mandatory Participation
```
任何关系都双向问：一个 A 最少/最多几个 B？一个 B 最少/最多几个 A？
### Crow's Foot
```text
○| → 0..1
|| → 1..1
○< → 0..*
|< → 1..*
```
从 A 出发问“一个 A 有多少 B” → 读取 B 端符号。
## Keys
### Super Key / Candidate Key / Primary Key
```text
能唯一标识记录 → Super Key
唯一 + 删除任一属性后都不再唯一 → Candidate Key
从 Candidate Keys 中选一个主要标识 → Primary Key
未被选为 Primary Key 的 Candidate Key → Alternate Key
```
Candidate Key 的“最小”指 Minimality，不是字段数量必须为 1。
```text
(order_id,line_no)
```
若两列缺一都不能唯一 → Composite Candidate Key。
### Natural Key / Surrogate Key
```text
来自业务世界、有业务语义 → Natural Key
系统人为生成、无业务语义 → Surrogate Key
```
Natural/Surrogate 描述键的来源；Primary/Candidate/Alternate 描述键的角色，两组概念不是同一维度。
典型设计：
```text
product_id → Surrogate Primary Key
sku_code   → Natural Alternate Key + UNIQUE
```
为什么已有 `sku_code` 仍使用 `product_id`？
```text
业务标识可能变化
→ 不应让变化传播到所有引用关系
→ 用稳定代理键隔离实体身份与业务标识
```
代理主键 ≠ 放弃业务唯一性。稳定代理键与业务 UNIQUE 通常同时存在。
## Foreign Key 与参照完整性
```text
FOREIGN KEY → 引用目标必须存在
NOT NULL    → 必须参与关系
UNIQUE      → 限制同一目标被重复引用
```
1:N → FK 通常放 N 端。
```text
EMPLOYEE.department_id → DEPARTMENT.department_id
```
`EMPLOYEE → DEPARTMENT : 1..1` → FK 通常 `NOT NULL`。
`EMPLOYEE → DEPARTMENT : 0..1` → FK 可以为 `NULL`。
只定义 FK 不会自动实现 1:1：
```text
FK     → 目标存在
UNIQUE → 最多引用一次
NOT NULL → 必须引用
```
Foreign Key 不要求定义上只能引用 Primary Key；它可以引用满足相应唯一性要求的候选键，工程上通常优先引用稳定的主键。FK 也可以是 Composite Foreign Key。
### 1:1 的 FK 放哪边
一边 Optional、一边 Mandatory → 优先把 FK 放强依赖侧。
```text
USER → PROFILE : 0..1
PROFILE → USER : 1..1
```
通常：
```text
PROFILE.user_id → USER.user_id
```
从属实体没有独立身份 → 可考虑 Shared Primary Key：
```text
PROFILE.user_id → PK + FK
```
### Referential Actions
```text
子记录不能脱离父记录存在 → CASCADE
子记录能存在但不能失去父关系 → RESTRICT / NO ACTION
子记录能存在且父关系可选 → SET NULL
明确存在合法默认关联 → SET DEFAULT
```
删除策略不能仅由 1:N/1:1 推出，必须先判断生命周期和历史保留规则。
历史业务事实通常不能因主体注销而自动删除；账户/商品等主体常需要考虑软删除。
## Weak Entity 与 Identifying Relationship
### Weak Entity
自身属性不足以完整标识，必须结合 Owner Entity 的键 → Weak Entity。
```text
EMPLOYEE(employee_id)
DEPENDENT(dependent_name)
```
若家属名只在员工内部唯一：
```text
Owner Entity → EMPLOYEE
Partial Key / Discriminator → dependent_name
完整标识 → (employee_id,dependent_name)
```
### Identifying vs Non-identifying
```text
父键作为 FK，并参与子实体身份 → Identifying Relationship
父键只是 FK，不参与子实体身份 → Non-identifying Relationship
```
不要把三个维度混为一谈：
```text
Cardinality → 能关联多少？
Lifecycle Dependency → 父不存在，子还能存在吗？
Identity Dependency → 不使用父 Key，子还能唯一标识吗？
```
生命周期依赖 ≠ 身份依赖。
例如：
```text
TASK(task_id PK, project_id FK)
```
TASK 可随 PROJECT 删除 → Lifecycle Dependency ✓；`task_id` 已全局唯一 → Identity Dependency ✗ → Non-identifying。
```text
ROOM(building_id PK/FK, room_number PK)
```
`room_number` 只在 BUILDING 内唯一 → Lifecycle Dependency ✓；Identity Dependency ✓ → Identifying。
增加全局 `room_id` 后，物理键结构可以变成 Non-identifying，但领域上的生命周期依赖仍可能存在。
## Supertype / Subtype
### IS-A
```text
CARD_PAYMENT IS-A PAYMENT
BANK_TRANSFER IS-A PAYMENT
```
共同身份、属性、关系放 Supertype；类型特有属性放 Subtype。Subtype 继承 Supertype 的 Identity、Attributes、Relationships。
Subtype 与普通 1:1 不同：子类型实例和超类型实例是同一个业务对象，不是两个对象之间的关联。
### Generalization / Specialization
```text
多个具体类型 → 提取共同 Supertype → Generalization
一个通用类型 → 按业务规则拆成 Subtype → Specialization
```
角色通常不是 Subtype：同一 USER 在不同交易中可以分别作为 BUYER、SELLER → 更适合关系角色。
状态通常不是 Subtype：ORDER 从 pending → paid → shipped → 更适合状态属性/状态机。
### Disjoint / Overlapping
问：**能不能同时属于多个 Subtype？**
```text
只能是其中一种 → Disjoint
可以同时是多种 → Overlapping
```
### Total / Partial
问：**能不能一个 Subtype 都不属于？**
```text
必须至少是其中一种 → Total
可以一种都不是 → Partial
```
四种组合：
```text
Disjoint + Total
Disjoint + Partial
Overlapping + Total
Overlapping + Partial
```
例：PERSON 可以同时是 STUDENT 和 EMPLOYEE，也可以两者都不是：
```text
允许同时是多种 → Overlapping
允许一种都不是 → Partial
最少 0 个 Subtype
最多 2 个 Subtype（当前只有两个）
```
## 建模快速检查
```text
需要独立管理吗？ → 判断实体
什么决定这个值？ → 判断属性归属
描述现在还是当时？ → 当前状态 / 历史事实
同一关系能重复吗？ → 判断关系身份
一个 A 最少/最多几个 B？ → Cardinality
能唯一标识吗？ → Super Key
删除任一键属性还能唯一吗？ → Candidate Key Minimality
业务标识会变化吗？ → 考虑 Surrogate Key
引用目标必须存在吗？ → Foreign Key
关系必须存在吗？ → NOT NULL
同一目标能重复引用吗？ → UNIQUE
父不存在，子还能存在吗？ → Lifecycle Dependency
不用父 Key，子还能唯一吗？ → Identity Dependency
能同时属于多个 Subtype 吗？ → Disjoint / Overlapping
能一个 Subtype 都不属于吗？ → Total / Partial
```
