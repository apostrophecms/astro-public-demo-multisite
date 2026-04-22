export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Guest Testimonials',
    description: 'Show guest reviews and star ratings',
    icon: 'star-outline-icon',
    previewImage: 'svg'
  },
  icons: {
    'star-outline-icon': 'StarOutline'
  },
  fields: {
    add: {
      heading: {
        type: 'string',
        label: 'Heading',
        def: 'What Our Guests Say'
      },
      layout: {
        type: 'select',
        label: 'Layout',
        def: 'grid',
        choices: [
          { label: 'Grid of cards', value: 'grid' },
          { label: 'Single large feature', value: 'feature' }
        ]
      },
      minRating: {
        type: 'integer',
        label: 'Minimum Rating',
        def: 4,
        min: 1,
        max: 5,
        help: 'Only show reviews at or above this rating'
      },
      limit: {
        type: 'integer',
        label: 'Number of Testimonials',
        def: 3,
        min: 1,
        max: 9
      }
    }
  }
};
