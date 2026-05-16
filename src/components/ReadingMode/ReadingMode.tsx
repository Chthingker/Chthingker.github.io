import { useEffect, useState, useCallback, useMemo } from 'react';
import type { Post } from '../../types/post';
import MarkdownRenderer from '../MarkdownRenderer/MarkdownRenderer';
import './ReadingMode.css';

interface ReadingModeProps {
  post: Post;
  initialChapter?: number;
  onExit: () => void;
}

export default function ReadingMode({ post, initialChapter = 0, onExit }: ReadingModeProps) {
  // Build chapters: for novels use post.chapters, for content-based use the full content as one chapter
  const chapters = useMemo(() => {
    if (post.chapters && post.chapters.length > 0) return post.chapters;
    if (post.content) return [{ title: post.title, order: 1, content: post.content }];
    return [];
  }, [post]);

  const [current, setCurrent] = useState(() => Math.min(initialChapter, Math.max(0, chapters.length - 1)));
  const total = chapters.length;

  const goPrev = useCallback(() => {
    setCurrent((c) => Math.max(0, c - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrent((c) => Math.min(total - 1, c + 1));
  }, [total]);

  const resetChapter = useCallback(() => {
    setCurrent(Math.min(initialChapter, Math.max(0, chapters.length - 1)));
  }, [initialChapter, chapters.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onExit, goPrev, goNext]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    resetChapter();
  }, [resetChapter]);

  const chapter = chapters[current];

  if (!chapter || total === 0) {
    return (
      <div className="reading-mode">
        <div className="reading-mode__empty">暂无内容</div>
      </div>
    );
  }

  return (
    <div className="reading-mode">
      <header className="reading-mode__topbar">
        <button className="reading-mode__exit" onClick={onExit}>退出</button>
        <div className="reading-mode__title-area">
          <span className="reading-mode__book-title">{post.title}</span>
          {total > 1 && (
            <>
              <span className="reading-mode__chapter-sep">·</span>
              <span className="reading-mode__chapter-name">{chapter.title}</span>
            </>
          )}
        </div>
        {total > 1 && (
          <select
            className="reading-mode__select"
            value={current}
            onChange={(e) => setCurrent(Number(e.target.value))}
            aria-label="章节选择"
          >
            {chapters.map((ch, i) => (
              <option key={`ch-${i}`} value={i}>{ch.title}</option>
            ))}
          </select>
        )}
        {total <= 1 && <div style={{ width: 80 }} />}
      </header>

      <main className="reading-mode__body">
        <div className="reading-mode__content">
          <MarkdownRenderer content={chapter.content} />
        </div>
      </main>

      {total > 1 && (
        <footer className="reading-mode__bottombar">
          <button className="reading-mode__nav-btn" disabled={current === 0} onClick={goPrev}>
            ← 上一章
          </button>
          <span className="reading-mode__progress">{current + 1} / {total}</span>
          <button className="reading-mode__nav-btn" disabled={current === total - 1} onClick={goNext}>
            下一章 →
          </button>
        </footer>
      )}
    </div>
  );
}
