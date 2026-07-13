# iNote 内容维护规则

本项目是 Astro 内容站点。新增文章、栏目或分类时，优先按本文规则修改，不要改动无关页面。

## 内容结构

- 文章目录：`src/content/posts/`
- 文章 schema：`src/content/config.ts`
- 栏目数据：`src/data/categories.ts`
- 栏目图片：`public/images/covers/`

自动生成的页面：

- 文章页：`/posts/{文章文件名}/`
- 栏目页：`/categories/{category slug}/`
- 标签页：`/tags/{tag slug}/`
- 归档页：`/archive/`

正常新增文章或栏目时，一般不需要修改：

- `src/pages/posts/[slug].astro`
- `src/pages/categories/index.astro`
- `src/pages/categories/[slug].astro`
- `src/pages/tags/[tag].astro`
- `src/pages/archive.astro`
- `src/pages/rss.xml.js`

## 新增文章

在 `src/content/posts/` 下新建 `.md` 文件。

文件名规则：

- 使用小写英文、数字和连字符。
- 不使用中文、空格和特殊符号。
- 文件名会成为文章 URL。

示例：

```text
study-note-typescript-basics.md
```

对应 URL：

```text
/posts/study-note-typescript-basics/
```

文章模板：

```md
---
title: "文章标题"
description: "一句话说明文章内容，建议 30 到 80 字。"
pubDate: 2026-07-13
updatedDate: 2026-07-13
category: "study-notes"
tags: ["标签一", "标签二"]
featured: false
heroImage: "images/covers/study.svg"
draft: false
---

正文从这里开始。
```

字段规则：

| 字段 | 必填 | 规则 |
| --- | --- | --- |
| `title` | 是 | 文章标题，写清主题。 |
| `description` | 是 | 文章摘要，会用于卡片、文章页、meta 和 RSS。 |
| `pubDate` | 是 | 发布时间，推荐 `YYYY-MM-DD`，列表按它倒序排列。 |
| `updatedDate` | 否 | 更新时间，当前模板不展示，但 schema 支持。 |
| `category` | 是 | 必须是 `src/content/config.ts` 中允许的 slug，并且要存在于 `src/data/categories.ts`。 |
| `tags` | 否 | 标签数组，默认 `[]`，标签页自动生成。 |
| `featured` | 否 | 默认 `false`。首页优先展示第一篇 `featured: true` 的已发布文章。 |
| `heroImage` | 否 | 图片路径从 `public/` 下一级开始写，不要写 `public/`，不要以 `/` 开头。 |
| `draft` | 否 | 默认 `false`。设为 `true` 后不进入首页、栏目页、标签页、归档、RSS 和文章详情页。 |

标签规则：

- 同一概念保持同一写法。
- 每篇文章建议 1 到 4 个标签。
- 可以使用中文、英文或数字。
- 不要把栏目名机械重复成标签。

精选规则：

- 建议同时只保留一篇 `featured: true`。
- 如果多篇文章设置为 `featured: true`，首页只会展示排序后遇到的第一篇。

图片路径规则：

```text
public/images/covers/study.svg
```

在 frontmatter 中写：

```md
heroImage: "images/covers/study.svg"
```

## 只有裸 Markdown 内容时

如果用户只提供一段没有 frontmatter、没有文件名、没有栏目和标签的 Markdown 字符串，按以下规则补齐信息后再新增文章。

处理原则：

- 不要求用户补充信息，除非内容完全无法判断主题。
- 不改写正文含义，只做必要的格式整理。
- 必须为文章补齐合法 frontmatter。
- 必须选择已有栏目，不要因为一篇文章临时新增栏目。
- 如果分类不确定，优先使用 `essays`。

推断顺序：

1. 从正文第一个一级标题 `# 标题` 提取 `title`。
2. 如果没有一级标题，用第一句或第一段概括为 `title`。
3. `description` 用正文前 30 到 80 字概括，避免照抄过长段落。
4. `pubDate` 使用当前日期，格式为 `YYYY-MM-DD`。
5. `category` 根据正文主题匹配已有栏目。
6. `tags` 从正文主题中提取 1 到 4 个关键词。
7. `featured` 默认 `false`。
8. `draft` 默认 `false`，除非用户明确说这是草稿。
9. `heroImage` 使用所选栏目的 `image`。

标题处理：

- 如果正文已有 `# 标题`，frontmatter 使用这个标题。
- 正文中可以保留原有 `# 标题`。
- 如果正文没有标题，不要强行在正文开头新增标题，只在 frontmatter 中补 `title`。

文件名处理：

- 根据 `title` 生成英文 slug 文件名。
- 使用小写英文、数字和连字符。
- 如果标题是中文，翻译或概括为简短英文 slug。
- 如果同名文件已存在，在末尾追加短后缀。

示例：

```text
morning-writing-notes.md
morning-writing-notes-2.md
```

分类参考：

| 内容特征 | 默认栏目 |
| --- | --- |
| 菜谱、饮食、备菜、做饭 | `private-menu` |
| 学习记录、教程、课程、技术概念 | `study-notes` |
| 读书笔记、摘录、章节理解 | `reading-notes` |
| 松散记录、生活片段、短文 | `essays` |
| 判断、观点、问题推演、反思 | `thinking` |
| 专业能力、工程实践、学习路线 | `professional-learning` |
| 项目过程、实现记录、复盘 | `projects` |
| 工具、工作流、效率方法 | `tools` |
| 城市、关系、身体、日常观察 | `life` |
| 电影、音乐、播客、展览、作品短评 | `media` |

