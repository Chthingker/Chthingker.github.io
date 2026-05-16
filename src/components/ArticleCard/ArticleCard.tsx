import type { Post } from '../../types/post';
import { getViewCount } from '../../utils/views';
import './ArticleCard.css';

interface ArticleCardProps {
  post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  const isTech = post.type === 'tech';
  const isNovel = post.type === 'novel';
  const views = getViewCount(post.id);

  return (
    <article className="article-card" onClick={() => { window.location.hash = `#/post/${post.id}`; }}>
      <div className={`article-card__ink-bar ${isTech ? 'article-card__ink-bar--tech' : ''} ${isNovel ? 'article-card__ink-bar--novel' : ''}`} />
      <div className="article-card__body">
        <div className="article-card__meta">
          <span className="article-card__category">{post.category}</span>
          {isTech && <span className="article-card__type-badge">技</span>}
          {isNovel && <span className="article-card__type-badge article-card__type-badge--novel">小说</span>}
          <span className="article-card__date">{post.date}</span>
        </div>
        <h3 className="article-card__title">
          {post.title}
        </h3>
        <p className="article-card__excerpt">{post.excerpt}</p>
        <div className="article-card__footer">
          <div className="article-card__tags">
            {post.tags.map((tag) => (
              <a
                key={tag}
                className="article-card__tag"
                href={`#/filter/tag/${encodeURIComponent(tag)}`}
                onClick={(e) => e.stopPropagation()}
              >
                {tag}
              </a>
            ))}
          </div>
          <div className="article-card__footer-right">
            <span className="article-card__views">{views} 次阅读</span>
            <span className="article-card__reading-time">
              阅读约 {post.readingTime} 分钟
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
