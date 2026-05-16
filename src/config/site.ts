export interface NavLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

/**
 * =============================================
 *  博客全局配置
 *  修改此文件即可定制站点外观和行为
 * =============================================
 */
export const SITE_CONFIG = {
  /* ── 基本信息 ── */
  name: '墨韵轩',
  description: '以笔墨记录所思所感',

  /* ── 浏览器标签标题 ── */
  tabTitle: '墨韵轩 — 以笔墨记录所思所感',

  /* ── Header/Logo ── */
  logo: {
    icon: '墨',        // logo 圆形中的字
    text: '墨韵轩',     // logo 文字
  },

  /* ── 顶部导航栏 ── */
  nav: [
    { label: '首页', href: '#/' },
    { label: '归档', href: '#/archive' },
    { label: '关于', href: '#/about' },
  ] as NavLink[],

  /* ── 主页 Hero 区域 ── */
  hero: {
    seal: '雅',
    title: '墨韵·山水',
    titleSub: '— 以笔墨记录所思所感',
    subtitle: '在墨色与留白之间，寻一方宁静。用文字与笔墨，记录生活与思考。',
    primaryBtn: '浏览文章',
    primaryAction: 'scroll',
    secondaryBtn: '关于我',
    showSearch: true,        // 是否在 Hero 下方显示搜索框
  },

  /* ── 精选文章控制 ──
   * by: 'tag'    → 通过标签控制精选（文章 frontmatter 中 tags 包含下面 tags 中任一即入精选）
   * by: 'manual' → 通过 frontmatter 的 featured: true 控制
   */
  featured: {
    by: 'manual' as 'tag' | 'manual',
    tags: ['精选'],
    title: '精选文章',
  },

  /* ── 首页各区块标题 ── */
  sections: {
    featured: '精选文章',
    recent: '最近文章',
  },

  /* ── 首页文章列表 ──
   * initialLoad: 首次加载显示的文章数
   * loadMore: 每次点击"展示更多"增加的数量
   */
  homepage: {
    initialLoad: 6,
    loadMore: 6,
  },

  /* ── 底部 Footer ── */
  footer: {
    description: '以笔墨记录所思所感。在墨色与留白之间，寻一方宁静。',
    sections: [
      {
        title: '链接',
        links: [
          { label: '首页', href: '#/' },
          { label: '归档', href: '#/archive' },
          { label: '关于', href: '#/about' },
        ],
      },
    ] as FooterSection[],
    copyright: '丙午年 · 墨韵轩 · 用心记录',
    seal: '墨',
  },

  /* ── 关于页面 ── */
  about: {
    seal: '墨',
    title: '墨韵轩',
    subtitle: '以笔墨记录所思所感',
    paragraphs: [
      '这是一个以**水墨风格**为设计语言的个人博客。在这里，技术与传统文化相遇，代码与笔墨交融。',
      '博客记录的内容包括技术文章、随笔小说等。所有内容以 Markdown 文件管理，通过自研渲染器呈现。',
    ],
    sections: [
      {
        title: '关于设计',
        content: '水墨风格的核心美学——留白、墨韵、意境——与现代前端工程化实践相融合。色彩体系取自传统水墨的五色（焦、浓、重、淡、清），字体选用毛笔书法体与宋体搭配。',
      },
      {
        title: '技术栈',
        list: [
          'React 19 + TypeScript',
          'Vite 构建工具',
          '纯 CSS 水墨主题（零 UI 库依赖）',
          '自研 Markdown 渲染引擎',
          '自研 Frontmatter 解析器',
          'Hash-based SPA 路由',
          '文章全文搜索',
        ],
      },
    ],
    sealSmall: '雅',
  },
};
