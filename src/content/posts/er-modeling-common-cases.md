---
title: "ER 数据建模常用案例"
description: "汇总 S1 学习中反复使用的订单、群聊、项目成员、选课、弱实体、继承与分类案例，以规范术语说明核心建模判断。"
pubDate: 2026-08-28
updatedDate: 2026-08-28
category: "study-notes"
tags: ["数据库建模", "ER模型", "建模案例"]
featured: false
heroImage: "images/covers/study.svg"
draft: false
---
# ER 数据建模常用案例

## 1. 商品价格与订单成交价：当前状态和历史事实

### 业务规则
商品具有当前销售价格；订单明细必须保留下单时的实际成交价格。商品价格之后可能发生变化。

### 模型
```text
PRODUCT
- product_id PK
- current_price

ORDER
- order_id PK

ORDER_ITEM
- order_item_id PK
- order_id FK → ORDER.order_id
- product_id FK → PRODUCT.product_id
- transaction_price
```

### 核心判断
`PRODUCT.current_price` 表示商品的**当前状态（Current State）**。

`ORDER_ITEM.transaction_price` 表示一次交易发生时形成的**历史事实（Historical Fact）**。

即使下单瞬间两个值完全相同，也不能因此合并字段：**数值相同不代表业务语义相同。**

---

## 2. 订单与订单明细：关联实体与身份设计

### 业务规则
一个订单包含一个或多个订单明细；每个订单明细只属于一个订单。订单明细记录具体商品、数量和成交价格。

### 基数
```text
ORDER → ORDER_ITEM : 1..*
ORDER_ITEM → ORDER : 1..1
```

### 两种身份设计
若订单明细采用独立代理主键：

```text
ORDER_ITEM
- order_item_id PK
- order_id FK
- product_id FK
- quantity
- transaction_price
```

此时 `ORDER_ITEM` 在关系模型中具有独立主键，`order_id` 不参与其身份。

若业务使用订单内行号标识订单明细：

```text
ORDER_ITEM
- order_id PK/FK
- line_no PK
- product_id FK
- quantity
- transaction_price

PK(order_id, line_no)
```

此时 `line_no` 只在一个订单内部唯一，`ORDER_ITEM` 对 `ORDER` 存在 **Identity Dependency（身份依赖）**，两者构成 **Identifying Relationship（识别关系）**。

### 核心判断
是否属于 Weak Entity，不能仅依据“删除订单时订单明细也应该删除”判断。必须区分：

```text
Lifecycle Dependency → 父实体不存在时，子实体能否继续存在？
Identity Dependency  → 不使用父实体的 Key，子实体能否唯一标识？
```

---

## 3. 用户与群聊：M:N 与成员关系实体

### 业务规则
一个用户可以加入多个群聊；一个群聊可以包含多个用户。

### 原始关系
```text
USER M:N GROUP_CHAT
```

M:N 关系应通过关联实体表示：

```text
USER
  1
  |
  N
GROUP_MEMBERSHIP
  N
  |
  1
GROUP_CHAT
```

例如：

```text
GROUP_MEMBERSHIP
- membership_id PK
- user_id FK → USER.user_id
- group_id FK → GROUP_CHAT.group_id
- joined_at
- left_at
- role
```

### 为什么不能始终使用 `(user_id, group_id)` 作为唯一标识
如果业务只维护“当前是否为群成员”，并且同一用户在同一群中最多只有一条成员记录，则可以使用：

```text
UNIQUE(user_id, group_id)
```

但如果需要保存：

```text
加入 → 退出 → 再次加入
```

那么同一个 `(user_id, group_id)` 会对应多个不同的成员关系实例。

此时需要能够区分每一次 Membership，例如使用 `membership_id`，或者设计包含关系实例信息的候选键。

### 核心判断
**同一组参与者之间的关系能否重复发生，是关系身份设计的关键问题。**

---

## 4. 群聊与聊天消息：业务事实实体

### 业务规则
一个群聊包含多条聊天消息；每条聊天消息由一个用户发送，并属于一个群聊。

### 模型
```text
CHAT_MESSAGE
- message_id PK
- group_id FK → GROUP_CHAT.group_id
- sender_user_id FK → USER.user_id
- content
- sent_at
```

### 基数
```text
GROUP_CHAT → CHAT_MESSAGE : 0..*
CHAT_MESSAGE → GROUP_CHAT : 1..1

USER → CHAT_MESSAGE : 0..*
CHAT_MESSAGE → USER : 1..1
```

`CHAT_MESSAGE` 不是 USER 与 GROUP_CHAT 的简单连接记录，而是具有独立身份、发生时间、内容和生命周期的业务事实实体。

---

## 5. 消息 @ 用户：再次出现 M:N

### 业务规则
一条消息可以 @ 多个用户；一个用户可以被多条消息 @。

### 原始关系
```text
CHAT_MESSAGE M:N USER
```

拆解为：

```text
MESSAGE_MENTION
- message_id FK → CHAT_MESSAGE.message_id
- mentioned_user_id FK → USER.user_id
```

