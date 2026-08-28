---
title: "数据模型与 ER 图：极简记忆版"
description: "将 S1 数据模型与 ER 图基础压缩为概念地图、判断口诀、十问检查表和一条完整建模链，便于快速复习与长期记忆。"
pubDate: 2026-08-26
updatedDate: 2026-08-28
category: "study-notes"
tags: ["数据库建模", "ER模型", "数据模型"]
featured: false
heroImage: "images/covers/study.svg"
draft: false
---
# 数据模型与 ER 图：极简记忆版

## 总框架：S1 只解决五个问题

```text
有什么？       → Entity / Attribute
怎么关联？     → Relationship / Cardinality
怎么认出它？   → Key
怎么约束关系？ → FK / NULL / UNIQUE
特殊情况？     → Weak Entity / Subtype
```

记忆：**对象 → 关系 → 身份 → 约束 → 特化。**

## 三层模型

```text
Conceptual Model → 业务上有什么？
Logical Model    → 数据如何组织？
Physical Model   → 数据库如何实现？
```

记忆：**概念讲业务，逻辑讲结构，物理讲实现。**

```text
业务事实 → 概念模型 → 逻辑模型 → 物理模型
```

## Entity / Attribute

### Entity

需要被系统独立识别和管理 → 考虑 Entity。

```text
有身份？
有生命周期？
有自身属性？
会被引用？
会重复发生？
要保存历史？
```

不是“出现名词就建表”。

### Attribute

判断属性归属只问：**什么决定这个值？**

```text
EMPLOYEE 决定 hire_date
→ EMPLOYEE 属性

EMPLOYEE + PROJECT 才决定 role
→ Relationship 属性
```

保持 A 不变、更换 B，属性随 B 改变 → 属性通常属于 A-B 关系。

## 当前状态与历史事实

只问：**这是现在，还是当时？**

```text
PRODUCT.current_price
→ 当前状态

ORDER_ITEM.transaction_price
→ 历史事实
```

记忆：**值相同 ≠ 业务事实相同；历史事实发生后，不跟当前状态一起变化。**

## Relationship / Cardinality

基本关系：`1:1`、`1:N`、`M:N`。

任何关系固定双向问：

```text
一个 A 最少几个 B？
一个 A 最多几个 B？
一个 B 最少几个 A？
一个 B 最多几个 A？
```

```text
0..1 → 零个或一个
1..1 → 恰好一个
0..* → 零个或多个
1..* → 一个或多个
```

```text
Maximum Cardinality → 判断 1:1 / 1:N / M:N
Minimum Cardinality → 判断 Optional / Mandatory
```

记忆：**最大看关系类型，最小看是否必须。**

## Crow's Foot

```text
○| → 0..1
|| → 1..1
○< → 0..*
|< → 1..*
```

记忆：**从谁出发，看谁对面。**

问“一个 A 有多少 B？” → 看 B 端符号。

## M:N 与 Associative Entity

看到 `A M:N B`，继续问：**关系本身有没有业务信息？**

```text
有属性 / 历史 / 生命周期
→ 关系实体化
→ Associative Entity
```

例如：

```text
STUDENT
   ↓
ENROLLMENT
   ↓
COURSE

ENROLLMENT:
semester
grade
enrolled_at
```

再问：**同一 A+B 能不能重复发生？**

```text
加入 → 退出 → 再加入
```

能重复 → `(a_id,b_id)` 通常不足以标识某一次关系实例。

## Keys：身份系统

```text
能唯一
→ Super Key

最小唯一
→ Candidate Key

选中的 Candidate Key
→ Primary Key

未选中的 Candidate Key
→ Alternate Key
```

Candidate Key 的“最小”指 Minimality：**删除任何一个组成属性，都不能继续唯一。**

```text
(order_id, line_no)
```

若缺一都不能唯一 → Composite Candidate Key。

### Natural Key / Surrogate Key

这是另一条分类轴：

```text
来自业务世界 → Natural Key
系统人为生成 → Surrogate Key
```

一个键可以同时属于多种分类：

```text
product_id
→ Candidate + Primary + Surrogate

sku_code
→ Candidate + Alternate + Natural
```

典型设计：

```text
product_id PRIMARY KEY
sku_code UNIQUE
```

记忆：**代理键管稳定身份，业务键管业务唯一。**

## Foreign Key：关系落地

只记三个约束：

```text
FOREIGN KEY → 引用目标必须存在
NOT NULL    → 关系必须存在
UNIQUE      → 引用不能重复
```

看到 FK 固定问：

```text
能 NULL 吗？
能重复吗？
```

### 1:N

通常：**FK 放 N 端。**

```text
EMPLOYEE.department_id → DEPARTMENT.department_id
```

### 1:1

一边 Optional、一边 Mandatory → 通常优先把 FK 放强依赖侧。

