export default {
  fields: {
    add: {
      siteTitle: {
        label: 'project:siteTitle',
        type: 'string',
        def: 'ApostropheCMS Website'
      },
      _siteLogo: {
        label: 'project:siteLogo',
        type: 'relationship',
        withType: '@apostrophecms/image',
        max: 1
      },
      accentColor: { label: 'Accent color', type: 'color' },
      linkColor: { label: 'Link color', type: 'color' },
      headingFont: { label: 'Heading font (Google family)', type: 'string' },
      bodyFont: { label: 'Body font (Google family)', type: 'string' }
    },
    group: {
      general: {
        label: 'project:general',
        fields: [ 'siteTitle', '_siteLogo', 'favicon', 'accentColor', 'linkColor', 'headingFont', 'bodyFont' ]
      }
    }
  }
};
