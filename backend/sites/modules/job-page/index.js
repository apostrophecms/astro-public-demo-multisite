import { fullConfigExpandedGroups } from '../../lib/area.js';

export default {
  extend: '@apostrophecms/piece-page-type',
  options: {
    label: 'Job Board',
    pluralLabel: 'Job Boards',
    piecesFilters: [
      { name: 'team' },
      { name: 'locationType' },
      { name: 'employmentType' },
      { name: 'experienceLevel' }
    ]
  },
  fields: {
    add: {
      intro: {
        label: 'Intro',
        type: 'area',
        options: {
          limit: 1,
          widgets: {
            '@apostrophecms/rich-text': {}
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
    }
  }
};
