const amenityIconChoices = [
  { label: 'Swimming Pool', value: 'pool' },
  { label: 'Spa & Wellness', value: 'spa' },
  { label: 'Fitness Center', value: 'gym' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Bar / Lounge', value: 'bar' },
  { label: 'Free Wi-Fi', value: 'wifi' },
  { label: 'Parking', value: 'parking' },
  { label: 'Valet', value: 'valet' },
  { label: 'Pet Friendly', value: 'pet' },
  { label: 'Beach Access', value: 'beach' },
  { label: 'Ski Access', value: 'ski' },
  { label: 'Concierge', value: 'concierge' },
  { label: 'Room Service', value: 'room-service' },
  { label: 'Breakfast Included', value: 'breakfast' },
  { label: 'Business Center', value: 'business' },
  { label: 'Meeting Rooms', value: 'meetings' },
  { label: 'Shuttle Service', value: 'shuttle' },
  { label: 'Airport Transfer', value: 'airport' },
  { label: 'Family Friendly', value: 'family' },
  { label: 'Accessibility', value: 'accessible' },
  { label: 'Laundry', value: 'laundry' },
  { label: 'Rooftop', value: 'rooftop' }
];

export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Amenities',
    description: 'Icon grid highlighting hotel amenities',
    icon: 'sparkles-icon',
    previewImage: 'svg'
  },
  icons: {
    'sparkles-icon': 'Sparkles'
  },
  fields: {
    add: {
      heading: {
        type: 'string',
        label: 'Heading',
        def: 'Hotel Amenities'
      },
      intro: {
        label: 'Intro',
        type: 'area',
        help: 'Optional short paragraph above the icon grid',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/rich-text': {
              toolbar: [ 'bold', 'italic', 'link' ]
            }
          }
        }
      },
      columns: {
        type: 'select',
        label: 'Columns',
        def: '4',
        choices: [
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '6', value: '6' }
        ]
      },
      amenities: {
        label: 'Amenities',
        type: 'array',
        titleField: 'label',
        fields: {
          add: {
            icon: {
              type: 'select',
              label: 'Icon',
              def: 'pool',
              choices: amenityIconChoices
            },
            label: {
              type: 'string',
              label: 'Label'
            },
            description: {
              type: 'string',
              label: 'Short description',
              help: 'Optional, shown below the label'
            }
          }
        }
      }
    }
  },
  styles: {
    add: {
      iconColor: {
        label: 'Icon Color',
        type: 'color',
        def: '#0b1ae9',
        selector: '.amenity__icon',
        property: 'color'
      },
      iconSize: {
        label: 'Icon Size',
        type: 'range',
        min: 24,
        max: 96,
        step: 2,
        def: 48,
        unit: 'px',
        selector: '.amenity__icon svg',
        property: 'width'
      },
      gridGap: {
        label: 'Grid Gap',
        type: 'range',
        min: 8,
        max: 64,
        step: 2,
        def: 24,
        unit: 'px',
        selector: '.amenities-grid',
        property: 'gap'
      },
      padding: 'padding'
    }
  }
};
