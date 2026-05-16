import { useState, useEffect, useCallback } from 'react';
import { posts, categories, tags } from './utils/postLoader';
import { SITE_CONFIG } from './config/site';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import BrushTitle from './components/BrushTitle/BrushTitle';
import ArticleCard from './components/ArticleCard/ArticleCard';
import Sidebar from './components/Sidebar/Sidebar';
import ArticleDetail from './components/ArticleDetail/ArticleDetail';
import Archive from './components/Archive/Archive';
import About from './components/About/About';
import SearchBox from './components/SearchBox/SearchBox';
import ReadingMode from './components/ReadingMode/ReadingMode';
import Footer from './components/Footer/Footer';
import './App.css';

type Route =
  | { page: 'home'; filter?: { type: 'category'; value: string } | { type: 'tag'; value: string } }
  | { page: 'post'; postId: number }
  | { page: 'archive' }
  | { page: 'about' };

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const parts = hash.split('/').filter(Boolean);

  if (parts[0] === 'post' && parts[1]) {
    const id = parseInt(parts[1], 10);
    if (posts.some((p) => p.id === id)) return { page: 'post', postId: id };
  }

  if (parts[0] === 'filter' && parts[1] === 'category' && parts[2]) {
    return { page: 'home', filter: { type: 'category', value: decodeURIComponent(parts[2]) } };
  }

  if (parts[0] === 'filter' && parts[1] === 'tag' && parts[2]) {
    return { page: 'home', filter: { type: 'tag', value: decodeURIComponent(parts[2]) } };
  }

  if (parts[0] === 'about') return { page: 'about' };
  if (parts[0] === 'archive') return { page: 'archive' };

  return { page: 'home' };
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash);
  const [readingMode, setReadingMode] = useState(false);
  const [readingChapter, setReadingChapter] = useState(0);
  const [visibleCount, setVisibleCount] = useState(() => SITE_CONFIG.homepage.initialLoad);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setVisibleCount(SITE_CONFIG.homepage.initialLoad);
  }, [route]);

  const handleBack = useCallback(() => {
    window.location.hash = '#/';
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((c) => c + SITE_CONFIG.homepage.loadMore);
  }, []);

  const hasMorePosts = visibleCount < posts.length;
  const visiblePosts = posts.slice(0, visibleCount);

  const handleEnterReadingMode = useCallback((chapterIndex = 0) => {
    setReadingChapter(chapterIndex);
    setReadingMode(true);
  }, []);

  const currentPost = route.page === 'post'
    ? posts.find((p) => p.id === route.postId) ?? null
    : null;

  const featuredPosts = posts.filter((p) => {
    if (SITE_CONFIG.featured.by === 'tag') {
      return SITE_CONFIG.featured.tags.some((t) => p.tags.includes(t));
    }
    return p.featured;
  });

  let displayPosts = posts;
  if (route.page === 'home' && route.filter) {
    const f = route.filter;
    displayPosts = posts.filter((p) => {
      if (f.type === 'category') return p.category === f.value;
      if (f.type === 'tag') return p.tags.includes(f.value);
      return true;
    });
  }

  const filterLabel = route.page === 'home' && route.filter
    ? route.filter.type === 'category' ? `分类：${route.filter.value}` : `标签：${route.filter.value}`
    : null;

  return (
    <>
      <div className="app">
        <Header currentPage={route.page} />
        <main>
          {route.page === 'about' ? (
            <About onBack={handleBack} />
          ) : route.page === 'archive' ? (
            <Archive posts={posts} onBack={handleBack} />
          ) : currentPost ? (
            <ArticleDetail
              post={currentPost}
              onBack={handleBack}
              onEnterReadingMode={(ch) => handleEnterReadingMode(ch)}
            />
          ) : (
            <>
              {route.page === 'home' && !route.filter && (
                <>
                  <Hero />
                  <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--spacing-xl)' }}>
                    <SearchBox posts={posts} />
                  </div>
                </>
              )}

              {route.page === 'home' && route.filter ? (
                <section className="section section--featured" style={{ marginTop: '120px' }}>
                  <div className="filter-bar">
                    <button className="filter-bar__back" onClick={() => { window.location.hash = '#/'; }}>
                      ← 全部文章
                    </button>
                    <BrushTitle as="h2">{filterLabel ?? ''}</BrushTitle>
                  </div>
                  <div className="post-list">
                    {displayPosts.length > 0 ? displayPosts.map((post) => (
                      <ArticleCard key={post.id} post={post} />
                    )) : (
                      <p className="filter-bar__empty">该分类下暂无文章</p>
                    )}
                  </div>
                </section>
              ) : (
                <>
                  <section className="section section--featured">
                    <BrushTitle as="h2">{SITE_CONFIG.sections.featured}</BrushTitle>
                    <div className="featured-grid">
                      {featuredPosts.map((post) => (
                        <ArticleCard key={post.id} post={post} />
                      ))}
                    </div>
                  </section>

                  <hr className="ink-divider" />

                  <section className="section section--main">
                    <div className="main-layout">
                      <div className="main-layout__content">
                        <BrushTitle as="h2">{SITE_CONFIG.sections.recent}</BrushTitle>
                        <div className="post-list">
                          {visiblePosts.map((post) => (
                            <ArticleCard key={post.id} post={post} />
                          ))}
                        </div>
                        {hasMorePosts && (
                          <div className="load-more-wrap">
                            <button className="load-more-btn" onClick={handleLoadMore}>
                              展示更多（{visibleCount} / {posts.length}）
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="main-layout__sidebar">
                        <Sidebar categories={categories} tags={tags} />
                      </div>
                    </div>
                  </section>
                </>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>

      {readingMode && currentPost && (
        <ReadingMode
          post={currentPost}
          initialChapter={readingChapter}
          onExit={() => setReadingMode(false)}
        />
      )}
    </>
  );
}
