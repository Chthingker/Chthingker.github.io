import { useState } from 'react';
import type { Post } from '../../types/post';
import { getViewCount } from '../../utils/views';
import BrushTitle from '../BrushTitle/BrushTitle';
import './Archive.css';

interface ArchiveProps {
  posts: Post[];
  onBack: () => void;
}

const PER_PAGE = 20;

export default function Archive({ posts, onBack }: ArchiveProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(posts.length / PER_PAGE);

  // Sort by id desc (newest first)
  const sorted = [...posts].sort((a, b) => b.id - a.id);
  const paged = sorted.slice(0, (page + 1) * PER_PAGE);
  const hasMore = paged.length < sorted.length;

  const total = posts.length;
  const techCount = posts.filter((p) => p.type === 'tech').length;
  const proseCount = posts.filter((p) => p.type === 'prose').length;
  const novelCount = posts.filter((p) => p.type === 'novel').length;

  return (
    <div className="archive">
      <div className="archive__inner">
        <button className="archive__back" onClick={onBack}>← 返回首页</button>
        <BrushTitle as="h1">全部文章</BrushTitle>

        <div className="archive__stats">
          <span className="archive__stat">共 {total} 篇</span>
          <span className="archive__stat-dot">·</span>
          <span className="archive__stat archive__stat--tech">技术 {techCount}</span>
          <span className="archive__stat-dot">·</span>
          <span className="archive__stat archive__stat--prose">散文 {proseCount}</span>
          {novelCount > 0 && (
            <>
              <span className="archive__stat-dot">·</span>
              <span className="archive__stat archive__stat--novel">小说 {novelCount} 部</span>
            </>
          )}
        </div>

        <ul className="archive__list">
          {paged.map((p) => (
            <li key={p.id} className="archive__item">
              <a href={`#/post/${p.id}`} className="archive__link">
                <span className="archive__item-type">
                  {p.type === 'tech' ? '技' : p.type === 'novel' ? '说' : '文'}
                </span>
                <span className="archive__item-cat">{p.category}</span>
                <span className="archive__item-title">{p.title}</span>
                <span className="archive__item-date">{p.date}</span>
                <span className="archive__item-views">{getViewCount(p.id)}</span>
                <span className="archive__item-time">{p.readingTime} 分钟</span>
              </a>
            </li>
          ))}
        </ul>

        {hasMore && (
          <div className="archive__more-wrap">
            <button
              className="archive__more-btn"
              onClick={() => setPage((p) => p + 1)}
            >
              加载更多（{paged.length} / {sorted.length}）
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="archive__pages">
            {Array.from({ length: Math.min(totalPages, Math.max(totalPages, page + 3)) }, (_, i) => (
              <button
                key={i}
                className={`archive__page-btn ${i === page ? 'archive__page-btn--active' : ''}`}
                onClick={() => { setPage(i); window.scrollTo(0, 0); }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
