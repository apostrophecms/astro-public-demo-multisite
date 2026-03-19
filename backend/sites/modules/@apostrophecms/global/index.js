export default {
  fields: {
    add: {
      siteTitle: {
        label: 'project:siteTitle',
        type: 'string',
        def: 'ApostropheCMS Website'
      },
      companyName: {
        label: 'Company Name',
        type: 'string',
        help: 'The company name for this site, used in job listings and branding'
      },
      _siteLogo: {
        label: 'project:siteLogo',
        type: 'relationship',
        withType: '@apostrophecms/image',
        max: 1
      }
    },
    group: {
      general: {
        label: 'project:general',
        fields: [ 'siteTitle', 'companyName', '_siteLogo', 'favicon' ]
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
