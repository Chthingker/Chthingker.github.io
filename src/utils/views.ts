const STORAGE_KEY = 'ink_blog_views';

/** Get view counts from localStorage. Returns a map of postId → count. */
function getViews(): Record<number, number> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

/** Increment view count for a post. Call this when opening a post. */
export function incrementView(postId: number): void {
  const views = getViews();
  views[postId] = (views[postId] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
}

/** Get the view count for a single post. */
export function getViewCount(postId: number): number {
  return getViews()[postId] || 0;
}

/** Get all view counts. */
export function getAllViews(): Record<number, number> {
  return getViews();
}
