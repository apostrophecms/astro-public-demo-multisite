export default {
  methods(self) {
    return {
      // Shim for @apostrophecms/seo compatibility with this version of apostrophe
      getPageFilter(pageNum) {
        return pageNum > 1 ? `?page=${pageNum}` : '';
      }
    };
  }
};