如果一条消息中同一个用户只允许形成一个 Mention 关系，可定义：

```text
PK(message_id, mentioned_user_id)
```

或等价的业务唯一约束。

### 核心判断
一个业务模型中可以连续出现多层 M:N。每一个 M:N 都必须根据自己的业务语义独立判断，而不能因为已有一个关联实体就停止分析。

---

## 6. 员工与项目：关系属性属于 PROJECT_MEMBER

### 业务规则
一个员工可以参与多个项目，一个项目可以包含多个员工；员工在不同项目中可以承担不同角色。

### 模型
```text
EMPLOYEE M:N PROJECT
```

拆解：

```text
PROJECT_MEMBER
- project_member_id PK
- employee_id FK → EMPLOYEE.employee_id
- project_id FK → PROJECT.project_id
- role
- joined_at
```

### 属性归属
`role` 不属于 `EMPLOYEE`，因为同一个员工在不同项目中的角色可能不同。

判断过程：

```text
保持 EMPLOYEE 不变
→ 更换 PROJECT
→ role 可能变化
→ role 由 EMPLOYEE + PROJECT 的成员关系决定
```

因此 `role` 属于 `PROJECT_MEMBER`。

### 核心判断
判断属性归属不要只问“这个字段和谁有关”，而应问：**什么业务事实决定这个值？**

---

## 7. 学生与课程：可重复发生的关联实体

### 业务规则
一个学生可以报名多门课程；一门课程可以有多个学生；同一学生允许在不同学期重复报名同一课程。每次报名记录学期、报名时间和成绩。

### 原始关系
```text
STUDENT M:N COURSE
```

完整基数：

```text
STUDENT → COURSE : 0..*
COURSE → STUDENT : 0..*
```

拆解为：

```text
ENROLLMENT
- enrollment_id PK
- student_id FK → STUDENT.student_id
- course_id FK → COURSE.course_id
- semester
- enrolled_at
- grade
```

`semester`、`enrolled_at`、`grade` 描述的是一次 Enrollment，而不是 STUDENT 或 COURSE 自身。

### 唯一性
因为允许不同学期重复报名：

```text
UNIQUE(student_id, course_id)
```

不能表达业务规则。

如果业务规定“同一学生在同一学期最多报名同一课程一次”，则可以考虑：

```text
UNIQUE(student_id, course_id, semester)
```

### 核心判断
**业务允许关系重复发生时，候选键必须能够区分不同的关系实例。**

---

## 8. Building 与 Room：Weak Entity 标准案例

### 业务规则
每栋建筑内部的房间号唯一，但房间号在不同建筑之间可以重复，例如两栋建筑都可以有 `101`。

### 模型
```text
BUILDING
- building_id PK

ROOM
- building_id PK/FK → BUILDING.building_id
- room_number PK

PK(building_id, room_number)
```

### 判断
`room_number` 不能全局唯一标识 ROOM。

必须结合：

```text
building_id + room_number
```

才能形成完整身份。

因此：

```text
BUILDING    → Owner Entity
ROOM        → Weak Entity
room_number → Partial Key / Discriminator
```

`BUILDING` 与 `ROOM` 之间属于 Identifying Relationship。

### 与代理主键方案的区别
如果改为：

```text
ROOM
- room_id PK
- building_id FK
- room_number

UNIQUE(building_id, room_number)
```

则 `room_id` 已经可以独立标识 ROOM，`building_id` 不再参与关系模型中的主键，因此该关系在关系模型实现上变为 Non-identifying；但 ROOM 在领域中的生命周期仍然可能依赖 BUILDING。

---

## 9. Project 与 Task：生命周期依赖不等于身份依赖

### 模型
```text
PROJECT
- project_id PK

TASK
- task_id PK
- project_id FK → PROJECT.project_id
```

假设业务规定 PROJECT 删除时，其 TASK 一并删除。

此时：

```text
Lifecycle Dependency ✓
```

但 `task_id` 已经能够全局唯一标识 TASK：

```text
Identity Dependency ✗
```

因此 `project_id` 只是 Foreign Key，不参与 TASK 的 Primary Key，属于 Non-identifying Relationship。

### 核心判断
```text
随父实体删除
≠ Weak Entity
≠ Identifying Relationship
```

必须分别判断生命周期和身份。

---

## 10. User 与 Profile：1:1 的约束实现

### 业务规则
一个 USER 最多拥有一个 PROFILE；一个 PROFILE 必须且只能属于一个 USER。

### 基数
```text
USER → PROFILE : 0..1
PROFILE → USER : 1..1
```

### 模型
```text
PROFILE
- profile_id PK
- user_id FK → USER.user_id

UNIQUE(user_id)
NOT NULL(user_id)
```

含义：

```text
FK       → USER 必须存在
NOT NULL → PROFILE 必须关联 USER
UNIQUE   → 同一个 USER 最多对应一个 PROFILE
```

如果 PROFILE 没有独立身份，可以使用 Shared Primary Key：

```text
PROFILE
- user_id PK/FK → USER.user_id
```

