export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Booking Call to Action',
    description: 'Check-in / check-out picker with call to action',
    icon: 'calendar-outline-icon',
    previewImage: 'svg'
  },
  icons: {
    'calendar-outline-icon': 'CalendarOutline'
  },
  fields: {
    add: {
      headline: {
        type: 'string',
        label: 'Headline',
        def: 'Reserve Your Stay'
      },
      subhead: {
        label: 'Subhead',
        type: 'area',
        help: 'Optional supporting copy above the date picker',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/rich-text': {
              toolbar: [ 'bold', 'italic', 'link' ]
            }
          }
        }
      },
      background: {
        label: 'Background Image',
        type: 'area',
        help: 'Optional background image for the CTA block',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      style: {
        type: 'select',
        label: 'Visual Style',
        def: 'dark',
        choices: [
          { label: 'Dark overlay', value: 'dark' },
          { label: 'Light card', value: 'light' },
          { label: 'Minimal bar', value: 'bar' }
        ]
      },
      showGuests: {
        label: 'Show Guest Count Field',
        type: 'boolean',
        def: true
      },
      showPromoCode: {
        label: 'Show Promo Code Field',
        type: 'boolean',
        def: false
      },
      buttonLabel: {
        type: 'string',
        label: 'Button Label',
        def: 'Check Availability'
      },
      bookingUrl: {
        type: 'url',
        label: 'Booking Engine URL',
        help: 'Where the form should submit; leave blank to open an availability placeholder'
      }
    }
  }
};
