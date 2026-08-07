// White-labels the Apostrophe admin experience as Northstar Fitness
// Collective's own platform, rather than exposing "Apostrophe" as the
// underlying vendor:
//   - ui/apos/components/AposLogoPadless.vue and AposLogo.vue (in this
//     same module folder) replace the admin-bar icon and login-page logo.
//   - init() below overrides Apostrophe's own admin UI theme color
//     (--a-primary, default purple #6516dd) with Northstar's brand navy.
//     prependNodes('head', ...) reaches both the authenticated admin
//     layout and the unauthenticated login page shell, since both are
//     rendered through the same core page template.
const NORTHSTAR_BLUE = '#1E2A5A';

export default {
  options: {
    groups: [
      {
        name: 'media',
        label: 'project:media',
        items: [
          '@apostrophecms/image',
          '@apostrophecms/file',
          '@apostrophecms/image-tag',
          '@apostrophecms/file-tag'
        ]
      }
    ],
    order: [
      '@apostrophecms/image',
      'article',
      'article-category'
    ]
  },
  init(self) {
    self.prependNodes('head', 'addNorthstarAdminTheme');
  },
  methods(self) {
    return {
      addNorthstarAdminTheme() {
        return [
          {
            name: 'style',
            body: [
              {
                raw: `
                  /* Apostrophe lets each editor pick a personal accent
                     preset (.apos-theme--primary-default/blue/orange/aqua/
                     sun/green/pink), applied on a wrapper element closer to
                     the admin bar than :root. Custom properties resolve per
                     element, so a plain rule on that wrapper beats an
                     !important rule on :root — these classes must be
                     targeted directly to force Northstar navy regardless of
                     any editor's personal preset. */
                  :root,
                  [class*="apos-theme--primary-"] {
                    --a-primary: ${NORTHSTAR_BLUE} !important;
                    --a-primary-transparent-90: color-mix(in srgb, ${NORTHSTAR_BLUE} 90%, transparent) !important;
                    --a-primary-transparent-50: color-mix(in srgb, ${NORTHSTAR_BLUE} 50%, transparent) !important;
                    --a-primary-transparent-25: color-mix(in srgb, ${NORTHSTAR_BLUE} 25%, transparent) !important;
                    --a-primary-transparent-15: color-mix(in srgb, ${NORTHSTAR_BLUE} 15%, transparent) !important;
                    --a-primary-transparent-10: color-mix(in srgb, ${NORTHSTAR_BLUE} 10%, transparent) !important;
                    --a-primary-transparent-05: color-mix(in srgb, ${NORTHSTAR_BLUE} 5%, transparent) !important;
                    --a-primary-dark-10: color-mix(in srgb, ${NORTHSTAR_BLUE}, black 10%) !important;
                    --a-primary-dark-15: color-mix(in srgb, ${NORTHSTAR_BLUE}, black 15%) !important;
                    --a-primary-light-40: color-mix(in srgb, ${NORTHSTAR_BLUE}, white 40%) !important;
                    --a-primary-light-80: color-mix(in srgb, ${NORTHSTAR_BLUE}, white 80%) !important;
                  }
                `
              }
            ]
          }
        ];
      }
    };
  }
};
