import { useState } from 'react';
import './Sidebar.css';
import type { Category, Tag } from '../../types/post';
import TagCloud from '../TagCloud/TagCloud';

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
}

export default function Sidebar({ categories, tags }: SidebarProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (name: string) => {
    setExpanded((prev) => (prev === name ? null : name));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__section">
        <h3 className="sidebar__title">分类</h3>
        <ul className="sidebar__category-list">
          {categories.map((cat) => {
            const hasSub = cat.subCategories && cat.subCategories.length > 0;
            const isOpen = expanded === cat.name;

            return (
              <li key={cat.name} className="sidebar__category-wrapper">
                <div
                  className={`sidebar__category-item ${hasSub ? 'sidebar__category-item--expandable' : ''}`}
                  onClick={hasSub ? () => toggleExpand(cat.name) : undefined}
                  role={hasSub ? 'button' : undefined}
                  tabIndex={hasSub ? 0 : undefined}
                  onKeyDown={
                    hasSub
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleExpand(cat.name);
                          }
                        }
                      : undefined
                  }
                >
                  <span className="sidebar__category-label">
                    {hasSub && (
                      <span className={`sidebar__expand-icon ${isOpen ? 'sidebar__expand-icon--open' : ''}`}>
                        ▶
                      </span>
                    )}
                    <a
                      href={`#/filter/category/${encodeURIComponent(cat.name)}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cat.name}
                    </a>
                  </span>
                  <span className="sidebar__category-count">{cat.count}</span>
                </div>

                {hasSub && isOpen && (
                  <ul className="sidebar__subcategory-list">
                    {cat.subCategories!.map((sub) => (
                      <li key={sub.name} className="sidebar__subcategory-item">
                        <a href={`#/filter/category/${encodeURIComponent(cat.name)}`}>
                          {sub.name}
                        </a>
                        <span className="sidebar__subcategory-count">{sub.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="sidebar__section">
        <h3 className="sidebar__title">标签</h3>
        <TagCloud tags={tags} />
      </div>
    </aside>
  );
}
