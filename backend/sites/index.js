/**
 * Shared Sites configuration
 *
 * Enabling and configuring a module here will allow the
 * module to be used as configured on all sites.
 *
 * Apostrophe configuration for your hosted sites.
 * Just one config for all of them; per-site config could be
 * user editable settings in @apostrophecms/global.
 */

export default async function (site) {
  const config = {
    root: import.meta,
    // Theme name is globally available as apos.options.theme
    theme: site.theme,
    nestedModuleSubdirs: true,
    modules: {
      // Apostrophe module configuration

      // Note: most configuration occurs in the respective
      // modules' directories. See lib/@apostrophecms/assets/index.js for an example.

      // However any modules that are not present by default in Apostrophe must at
      // least have a minimal configuration here to turn them on: `moduleName: {}`
      '@apostrophecms/vite': {},

      // Manages apostrophe's overall asset pipeline
      '@apostrophecms/asset': {},

      // Manage page and piece SEO metadata
      '@apostrophecms/seo': {},

      // Manage site's favicon via the Global Settings menu
      '@apostrophecms/favicon': {},

      // Manage page and piece open graph data
      '@apostrophecms/open-graph': {},

      // Widgets
      '@apostrophecms/rich-text-widget': {},
      '@apostrophecms/image-widget': {},
      '@apostrophecms/video-widget': {},
      'button-widget': {},
      'github-prs-widget': {},
      'hero-widget': {},
      'card-widget': {},
      'card-title-rt-widget': {
        extend: '@apostrophecms/rich-text-widget',
        options: {
          defaultData: { content: '<h3 class="card__title">My Card Title</h3>' }
        }
      },
      'card-content-rt-widget': {
        extend: '@apostrophecms/rich-text-widget',
        options: {
          defaultData: { content: '<p class="card__text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>' }
        }
      },
      'price-card-widget': {},

      // A page type for ordinary pages
      'default-page': {},

      // A piece type for articles
      article: {},

      // Tease an article on any page
      'article-widget': {},

      // Paginated index of articles, and with pages for individual articles
      'article-page': {},

      // A piece type for categorizing articles
      'article-category': {},

      // Import and export content
      '@apostrophecms/import-export': {},
      '@apostrophecms-pro/automatic-translation': {
        options: {
          provider: 'deepl'
        }
      },
      '@apostrophecms-pro/automatic-translation-deepl': {}
    }
  };

  /**
   * Allow each theme to modify the configuration object,
   * enabling additional modules etc.
   */
  const { default: theme } = await import(`./lib/theme-${site.theme}.js`);
  theme(site, config);

  return config;
};
