export default {
  root: import.meta,
  privateDashboards: true,
  modules: {
    '@apostrophecms/express': {},
    '@apostrophecms/uploadfs': {},
    '@apostrophecms-pro/multisite-dashboard': {},
    site: {},
    'site-page': {},
    '@apostrophecms/vite': {}
  }
};