### 核心判断
1:1 不是仅靠 Foreign Key 得到的；通常还需要 `UNIQUE`，并根据 Minimum Cardinality 判断是否需要 `NOT NULL`。

---

## 11. Payment：Supertype / Subtype

### 业务规则
所有支付都具有金额、创建时间等共同信息；银行卡支付和银行转账具有不同的字段、关系和校验规则，且支付方式创建后固定。

### 模型
```text
PAYMENT
- payment_id PK
- amount
- created_at

CARD_PAYMENT IS-A PAYMENT
- payment_id PK/FK
- card_network
- authorization_code

BANK_TRANSFER IS-A PAYMENT
- payment_id PK/FK
- bank_reference_no
```

共同属性放入 Supertype，类型特有属性和约束放入 Subtype。

如果业务规定支付必须属于两种方式之一，而且不能同时属于两种：

```text
Disjoint + Total
```

### 核心判断
```text
稳定类型
+ 独有属性
+ 独有关系或约束
→ 考虑 Subtype
```

Subtype 表达 `IS-A`，不是两个独立实体之间的普通 `1:1`。

---

## 12. Person / Student / Employee：Overlapping + Partial

### 业务规则
一个 PERSON 可以是 STUDENT，也可以是 EMPLOYEE；同一个 PERSON 可以同时具有两种身份，也可以两者都不是。

### 判断
```text
可以同时属于多个 Subtype
→ Overlapping

可以一个 Subtype 都不属于
→ Partial
```

因此：

```text
PERSON
├── STUDENT
└── EMPLOYEE

Overlapping + Partial
```

### 核心判断
```text
能否同时属于多个？
→ Disjoint / Overlapping

能否一个都不属于？
→ Total / Partial
```

这两个约束维度必须独立判断。

---

## 13. Product 分类：Category 不等于 Subtype

### 业务规则
商品可以属于手机、图书、服装、食品、家具等大量分类，并且分类体系会持续增加和调整。

如果为每个分类建立 Subtype：

```text
PHONE_PRODUCT
BOOK_PRODUCT
CLOTHING_PRODUCT
FOOD_PRODUCT
...
```

会使模型随业务分类数量持续膨胀。

更适合使用 Classification Model：

```text
PRODUCT
- product_id PK
- category_id FK

CATEGORY
- category_id PK
- parent_category_id FK → CATEGORY.category_id
- name
```

### 核心判断
```text
少量、稳定、结构差异明显
→ Subtype

大量、开放、持续变化的业务分类
→ Category / Classification Model
```

---

## 14. User 的 Buyer / Seller：Role 不等于 Subtype

### 业务规则
同一个 USER 在不同交易中可能作为买家，也可能作为卖家。

`BUYER`、`SELLER` 描述的是 USER 在某个交易关系中的角色，而不是稳定的实体类型。

例如：

```text
ORDER
- buyer_user_id FK → USER.user_id
- seller_user_id FK → USER.user_id
```

两个 Foreign Key 都引用 USER，但表达不同的 Relationship Role。

### 核心判断
```text
身份依赖具体关系而变化
→ Role
```

不要因为业务语言中出现“买家”“卖家”就建立 BUYER、SELLER Subtype。

---

## 15. Order 的 Pending / Paid / Shipped：State 不等于 Subtype

### 业务规则
同一个 ORDER 会经历：

```text
pending → paid → shipped → completed
```

这些值描述同一个实体生命周期中的不同阶段，因此属于 State，而不是多个实体类型。

### 核心判断
```text
同一个对象会在分类之间迁移
→ State
```

---

## 案例复习索引

```text
商品当前价 / 成交价
→ Current State vs Historical Fact

ORDER / ORDER_ITEM
→ 1:N、历史事实、身份设计

USER / GROUP_CHAT / GROUP_MEMBERSHIP
→ M:N、Associative Entity、重复关系实例

CHAT_MESSAGE / USER
→ 业务事实实体、Role-based FK

MESSAGE_MENTION
→ M:N 再拆解

EMPLOYEE / PROJECT / PROJECT_MEMBER
→ Relationship Attribute

STUDENT / COURSE / ENROLLMENT
→ 可重复发生的 Associative Entity、业务唯一性

BUILDING / ROOM
→ Weak Entity、Identity Dependency、Identifying Relationship

PROJECT / TASK
→ Lifecycle Dependency ≠ Identity Dependency

USER / PROFILE
→ 1:1、FK + UNIQUE + NOT NULL、Shared Primary Key

PAYMENT / CARD_PAYMENT / BANK_TRANSFER
→ Supertype/Subtype、Disjoint + Total

PERSON / STUDENT / EMPLOYEE
→ Overlapping + Partial

PRODUCT / CATEGORY
→ Category vs Subtype

USER / BUYER / SELLER
→ Role vs Subtype

ORDER 状态
→ State vs Subtype
```

这些案例覆盖 S1 中最重要的建模判断。复习时应先看业务规则自行判断，再对照模型与结论，而不是直接记忆表结构。
