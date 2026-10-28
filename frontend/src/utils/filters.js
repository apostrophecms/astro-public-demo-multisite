// Filter and pagination URLs for piece index pages.
//
// The backend sets `static: true` on @apostrophecms/url, so these are paths
// (`/articles/categories/news/page/2`), not query strings. These mirror
// `apos.url.getChoiceFilter()` and `apos.url.getPageFilter()` exactly:
// append the result to a page's `_url`, or a piece's `_parentUrl`. Use
// `_parentUrl`, never `_parentSlug`, which lacks the `/fr` or `/de` locale
// prefix. A static URL expresses one filter at a time.

/**
 * @param {string} name - The filter name, e.g. `categories`
 * @param {string|null} value - The choice value, e.g. a category slug
 * @param {number} page - The page number, starting at 1
 * @returns {string}
 */
export function getChoiceFilter(name, value, page) {
  if (value === null) {
    return '';
  }
  name = encodeURIComponent(name);
  value = encodeURIComponent(value);
  return `/${name}/${value}${page > 1 ? `/page/${page}` : ''}`;
}

/**
 * @param {number} page - The page number, starting at 1
 * @returns {string}
 */
export function getPageFilter(page) {
  if (page <= 1) {
    return '';
  }
  return `/page/${page}`;
}
