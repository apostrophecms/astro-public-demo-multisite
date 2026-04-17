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
      aboveJobs: {
        label: 'Above Job Listings',
        type: 'area',
        options: {
          expanded: true,
          groups: fullConfigExpandedGroups
        }
      },
      belowJobs: {
        label: 'Below Job Listings',
        type: 'area',
        options: {
          expanded: true,
          groups: fullConfigExpandedGroups
        }
      },
      aboveJob: {
        label: 'Above Individual Job',
        help: 'Content shown above every individual job detail page',
        type: 'area',
        options: {
          expanded: true,
          groups: fullConfigExpandedGroups
        }
      },
      belowJob: {
        label: 'Below Individual Job',
        help: 'Content shown below every individual job detail page',
        type: 'area',
        options: {
          expanded: true,
          groups: fullConfigExpandedGroups
        }
      },
      sidebar: {
        label: 'Sidebar',
        help: 'Right-hand column shown on both the job listings and individual job pages',
        type: 'area',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {},
            '@apostrophecms/image': {},
            '@apostrophecms/video': {}
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
        fields: [ 'aboveJobs', 'belowJobs' ]
      },
      showLayout: {
        label: 'Job Detail Layout',
        fields: [ 'aboveJob', 'belowJob' ]
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