```text
USER → PROFILE : 0..1
PROFILE → USER : 1..1

PROFILE.user_id → FK + NOT NULL + UNIQUE
```

从属实体没有独立身份 → 可考虑 Shared Primary Key：

```text
PROFILE.user_id → PK + FK
```

## Referential Actions

```text
父没了，子也没意义
→ CASCADE

父被引用时不准删
→ RESTRICT / NO ACTION

父没了，子还能活且关系可选
→ SET NULL

存在明确合法默认关联
→ SET DEFAULT
```

最高原则：**删除策略看生命周期，不看 1:N。**

历史业务事实通常不能因主体注销而机械 CASCADE。

## Weak Entity

只问：**不用 Owner 的 Key，它还能唯一标识自己吗？**

不能 → Identity Dependency → 考虑 Weak Entity。

```text
BUILDING
└── ROOM

ROOM PK = (building_id, room_number)
```

```text
BUILDING    → Owner Entity
room_number → Partial Key / Discriminator
```

## 三种概念不要混

```text
Cardinality
→ 能关联多少？

Lifecycle Dependency
→ 父没了，子还能活吗？

Identity Dependency
→ 不用父 Key，子还能唯一吗？
```

记忆：**数量、生命、身份——三回事。**

## Identifying Relationship

```text
父 Key 是 FK
+
父 Key 参与子 PK
→ Identifying Relationship
```

```text
ROOM(
  building_id PK/FK,
  room_number PK
)
→ Identifying
```

```text
TASK(
  task_id PK,
  project_id FK
)
→ Non-identifying
```

记忆：**父键入子键 → Identifying。**

生命周期依赖 ≠ 身份依赖。

## Supertype / Subtype

核心关系是 `IS-A`：

```text
CARD_PAYMENT IS-A PAYMENT
BANK_TRANSFER IS-A PAYMENT
```

共同身份、属性、关系 → Supertype。
类型特有属性、关系、约束 → Subtype。

记忆：**共同上提，特殊下沉。**

Subtype 不是普通 `1:1`：子类型实例和超类型实例是同一个业务对象。

### Generalization / Specialization

```text
多个具体类型 → 提取共同 Supertype
→ Generalization

一个通用类型 → 拆成具体 Subtype
→ Specialization
```

记忆：**向上抽象 → Generalization；向下细分 → Specialization。**

### Disjoint / Overlapping

问：**能不能同时属于多个 Subtype？**

```text
只能一种 → Disjoint
同时多种 → Overlapping
```

### Total / Partial

问：**能不能一个 Subtype 都不属于？**

```text
至少一种 → Total
可以没有 → Partial
```

最短记忆：

```text
只能一种 → Disjoint
同时多种 → Overlapping
至少一种 → Total
可以没有 → Partial
```

## State / Role / type / Category / Subtype

看到业务分类，不要立即建立 Subtype。

```text
会迁移
→ State

依关系而变
→ Role

只是值不同
→ type

大量可扩展
→ Category

稳定且结构不同
→ Subtype
```

典型例子：

```text
ORDER: pending → paid → shipped
→ State

USER: buyer / seller
→ Role

USER: VIP / normal，仅值不同
→ type

PRODUCT: 手机 / 图书 / 食品 / 家具 / ...
→ Category

PAYMENT: CARD / BANK_TRANSFER，存在独有字段、关系、约束
→ Subtype
```

## S1 十问记忆卡

复习时只回答下面十问：

```text
1. 要独立管理吗？
   → Entity

2. 什么决定这个值？
   → Attribute Ownership

3. 一个 A 最少/最多几个 B？
   → Cardinality

4. 关系本身有属性/历史吗？
   → Associative Entity

5. 什么能最小唯一？
   → Candidate Key

6. FK 能 NULL 吗？能重复吗？
   → Participation / Cardinality

7. 父没了，子还能活吗？
   → Lifecycle Dependency

8. 不用父 Key，子还能唯一吗？
   → Identity Dependency

9. 父 Key 是否进入子 PK？
   → Identifying Relationship

10. 是状态、角色、普通分类、开放分类还是稳定结构差异？
    → State / Role / type / Category / Subtype
```

## 最终建模链

```text
业务事实
  ↓
找实体
  ↓
定属性
  ↓
连关系
  ↓
判基数
  ↓
拆 M:N
  ↓
找 Key
  ↓
定 FK / NULL / UNIQUE
  ↓
判生命周期与身份依赖
  ↓
处理 Weak Entity / Subtype
```

最终记忆：**先识别业务事实和身份，再确定属性归属与关系；用 Cardinality 描述数量约束，用 Keys 描述身份，用 FK / UNIQUE / NOT NULL 落实关系约束，最后处理弱实体、历史关系和继承分类。**
