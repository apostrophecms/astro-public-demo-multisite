export default {
  options: {
    // Filter and pagination URLs become paths (`/articles/categories/news/page/2`)
    // rather than query strings, so every listing is a distinct, enumerable
    // URL. The Astro frontend uses the `_url` of a `data.filters` choice, or
    // builds the same paths with frontend/src/utils/filters.js, never query
    // strings.
    static: true
  }
};