裸 Markdown 转换示例：

用户提供：

```md
# 慢读一本书

这周重新读了一本书，发现真正有价值的不是划线，而是把问题留下来。
```

应保存为类似：

```md
---
title: "慢读一本书"
description: "记录一次重新阅读后的方法变化：比起划线，更重要的是把问题留下来。"
pubDate: 2026-07-13
category: "reading-notes"
tags: ["阅读", "笔记方法"]
featured: false
heroImage: "images/covers/reading.svg"
draft: false
---

# 慢读一本书

这周重新读了一本书，发现真正有价值的不是划线，而是把问题留下来。
```

## 当前栏目

新增文章时，优先使用已有栏目。

| slug | 栏目名 | 适合内容 |
| --- | --- | --- |
| `private-menu` | 私房菜单 | 菜谱、备菜流程、口味调整、餐桌经验 |
| `study-notes` | 学习笔记 | 课程、教程、论文、概念整理 |
| `reading-notes` | 阅读笔记 | 读书摘要、章节结构、摘录后的追问 |
| `essays` | 随笔 | 生活片段、短句、观察、未系统化想法 |
| `thinking` | 思考 | 判断、困惑、推演过程、想法修正 |
| `professional-learning` | 专业学习 | 能力栈、工程实践、方法论、学习计划 |
| `projects` | 项目记录 | 项目背景、实现过程、取舍、踩坑、复盘 |
| `tools` | 工具方法 | 命令行、编辑器、自动化、写作系统、信息管理 |
| `life` | 生活观察 | 城市、关系、身体、节奏、日常经验 |
| `media` | 书影音 | 电影、播客、音乐、展览和作品短评 |

## 新增栏目或分类

只有现有栏目无法承载新内容时，才新增栏目。

必须修改：

1. `src/content/config.ts`
2. `src/data/categories.ts`

按需新增：

1. `public/images/covers/{slug}.svg`

### 1. 设计 slug

slug 规则：

- 使用小写英文。
- 多个单词用连字符连接。
- 不使用中文、空格和特殊符号。
- 不和已有 slug 重复。
- 发布后尽量不改，避免栏目 URL 变化。

示例：

```text
travel-notes
```

栏目 URL：

```text
/categories/travel-notes/
```

文章中使用：

```md
category: "travel-notes"
```

### 2. 修改 `src/content/config.ts`

把新 slug 加入 `postCategories`。

示例：

```ts
const postCategories = [
  'private-menu',
  'study-notes',
  'travel-notes',
  ...
] as const;
```

作用：

- 约束文章 frontmatter 的 `category`。
- 如果文章使用了未登记的 slug，构建会失败。

### 3. 修改 `src/data/categories.ts`

在 `categories` 数组中新增栏目对象。

示例：

```ts
{
  slug: 'travel-notes',
  name: '旅行笔记',
  deck: '路线、地方与抵达之后的观察',
  description: '记录旅行路线、城市观察、途中经验和可以复用的行前准备。',
  accent: '#4f7c9f',
  image: 'images/covers/travel.svg'
}
```

字段规则：

| 字段 | 规则 |
| --- | --- |
| `slug` | 必须和 `src/content/config.ts` 里的新 slug 完全一致。 |
| `name` | 栏目中文名，用于栏目卡片、栏目页、文章卡片和归档页。 |
| `deck` | 栏目短说明，用于首页和栏目索引卡片。 |
| `description` | 栏目完整说明，用于栏目详情页和页面描述。 |
| `accent` | 栏目强调色，使用十六进制颜色，例如 `#4f7c9f`。 |
| `image` | 栏目图片路径，从 `public/` 下一级开始写。 |

图片示例：

```text
public/images/covers/travel.svg
```

在 `categories.ts` 中写：

```ts
image: 'images/covers/travel.svg'
```

如果暂时没有新图，可以先复用已有封面。

## 检查清单

新增文章后检查：

1. 文件位于 `src/content/posts/`。
2. 文件名符合 URL 规则。
3. frontmatter 包含必填字段。
4. `category` 是已登记 slug。
5. `heroImage` 路径不包含 `public/`。
6. 如需隐藏文章，确认 `draft: true`。

新增栏目后检查：

1. `src/content/config.ts` 已加入新 slug。
2. `src/data/categories.ts` 已加入同 slug 的栏目对象。
3. 两处 slug 拼写完全一致。
4. `image` 指向的文件存在，或明确复用已有图片。
5. 至少有一篇文章使用这个新栏目。

最后运行：

```sh
pnpm run build
```

构建通过后再认为内容结构修改完成。

## 常见错误

`category` 写错：

```md
category: "study-note"
```

正确写法：

```md
category: "study-notes"
```

只改 `categories.ts`，没改 `config.ts`：

- 文章会因为 schema 不认识新栏目而构建失败。

只改 `config.ts`，没改 `categories.ts`：

- 文章可能通过校验，但页面拿不到栏目名称、颜色和图片。

图片路径写错：

```ts
image: 'public/images/covers/travel.svg'
```

正确写法：

```ts
image: 'images/covers/travel.svg'
```

多篇文章设置精选：

- 首页只会取第一篇 `featured: true`。
- 维护时应主动检查是否需要取消旧精选。
