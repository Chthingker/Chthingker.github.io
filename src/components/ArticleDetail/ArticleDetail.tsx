import { useCallback, useEffect, useState } from 'react';
import type { Post } from '../../types/post';
import { incrementView, getViewCount } from '../../utils/views';
import MarkdownRenderer from '../MarkdownRenderer/MarkdownRenderer';
import TableOfContents from '../TableOfContents/TableOfContents';
import type { TocItem } from '../TableOfContents/TableOfContents';
import './ArticleDetail.css';

interface ArticleDetailProps {
  post: Post;
  onBack: () => void;
  onEnterReadingMode?: (chapterIndex?: number) => void;
}

const CHAPTERS_PER_PAGE = 10;

/** Build a .md string from a post (frontmatter + content/chapters) and trigger download */
function exportPost(post: Post) {
  const lines: string[] = [];
  lines.push('---');
  lines.push(`title: ${post.title}`);
  lines.push(`excerpt: ${post.excerpt}`);
  lines.push(`date: ${post.date}`);
  lines.push(`category: ${post.category}`);
  lines.push(`tags: [${post.tags.join(', ')}]`);
  lines.push(`readingTime: ${post.readingTime}`);
  if (post.type) lines.push(`type: ${post.type}`);
  if (post.subCategory) lines.push(`subCategory: ${post.subCategory}`);
  if (post.featured) lines.push('featured: true');
  lines.push('---');
  lines.push('');

  if (post.content) {
    lines.push(post.content);
  } else if (post.chapters) {
    for (const ch of post.chapters) {
      lines.push(`## ${ch.title}`);
      lines.push('');
      lines.push(ch.content);
      lines.push('');
    }
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${post.title.replace(/[^a-zA-Z0-9一-龥]/g, '_')}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ArticleDetail({ post, onBack, onEnterReadingMode }: ArticleDetailProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [chapterPage, setChapterPage] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const isTech = post.type === 'tech';
  const isNovel = post.type === 'novel';

  useEffect(() => {
    incrementView(post.id);
    setViewCount(getViewCount(post.id));
  }, [post.id]);

  const handleHeadings = useCallback((items: TocItem[]) => {
    setHeadings(items);
  }, []);

  // Chapter pagination
  const chapters = post.chapters ?? [];
  const paginatedChapters = chapters.slice(0, (chapterPage + 1) * CHAPTERS_PER_PAGE);
  const hasMore = paginatedChapters.length < chapters.length;

  return (
    <article className="article-detail">
      <div className="article-detail__inner">
        {/* Back button */}
        <button className="article-detail__back" onClick={onBack}>
          <span className="article-detail__back-arrow">←</span>
          返回首页
        </button>

        {/* Header */}
        <header className="article-detail__header">
          {isTech && <span className="article-detail__type-badge">技术</span>}
          {isNovel && <span className="article-detail__type-badge article-detail__type-badge--novel">小说</span>}
          <div className="article-detail__ink-bar" />
          <h1 className="article-detail__title">{post.title}</h1>
          <div className="article-detail__meta">
            <span className="article-detail__category">{post.category}</span>
            {post.subCategory && (
              <>
                <span className="article-detail__subcategory">{post.subCategory}</span>
                <span className="article-detail__divider">/</span>
              </>
            )}
            <span>{post.date}</span>
            <span className="article-detail__divider">/</span>
            <span>{post.readingTime} 分钟阅读</span>
            <span className="article-detail__divider">/</span>
            <span className="article-detail__views">阅读 {viewCount}</span>
          </div>
          <p className="article-detail__excerpt">{post.excerpt}</p>
          {!isTech && onEnterReadingMode && (
            <button className="article-detail__reading-btn" onClick={() => onEnterReadingMode(0)}>
              {isNovel ? '开始阅读' : '进入阅读模式'}
            </button>
          )}
        </header>

        {/* Body */}
        <div className="article-detail__body">
          <div className="article-detail__content">
            {isNovel && chapters.length > 0 ? (
              <div className="article-detail__chapters">
                <h3 className="article-detail__chapters-title">
                  章节目录
                  <span className="article-detail__chapters-count">{chapters.length} 章</span>
                </h3>
                <ul className="article-detail__chapters-list">
                  {paginatedChapters.map((ch, i) => (
                    <li key={ch.title} className="article-detail__chapter-item">
                      <button
                        className="article-detail__chapter-link"
                        onClick={() => onEnterReadingMode?.(i)}
                      >
                        <span className="article-detail__chapter-num">{i + 1}</span>
                        <span className="article-detail__chapter-name">{ch.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                {hasMore && (
                  <button
                    className="article-detail__chapters-more"
                    onClick={() => setChapterPage((p) => p + 1)}
                  >
                    展开更多章节（已显示 {paginatedChapters.length} / {chapters.length}）
                  </button>
                )}
              </div>
            ) : post.content ? (
              <MarkdownRenderer content={post.content} onHeadings={handleHeadings} />
            ) : (
              <p className="article-detail__empty">暂无正文内容。</p>
            )}
          </div>

          {isTech && headings.length > 0 && (
            <aside className="article-detail__toc">
              <TableOfContents items={headings} />
            </aside>
          )}
        </div>

        {/* Footer */}
        <div className="article-detail__footer">
          <div className="article-detail__tags">
            {post.tags.map((tag) => (
              <a key={tag} className="article-detail__tag" href={`#/filter/tag/${encodeURIComponent(tag)}`}>
                {tag}
              </a>
            ))}
          </div>
          <div className="article-detail__footer-actions">
            <button className="article-detail__export-btn" onClick={() => exportPost(post)}>
              导出 .md
            </button>
            <button className="article-detail__back-bottom" onClick={onBack}>
              ← 返回首页
            </button>
          </div>
        </div>

        <div className="article-detail__seal">
          <span className="article-detail__seal-char">完</span>
        </div>
      </div>
    </article>
  );
}
