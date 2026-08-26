---
title: "数据库建模基础：三层模型与关系属性归属"
description: "从概念模型、逻辑模型到物理模型，整理实体关系、M:N 关联实体、外键方向与属性归属的基本判断方法。"
pubDate: 2026-08-26
updatedDate: 2026-08-26
category: "study-notes"
tags: ["数据库建模", "ER模型", "关联实体", "数据模型"]
featured: false
heroImage: "images/covers/study.svg"
draft: false
---

# 数据库建模基础：三层模型与关系属性归属

## 从业务到数据库的三层模型

数据库建模不应该从 `CREATE TABLE` 开始。一个业务需求通常应经历三个层次：

```text
现实业务
  ↓
概念模型
  ↓
逻辑模型
  ↓
物理模型
```

### 概念模型：业务世界里有什么

概念模型首先识别业务中的核心实体以及实体之间的关系，不急于考虑字段类型、索引或具体数据库。

例如二手交易业务中的“用户可以发布商品，其他用户可以购买商品”，可以先识别：

```text
用户 ──发布── 商品
用户 ──购买── 交易
交易 ──对应── 商品
```

这一层回答的是：业务世界里有哪些重要概念，它们之间是什么关系。

### 逻辑模型：数据如何组织

逻辑模型开始明确实体的属性、主键、外键以及关系基数。例如：

```text
USER
- user_id PK
- name

PRODUCT
- product_id PK
- seller_id FK
- title
- price

TRADE
- trade_id PK
- product_id FK
- buyer_id FK
- status
```

关系基数实际上是在编码业务规则。例如一个二手商品究竟是 `PRODUCT 1 : 0..1 TRADE`，还是允许出现多次交易记录的 `PRODUCT 1 : N TRADE`，不能由数据库设计者凭空决定，而要由业务语义确定。

### 物理模型：在具体数据库中实现

到了物理模型才进一步决定：

- 使用 BIGINT 还是 UUID；
- VARCHAR 长度；
- 金额字段类型；
- 是否建立实际外键；
- NOT NULL、UNIQUE 等约束；
- 索引设计；
- 分区等物理存储方案。

因此可以把三层模型压缩成三个问题：

```text
概念模型：What exists？业务里有什么？
逻辑模型：How is data structured？数据如何组织？
物理模型：How is it implemented？具体数据库如何实现？
```

## 1:N 关系中的外键方向

对于：

```text
TEACHER 1 ─── N CLASS
```

外键应该放在 N 端：

```text
CLASS.teacher_id → TEACHER.teacher_id
```

因为每一门课程需要记录它属于哪个老师。不能反写成 `TEACHER.teacher_id → CLASS.class_id`。

这是一个基础规则：在普通 1:N 关系中，通常由 N 端保存 1 端的主键作为外键。

## M:N 关系与关联实体

在线教育平台中：

```text
STUDENT M:N CLASS
```

一个学生可以报名多门课程，一门课程也可以有多个学生。关系型数据库中通常引入关联实体：

```text
STUDENT 1 ─── N ENROLLMENT N ─── 1 CLASS
```

例如：

```text
ENROLLMENT
- enrollment_id PK
- student_id FK
- class_id FK
- enrolled_at
- status
- final_score
```

关联实体不只是为了“消除 M:N”。当一个关系本身拥有需要记录的属性时，这个关系已经具有独立的数据语义，应当被建模为正式实体。

## 属性到底属于实体还是关系

判断一个属性应该放在哪张表，不能根据字段名称或字段类型判断，而应该问：

> 这个属性描述的究竟是哪一个事实？

例如学生报名课程：

```text
报名时间
报名状态
最终成绩
```

都不是学生本身的属性，也不是课程本身的属性，而是“某个学生参加某门课程”这个关系的属性，因此属于 `ENROLLMENT`。

最终成绩尤其容易放错。一个学生在不同课程中会有不同成绩：

```text
张三
├── 数据库：88
├── 操作系统：92
└── 算法：76
```

因此 `final_score` 不能放在 `STUDENT` 上。

### 项目成员案例

对于：

```text
EMPLOYEE M:N PROJECT
```

拆成：

```text
EMPLOYEE 1 ─── N PROJECT_MEMBER N ─── 1 PROJECT
```

属性归属为：

```text
EMPLOYEE
- employee_id
- hire_date

PROJECT_MEMBER
- employee_id
- project_id
- project_role
- joined_at
- weekly_hours
```

`project_role`、`joined_at`、`weekly_hours` 会随着员工参与的项目不同而变化，因此属于 `PROJECT_MEMBER`。

`hire_date` 描述员工加入公司的事实，不会因为员工换一个项目而变化，因此属于 `EMPLOYEE`。

一个实用判断方法是：

> 把关系另一端换掉，这个属性是否会跟着变化？

如果会变化，它往往描述的是关系；如果不会，则进一步检查它是否属于某个实体自身。

## 当前状态与历史事实

商品交易案例进一步说明了属性归属中的时间语义：

```text
USER
└── registered_at

PRODUCT
└── current_price

ORDER_ITEM / PURCHASE
├── transaction_price
├── quantity
└── purchased_at
```

`current_price` 描述商品现在的状态，而 `transaction_price` 描述某次交易发生时的事实。

例如商品昨天以 100 元成交，今天价格调整到 120 元，历史订单仍然必须保留 100 元的成交事实，不能使用商品当前价格重新计算历史订单。

因此订单中经常会保存交易发生时的价格、商品名称等快照字段。它们虽然可能和商品表中的字段表面重复，但业务语义和时间语义不同。这也是后续学习反范式和历史快照设计的重要基础。

## 属性归属的核心判断

目前可以使用下面的判断方式：

```text
registered_at
→ 由 User 自身决定
→ USER

current_price
→ 由 Product 当前状态决定
→ PRODUCT

transaction_price
→ 由这次交易决定
→ ORDER_ITEM / PURCHASE

project_role
→ 由 Employee + Project 的参与关系决定
→ PROJECT_MEMBER
```

核心不是问“这个字段看起来和谁有关”，而是：

> 这个字段描述的事实，其决定因素是谁？

这个判断方式也为后续学习函数依赖和数据库范式提供基础。

## 进一步需要关注的业务规则

关联实体的唯一性不能脱离业务规则决定。

例如学生是否允许重复报名同一课程：

- 如果不允许，`(student_id, class_id)` 可以构成候选键，并建立唯一约束；
- 如果允许退课后重新报名或重修，仅靠 `(student_id, class_id)` 就无法区分多次报名，需要独立的 `enrollment_id`，或者增加 `attempt_no` 等能够区分不同报名事件的信息。

因此主键和唯一约束的设计，本质上仍然依赖业务对“什么算同一个事实”的定义。
