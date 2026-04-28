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
  },
  styles: {
    add: {
      padding: 'padding',
      radius: {
        label: 'Corner Radius',
        type: 'range',
        min: 0,
        max: 32,
        step: 1,
        def: 8,
        unit: 'px',
        selector: '.booking-cta',
        property: 'border-radius'
      },
      accent: {
        label: 'Button Color',
        type: 'color',
        def: '#0b1ae9',
        selector: '.booking-cta__submit',
        property: 'background-color'
      },
      buttonText: {
        label: 'Button Text Color',
        type: 'color',
        def: '#ffffff',
        selector: '.booking-cta__submit',
        property: 'color'
      },
      align: {
        label: 'Text Alignment',
        type: 'select',
        def: 'left',
        selector: '.booking-cta__header',
        property: 'text-align',
        choices: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' }
        ]
      }
    }
  }
};
