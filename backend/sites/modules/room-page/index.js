import { fullConfigExpandedGroups } from '../../lib/area.js';

export default {
  extend: '@apostrophecms/piece-page-type',
  options: {
    label: 'Rooms & Suites Page',
    pluralLabel: 'Rooms & Suites Pages',
    piecesFilters: [
      { name: 'roomType' },
      { name: 'view' },
      { name: 'bedConfiguration' }
    ]
  },
  fields: {
    add: {
      aboveRooms: {
        label: 'Above Room Listings',
        type: 'area',
        options: {
          expanded: true,
          groups: fullConfigExpandedGroups
        }
      },
      belowRooms: {
        label: 'Below Room Listings',
        type: 'area',
        options: {
          expanded: true,
          groups: fullConfigExpandedGroups
        }
      },
      aboveRoom: {
        label: 'Above Individual Room',
        help: 'Content shown above every individual room detail page',
        type: 'area',
        options: {
          expanded: true,
          groups: fullConfigExpandedGroups
        }
      },
      belowRoom: {
        label: 'Below Individual Room',
        help: 'Content shown below every individual room detail page',
        type: 'area',
        options: {
          expanded: true,
          groups: fullConfigExpandedGroups
        }
      },
      sidebar: {
        label: 'Sidebar',
        help: 'Right-hand column shown on both the room listings and individual room pages',
        type: 'area',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {},
            '@apostrophecms/image': {},
            '@apostrophecms/video': {},
            'booking-cta': {},
            amenities: {}
          }
        }
      },
      main: {
        label: 'Main Content',
        type: 'area',
        options: {
          expanded: true,
          groups: fullConfigExpandedGroups
        }
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [ 'title' ]
      },
      indexLayout: {
        label: 'Index Layout',
        fields: [ 'aboveRooms', 'belowRooms' ]
      },
      showLayout: {
        label: 'Room Detail Layout',
        fields: [ 'aboveRoom', 'belowRoom' ]
      },
      sidebar: {
        label: 'Sidebar',
        fields: [ 'sidebar' ]
      },
      main: {
        label: 'Main Content',
        fields: [ 'main' ]
      }
    }
  }
};
