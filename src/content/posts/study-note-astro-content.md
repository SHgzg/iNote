---
title: "Astro 内容集合的最小理解"
description: "从内容集合、动态路由和类型校验三个角度理解 Astro 如何组织一个博客。"
pubDate: 2026-06-22
category: "study-notes"
tags: ["Astro", "前端", "Markdown"]
heroImage: "images/covers/study.svg"
---

Astro 做博客时，最值得先理解的是内容集合。它把一堆 Markdown 文件变成可以被类型系统约束的数据源。

## 内容集合解决什么

普通 Markdown 文件的问题是结构靠约定。今天漏写 `description`，明天把日期写成字符串，构建时不一定能及时发现。

内容集合用 schema 约束 frontmatter，让文章在进入页面模板之前就被检查。

## 动态路由如何配合

文章详情页通常写成 `src/pages/posts/[slug].astro`。在 `getStaticPaths` 里读取所有文章，然后返回每一篇文章的路径和 props。

这意味着新增文章不需要手动改路由。只要 Markdown 文件通过校验，构建时就会自动生成页面。

## 为什么适合个人博客

个人博客会慢慢长大。早期可以只有标题和日期，后期可能需要栏目、标签、封面、草稿状态和更新时间。内容集合允许这些字段逐步变清楚。

这也是我倾向于先把结构搭好，再慢慢填内容的原因。
