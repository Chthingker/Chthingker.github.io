# 墨韵轩 — 水墨风个人博客

一个以中国传统水墨风格为设计语言的个人博客。支持技术文章、散文随笔、小说连载三种内容类型。

## 技术栈

- **框架**：React 19 + TypeScript
- **构建**：Vite 8
- **样式**：纯 CSS（自定义水墨主题变量，零 UI 库依赖）
- **内容**：Markdown 文件（frontmatter + 正文）
- **路由**：Hash-based SPA
- **渲染**：自研 Markdown 渲染引擎

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 构建生产版本（输出到 docs/）
npm run build
```

> 修改或新增 `.md` 文件后需要重启 `npm run dev` 才能生效。

## 目录结构

```
ink-blog/
├── src/
│   ├── config/
│   │   └── site.ts              ← 全局配置（导航、标题、精选控制等）
│   ├── posts/
│   │   ├── articles/             ← 普通文章（tech / prose）
│   │   ├── novels/               ← 小说（每部一个文件夹）
│   │   │   └── 小说名/
│   │   │       ├── meta.md       ← 小说信息
│   │   │       ├── 001-章名.md
│   │   │       ├── 002-章名.md
│   │   │       └── ...
│   │   └── FORMAT.md             ← 文章格式参考
│   ├── components/               ← React 组件
│   ├── utils/                    ← 工具函数
│   └── types/post.ts             ← TypeScript 类型
├── docs/                         ← 构建输出（用于 Gitee Pages 部署）
├── vite.config.ts
└── package.json
```

## 如何新增文章

### 普通文章

在 `src/posts/articles/` 下创建 `.md` 文件：

```markdown
---
title: 文章标题
excerpt: 摘要，显示在卡片上
date: 丙午年 四月十五
category: 技术札记
tags: [React, 组件设计]
readingTime: 5
type: tech              # tech=技术 / prose=散文
featured: true          # 可选，是否在精选区展示
subCategory: React      # 可选，仅 tech 类型
---

正文内容...支持完整 Markdown 语法。
```

### 小说

在 `src/posts/novels/` 下创建文件夹：

```
novels/小说名/
├── meta.md
├── 001-第一章.md
├── 002-第二章.md
└── ...
```

**meta.md：**

```markdown
---
title: 小说标题
excerpt: 摘要
date: 丙午年 四月初十
category: 笔墨随笔
tags: [随笔, 小说]
readingTime: 30
type: novel
---
```

**章节文件：**

```markdown
---
title: 章节标题
---

正文内容...
```

### 文件名规则

- **无限制**，任何文件名都可以
- 推荐数字前缀控制排序：`001-xxx.md`、`002-xxx.md`
- 也可以在前置元数据中写 `id: 10` 来手动指定 ID

## 如何修改配置

所有站点配置集中在 `src/config/site.ts`，包括：

| 配置项 | 说明 |
|--------|------|
| `name` / `tabTitle` | 站点名称 / 浏览器标题 |
| `logo` | 图标字 / Logo 文字 |
| `nav` | 顶部导航栏链接 |
| `hero` | 首页大屏文字、按钮 |
| `featured` | 精选控制方式（manual / tag） |
| `homepage.initialLoad` | 首页首次加载文章数 |
| `homepage.loadMore` | 每次展开增加文章数 |
| `footer` | 底部信息 |
| `about` | 关于页面内容 |

## 如何部署到 Gitee Pages

### 首次部署

在 Gitee 创建一个空仓库（如 `my-blog`），然后：

```bash
# 1. 在项目目录中初始化 git
cd ink-blog
git init
git add .
git commit -m "初始化"

# 2. 关联你的 Gitee 仓库
git remote add origin https://gitee.com/你的用户名/my-blog.git
git push -u origin main

# 3. 构建生产版本
npm run build

# 4. 提交构建产物 docs/
git add docs/
git commit -m "构建"
git push
```

**Gitee Pages 设置：**
1. 打开仓库 → 服务 → Gitee Pages
2. 部署分支：`main`
3. 部署目录：`docs/`
4. 点击"启动"
5. 部署完成后访问 `https://你的用户名.gitee.io/my-blog/`

> 首次使用 Gitee Pages 需要实名认证。

### 更新内容后

```bash
# 1. 构建最新版本
npm run build

# 2. 提交所有更改（新的 .md + 重新构建的 docs/）
git add .
git commit -m "更新文章"
git push

# 3. 如果 Gitee Pages 没有自动更新，手动去仓库 → 服务 → Gitee Pages 点"更新"
```

## 功能清单

- 首页（精选区 + 文章列表 + 展示更多）
- 归档页（按分类分组 + 分页）
- 文章详情（技术文章带目录，散文/小说带阅读模式）
- 小说分章节阅读
- 沉浸阅读模式（键盘 ← → 切换章节，Esc 退出）
- 全文搜索
- 分类/标签筛选
- 文章阅读量统计（localStorage）
- 文章导出 .md
- 关于页
- 全部配置化
