import { useState, useMemo } from 'react';
import type { Post } from '../../types/post';
import './SearchBox.css';

interface SearchBoxProps {
  posts: Post[];
}

export default function SearchBox({ posts }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return posts.filter((p) => {
      const searchTarget = `${p.title} ${p.excerpt} ${p.tags.join(' ')} ${p.category}`.toLowerCase();
      // Split query into terms, match all
      const terms = q.split(/\s+/).filter(Boolean);
      return terms.every((t) => searchTarget.includes(t));
    }).slice(0, 8); // top 8
  }, [query, posts]);

  return (
    <div className={`search-box ${focused ? 'search-box--focused' : ''}`}>
      <div className="search-box__input-wrap">
        <span className="search-box__icon">搜</span>
        <input
          className="search-box__input"
          type="text"
          placeholder="搜索文章标题、标签、分类..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
        />
        {query && (
          <button className="search-box__clear" onClick={() => setQuery('')}>
            ×
          </button>
        )}
      </div>

      {focused && query.trim() && (
        <div className="search-box__dropdown">
          {results.length > 0 ? (
            <ul className="search-box__results">
              {results.map((p) => (
                <li key={p.id}>
                  <a
                    className="search-box__result"
                    href={`#/post/${p.id}`}
                    onClick={() => setQuery('')}
                  >
                    <span className="search-box__result-type">
                      {p.type === 'tech' ? '技' : p.type === 'novel' ? '说' : '文'}
                    </span>
                    <span className="search-box__result-title">{p.title}</span>
                    <span className="search-box__result-cat">{p.category}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-box__empty">未找到相关文章</div>
          )}
        </div>
      )}
    </div>
  );
}
