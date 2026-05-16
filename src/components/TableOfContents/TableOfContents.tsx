import { useEffect, useState, useRef } from 'react';
import './TableOfContents.css';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const ids = items.map((i) => i.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    els.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="toc">
      <h3 className="toc__title">目 录</h3>
      <ul className="toc__list">
        {items.map((item) => (
          <li
            key={item.id}
            className={`toc__item toc__item--h${item.level} ${
              activeId === item.id ? 'toc__item--active' : ''
            }`}
          >
            <a href={`#${item.id}`} className="toc__link">
              <span className="toc__dot" />
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
