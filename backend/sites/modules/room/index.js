export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Room',
    pluralLabel: 'Rooms',
    sort: {
      nightlyRate: 1,
      createdAt: -1
    },
    publicApiProjection: {
      title: 1,
      slug: 1,
      roomType: 1,
      bedConfiguration: 1,
      view: 1,
      maxOccupancy: 1,
      bedroomCount: 1,
      squareFeet: 1,
      amenities: 1,
      nightlyRate: 1,
      rateCurrency: 1,
      description: 1,
      gallery: 1,
      _featuredImage: 1,
      _url: 1
    }
  },
  fields: {
    add: {
      roomType: {
        label: 'Room Type',
        type: 'select',
        def: 'standard',
        choices: [
          { label: 'Standard', value: 'standard' },
          { label: 'Deluxe', value: 'deluxe' },
          { label: 'Junior Suite', value: 'junior-suite' },
          { label: 'Suite', value: 'suite' },
          { label: 'Executive Suite', value: 'executive-suite' },
          { label: 'Penthouse', value: 'penthouse' },
          { label: 'Villa', value: 'villa' },
          { label: 'Studio', value: 'studio' }
        ]
      },
      bedConfiguration: {
        label: 'Bed Configuration',
        type: 'select',
        def: 'king',
        choices: [
          { label: 'King', value: 'king' },
          { label: 'Queen', value: 'queen' },
          { label: 'Two Queens', value: 'two-queens' },
          { label: 'Two Doubles', value: 'two-doubles' },
          { label: 'Two Twins', value: 'two-twins' },
          { label: 'King + Sofa Bed', value: 'king-sofa' },
          { label: 'Bunk', value: 'bunk' }
        ]
      },
      view: {
        label: 'View',
        type: 'select',
        def: 'city',
        choices: [
          { label: 'Ocean', value: 'ocean' },
          { label: 'Pool', value: 'pool' },
          { label: 'Garden', value: 'garden' },
          { label: 'City Skyline', value: 'city' },
          { label: 'Courtyard', value: 'courtyard' },
          { label: 'Mountain', value: 'mountain' },
          { label: 'Interior', value: 'interior' }
        ]
      },
      maxOccupancy: {
        label: 'Max Occupancy',
        type: 'integer',
        def: 2,
        min: 1,
        max: 12
      },
      bedroomCount: {
        label: 'Bedrooms',
        type: 'integer',
        def: 1,
        min: 0,
        max: 6
      },
      squareFeet: {
        label: 'Size (sq ft)',
        type: 'integer',
        help: 'Room size in square feet'
      },
      amenities: {
        label: 'Room Amenities',
        type: 'checkboxes',
        choices: [
          { label: 'Free Wi-Fi', value: 'wifi' },
          { label: 'Breakfast Included', value: 'breakfast' },
          { label: 'Mini Bar', value: 'mini-bar' },
          { label: 'Private Balcony', value: 'balcony' },
          { label: 'Jacuzzi / Soaking Tub', value: 'jacuzzi' },
          { label: 'Fireplace', value: 'fireplace' },
          { label: 'Kitchenette', value: 'kitchenette' },
          { label: 'Full Kitchen', value: 'kitchen' },
          { label: 'Smart TV', value: 'smart-tv' },
          { label: 'Work Desk', value: 'workspace' },
          { label: '24h Room Service', value: 'room-service' },
          { label: 'Pet Friendly', value: 'pet-friendly' },
          { label: 'Accessible', value: 'accessible' }
        ]
      },
      nightlyRate: {
        label: 'Starting Nightly Rate',
        type: 'integer',
        help: 'Rate "from" value shown to guests'
      },
      rateCurrency: {
        label: 'Currency',
        type: 'select',
        def: 'USD',
        choices: [
          { label: 'USD', value: 'USD' },
          { label: 'EUR', value: 'EUR' },
          { label: 'GBP', value: 'GBP' }
        ]
      },
      _featuredImage: {
        label: 'Featured Image',
        type: 'relationship',
        withType: '@apostrophecms/image',
        max: 1,
        aspectRatio: [ 3, 2 ]
      },
      gallery: {
        label: 'Gallery',
        type: 'area',
        help: 'Additional photos for the room detail gallery',
        options: {
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      description: {
        label: 'Room Description',
        type: 'area',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {
              toolbar: [
                'styles',
                'bold',
                'italic',
                'strike',
                'link',
                'bulletList',
                'orderedList',
                'blockquote'
              ],
              styles: [
                { tag: 'p', label: 'Paragraph' },
                { tag: 'h3', label: 'Heading 3' },
                { tag: 'h4', label: 'Heading 4' }
              ]
            },
            '@apostrophecms/image': {},
            '@apostrophecms/video': {}
          }
        }
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'title',
          'roomType',
          'bedConfiguration',
          'view',
          'maxOccupancy',
          'bedroomCount',
          'squareFeet'
        ]
      },
      rate: {
        label: 'Rate',
        fields: [
          'nightlyRate',
          'rateCurrency'
        ]
      },
      amenities: {
        label: 'Amenities',
        fields: [
          'amenities'
        ]
      },
      media: {
        label: 'Photos',
        fields: [
          '_featuredImage',
          'gallery'
        ]
      },
      content: {
        label: 'Description',
        fields: [
          'description'
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
