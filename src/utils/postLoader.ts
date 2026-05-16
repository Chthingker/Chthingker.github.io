import { parseFrontmatter } from './parseFrontmatter';
import type { Post, ChapterFile, Category, SubCategory, Tag } from '../types/post';

/* ── globs ── */
const articleModules: Record<string, string> = import.meta.glob(
  '/src/posts/articles/*.md',
  { eager: true, query: '?raw', import: 'default' }
);

const novelModules: Record<string, string> = import.meta.glob(
  '/src/posts/novels/**/*.md',
  { eager: true, query: '?raw', import: 'default' }
);

/* ── helpers ── */

/** Extract numeric ID from filename path, frontmatter `id` field, or hash the path */
function extractId(path: string, data: Record<string, unknown>): number {
  // 1. Try filename prefix like 001-, 010-, 100-
  const prefixMatch = path.match(/\/(\d+)-/);
  if (prefixMatch) return parseInt(prefixMatch[1], 10);
  // 2. Try frontmatter id field
  if (typeof data.id === 'number') return data.id;
  // 3. Fallback: hash the filename into a stable number
  const name = path.split('/').pop() ?? path;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 100000;
}

/** Extract novel ID from the directory name, or frontmatter, or fallback */
function extractNovelId(path: string, data: Record<string, unknown>): number {
  const dirMatch = path.match(/\/novels\/(\d+)-/);
  if (dirMatch) return parseInt(dirMatch[1], 10);
  if (typeof data.id === 'number') return data.id;
  const dir = path.split('/').slice(-2, -1)[0] ?? path;
  let hash = 0;
  for (let i = 0; i < dir.length; i++) {
    hash = ((hash << 5) - hash + dir.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 100000;
}

function isMeta(path: string): boolean {
  return path.endsWith('/meta.md');
}

/* ── load articles ── */
const articlePosts: Post[] = Object.entries(articleModules)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    return {
      id: extractId(path, data),
      title: (data.title as string) || '无标题',
      excerpt: (data.excerpt as string) || '',
      date: (data.date as string) || '',
      category: (data.category as string) || '未分类',
      tags: (data.tags as string[]) || [],
      readingTime: (data.readingTime as number) || 0,
      featured: (data.featured as boolean) || false,
      type: ((data.type as string) || 'prose') as 'prose' | 'tech',
      subCategory: (data.subCategory as string) || undefined,
      coverImage: (data.coverImage as string) || undefined,
      content: content.trim() || undefined,
    } satisfies Post;
  })
  .sort((a, b) => a.id - b.id);

/* ── load novels ── */
const novelMetaPaths = Object.keys(novelModules).filter(isMeta);
const novelChapterPaths = Object.keys(novelModules).filter((p) => !isMeta(p));

const novelPosts: Post[] = novelMetaPaths.map((metaPath) => {
  const raw = novelModules[metaPath];
  const { data } = parseFrontmatter(raw);
  const id = extractNovelId(metaPath, data);
  const novelDirPrefix = metaPath.replace('/meta.md', '');

  const chapters: ChapterFile[] = novelChapterPaths
    .filter((cp) => cp.startsWith(novelDirPrefix))
    .map((cp) => {
      const { data: cd, content: cc } = parseFrontmatter(novelModules[cp]);
      return {
        title: (cd.title as string) || '',
        order: parseInt(cp.match(/\/(\d+)-/)?.[1] ?? '0', 10),
        content: cc.trim() || '',
      } satisfies ChapterFile;
    })
    .sort((a, b) => a.order - b.order);

  return {
    id,
    title: (data.title as string) || '',
    excerpt: (data.excerpt as string) || '',
    date: (data.date as string) || '',
    category: (data.category as string) || '',
    tags: (data.tags as string[]) || [],
    readingTime: (data.readingTime as number) || 0,
    featured: (data.featured as boolean) || false,
    type: 'novel' as const,
    coverImage: (data.coverImage as string) || undefined,
    chapters,
    content: undefined,
  } satisfies Post;
});

/* ── merge ── */
export const posts: Post[] = [...articlePosts, ...novelPosts].sort(
  (a, b) => a.id - b.id
);

export const categories: Category[] = deriveCategories(posts);
export const tags: Tag[] = deriveTags(posts);

// ── helpers ──

function deriveCategories(allPosts: Post[]): Category[] {
  const map = new Map<string, { count: number; subCategories?: Map<string, number> }>();

  for (const p of allPosts) {
    const entry = map.get(p.category) ?? { count: 0, subCategories: new Map() };
    entry.count++;
    if (p.subCategory) {
      const prev = entry.subCategories!.get(p.subCategory) ?? 0;
      entry.subCategories!.set(p.subCategory, prev + 1);
    }
    map.set(p.category, entry);
  }

  return Array.from(map.entries()).map(([name, info]) => {
    const cat: Category = { name, count: info.count };
    if (info.subCategories && info.subCategories.size > 0) {
      cat.subCategories = Array.from(info.subCategories.entries()).map(
        ([n, c]) => ({ name: n, count: c } satisfies SubCategory)
      );
    }
    return cat;
  });
}

function deriveTags(allPosts: Post[]): Tag[] {
  const map = new Map<string, number>();
  for (const p of allPosts) {
    for (const t of p.tags) {
      map.set(t, (map.get(t) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count } satisfies Tag))
    .sort((a, b) => b.count - a.count);
}
