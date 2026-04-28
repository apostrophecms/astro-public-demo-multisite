export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Testimonial',
    pluralLabel: 'Testimonials',
    sort: {
      stayDate: -1,
      createdAt: -1
    },
    publicApiProjection: {
      title: 1,
      slug: 1,
      quote: 1,
      guestName: 1,
      guestLocation: 1,
      rating: 1,
      stayDate: 1,
      tripType: 1,
      photo: 1,
      _url: 1
    }
  },
  fields: {
    add: {
      quote: {
        label: 'Guest Quote',
        type: 'area',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/rich-text': {
              toolbar: [ 'bold', 'italic' ]
            }
          }
        }
      },
      guestName: {
        label: 'Guest Name',
        type: 'string'
      },
      guestLocation: {
        label: 'Guest Location',
        type: 'string',
        help: 'e.g. "Seattle, WA" or "London, UK"'
      },
      rating: {
        label: 'Rating (1-5)',
        type: 'integer',
        def: 5,
        min: 1,
        max: 5
      },
      stayDate: {
        label: 'Date of Stay',
        type: 'date'
      },
      tripType: {
        label: 'Type of Trip',
        type: 'select',
        def: 'leisure',
        choices: [
          { label: 'Leisure', value: 'leisure' },
          { label: 'Business', value: 'business' },
          { label: 'Couples', value: 'couples' },
          { label: 'Family', value: 'family' },
          { label: 'Solo', value: 'solo' }
        ]
      },
      photo: {
        label: 'Guest Photo',
        type: 'area',
        help: 'Optional headshot or snapshot from the stay',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'title',
          'guestName',
          'guestLocation',
          'rating',
          'stayDate',
          'tripType'
        ]
      },
      content: {
        label: 'Content',
        fields: [
          'quote',
          'photo'
        ]
      },
      utility: {
        fields: [
          'slug',
          'visibility'
        ]
      }
    }
  }
};
