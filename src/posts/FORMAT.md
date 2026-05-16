# 📝 文章格式参考

文章放在 `src/posts/articles/` 或 `src/posts/novels/` 下，使用 Markdown + frontmatter 格式。

---

## 一、普通文章（tech / prose）

**文件路径：** `src/posts/articles/xxx.md`

```markdown
---
title: 文章标题               # 必填
excerpt: 文章摘要，显示在卡片上  # 必填
date: 丙午年 四月初一          # 必填，显示用的日期文字
category: 技术札记            # 必填，分类名称
tags: [React, 组件设计]       # 必填，标签列表
readingTime: 5               # 必填，预估阅读分钟数
type: tech                   # 必填：tech=技术文章, prose=散文
featured: true               # 可选，manual模式下是否进精选区
subCategory: React           # 可选，仅tech文章有，子分类
id: 10                       # 可选，手动指定ID（不填则自动生成）
---

正文使用 Markdown 语法...

## 二级标题

正文内容...

### 三级标题

- 列表项
- 列表项

> 引用文字

`行内代码`

```css
/* 代码块 */
.code { color: red; }
```

[!NOTE]
提示标注（支持 NOTE / WARNING / TIP）

| 表头1 | 表头2 |
|-------|-------|
| 单元格 | 单元格 |
```

**type 字段说明：**

| type 值 | 表现 |
|---------|------|
| `tech` | 显示"技术"徽标、右侧目录、代码块/表格/Callout 等渲染 |
| `prose` | 纯文字排版，显示"阅读模式"按钮 |

---

## 二、小说

**每章一个独立文件**，放在：

```
src/posts/novels/小说名/
├── meta.md          ← 小说信息
├── 001-章名.md      ← 第一章
├── 002-章名.md      ← 第二章
└── ...
```

### meta.md

```markdown
---
title: 雨夜随笔               # 必填，小说名
excerpt: 夜深人静，听雨打芭蕉   # 必填，摘要
date: 丙午年 三月十八          # 必填
category: 笔墨随笔            # 必填
tags: [随笔, 雨, 夜]          # 必填
readingTime: 6               # 必填
featured: true               # 可选
type: novel                  # 必填，固定为 novel
---
```

### 章节文件

```markdown
---
title: 夜深                   # 必填，章节名
order: 1                     # 可选，文件名前的数字优先级更高
---

章节正文内容...

支持所有 Markdown 语法。
```

---

## 三、文件名规则

**无任何限制。** 但推荐带数字前缀以控制排序：

| 文件名 | 效果 |
|--------|------|
| `hello.md` | ID 自动生成，按文件名 hash 排序 |
| `010-hello.md` | ID=10，按数字排序 |
| `react-guide.md` | 和 novels 不冲突 |

ID 优先级：`文件名前缀数字 > frontmatter.id > 文件名 hash`

---

## 四、精选文章控制

见 `src/config/site.ts` 中的 `featured` 配置：

- `featured.by: 'manual'` → 文章 frontmatter 中写 `featured: true`
- `featured.by: 'tag'` → 文章 tags 包含指定的精选标签
