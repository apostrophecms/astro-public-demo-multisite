import { basicConfig } from '../../../lib/area.js';

export default {
  fields: {
    add: {
      siteTitle: {
        label: 'project:siteTitle',
        type: 'string',
        def: 'ApostropheCMS Website'
      },
      companyName: {
        label: 'Hotel Name',
        type: 'string',
        help: 'The hotel or brand name for this site, used in room listings and branding'
      },
      _siteLogo: {
        label: 'project:siteLogo',
        type: 'relationship',
        withType: '@apostrophecms/image',
        max: 1
      },
      footer: {
        label: 'Footer',
        type: 'area',
        help: 'Edited per-site; drop in a layout widget with columns of rich text, links, or images.',
        options: {
          widgets: basicConfig
        }
      }
    },
    group: {
      general: {
        label: 'project:general',
        fields: [ 'siteTitle', 'companyName', '_siteLogo', 'favicon' ]
      },
      footer: {
        label: 'Footer',
        fields: [ 'footer' ]
      }
    }
  },
  init(self) {
    // Default companyName from the multisite site piece title
    const companyName = self.apos.options.companyName;
    if (companyName) {
      const originalNewInstance = self.newInstance;
      self.newInstance = function () {
        const instance = originalNewInstance.call(self);
        if (!instance.companyName) {
          instance.companyName = companyName;
        }
        return instance;
      };
    }
  }
};
