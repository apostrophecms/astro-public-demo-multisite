export default {
  options: {
    // When not in production, refresh the page on restart
    refreshOnRestart: true,
    // Not for use with Astro, which has its own
    hmr: false,
    breakpointPreviewMode: {
      enable: true,
      screens: {
        desktop: {
          label: 'Desktop',
          width: '1440px',
          height: '900px',
          icon: 'monitor-icon',
          shortcut: true
        },
        tablet: {
          label: 'Tablet',
          width: '769px',
          height: '768px',
          icon: 'tablet-icon',
          shortcut: true
        },
        mobile: {
          label: 'Mobile',
          width: '479px',
          height: '896px',
          icon: 'cellphone-icon',
          shortcut: true
        }
      }
    }
  }
};
