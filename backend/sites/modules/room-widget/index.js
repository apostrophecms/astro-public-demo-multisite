export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Featured Rooms',
    description: 'Showcase rooms and suites',
    icon: 'bed-outline-icon',
    previewImage: 'svg'
  },
  icons: {
    'bed-outline-icon': 'BedOutline'
  },
  fields: {
    add: {
      heading: {
        type: 'string',
        label: 'Heading',
        def: 'Our Rooms & Suites'
      },
      layout: {
        type: 'select',
        label: 'Layout',
        def: 'grid',
        choices: [
          { label: 'Grid with images', value: 'grid' },
          { label: 'Compact list', value: 'list' }
        ]
      },
      roomType: {
        label: 'Limit to Room Type',
        type: 'select',
        def: '',
        help: 'Leave blank for all room types',
        choices: [
          { label: 'Any', value: '' },
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
      limit: {
        type: 'integer',
        label: 'Number of Rooms',
        def: 3,
        min: 1,
        max: 12
      }
    }
  },
  styles: {
    add: {
      padding: 'padding',
      gap: {
        label: 'Space Between Cards',
        type: 'range',
        min: 8,
        max: 48,
        step: 2,
        def: 20,
        unit: 'px',
        selector: '.room-widget__list',
        property: 'gap'
      },
      cardRadius: {
        label: 'Card Corner Radius',
        type: 'range',
        min: 0,
        max: 32,
        step: 1,
        def: 6,
        unit: 'px',
        selector: '.room-excerpt',
        property: 'border-radius'
      },
      headingColor: {
        label: 'Heading Color',
        type: 'color',
        def: '#242859',
        selector: '.room-widget__heading',
        property: 'color'
      }
    }
  }
};
