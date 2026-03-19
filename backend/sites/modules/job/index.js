export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Job',
    pluralLabel: 'Jobs',
    sort: {
      createdAt: -1
    },
    publicApiProjection: {
      title: 1,
      slug: 1,
      team: 1,
      location: 1,
      locationType: 1,
      employmentType: 1,
      experienceLevel: 1,
      salaryMin: 1,
      salaryMax: 1,
      salaryCurrency: 1,
      description: 1,
      _url: 1
    }
  },
  fields: {
    add: {
      team: {
        label: 'Team',
        type: 'string',
        help: 'The team or department within the company (e.g. Engineering, Marketing)'
      },
      location: {
        label: 'Location',
        type: 'string',
        help: 'e.g. New York, NY or London, UK'
      },
      locationType: {
        label: 'Location Type',
        type: 'select',
        def: 'onsite',
        choices: [
          { label: 'On-site', value: 'onsite' },
          { label: 'Remote', value: 'remote' },
          { label: 'Hybrid', value: 'hybrid' }
        ]
      },
      employmentType: {
        label: 'Employment Type',
        type: 'select',
        def: 'full-time',
        choices: [
          { label: 'Full-time', value: 'full-time' },
          { label: 'Part-time', value: 'part-time' },
          { label: 'Contract', value: 'contract' },
          { label: 'Internship', value: 'internship' }
        ]
      },
      experienceLevel: {
        label: 'Experience Level',
        type: 'select',
        def: 'mid',
        choices: [
          { label: 'Entry Level', value: 'entry' },
          { label: 'Mid Level', value: 'mid' },
          { label: 'Senior', value: 'senior' },
          { label: 'Lead', value: 'lead' },
          { label: 'Executive', value: 'executive' }
        ]
      },
      salaryMin: {
        label: 'Salary Min',
        type: 'integer',
        help: 'Minimum salary (annual)'
      },
      salaryMax: {
        label: 'Salary Max',
        type: 'integer',
        help: 'Maximum salary (annual)'
      },
      salaryCurrency: {
        label: 'Salary Currency',
        type: 'select',
        def: 'USD',
        choices: [
          { label: 'USD', value: 'USD' },
          { label: 'EUR', value: 'EUR' },
          { label: 'GBP', value: 'GBP' }
        ]
      },
      description: {
        label: 'Job Description',
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
            }
          }
        }
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'title',
          'team',
          'location',
          'locationType',
          'employmentType',
          'experienceLevel'
        ]
      },
      salary: {
        label: 'Compensation',
        fields: [
          'salaryMin',
          'salaryMax',
          'salaryCurrency'
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
