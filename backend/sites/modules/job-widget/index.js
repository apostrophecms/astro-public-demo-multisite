export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Job Listings',
    description: 'Display recent job openings',
    icon: 'briefcase-outline-icon',
    previewImage: 'svg'
  },
  icons: {
    'briefcase-outline-icon': 'BriefcaseOutline'
  },
  fields: {
    add: {
      limit: {
        type: 'integer',
        label: 'Limit',
        def: 5,
        min: 1,
        max: 20
      }
    }
  }
};
