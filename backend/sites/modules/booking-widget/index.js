export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'project:booking',
    icon: 'calendar-check-icon',
    previewImage: 'svg',
    description: 'project:bookingDescription'
  },
  icons: {
    'calendar-check-icon': 'CalendarCheck'
  },
  fields: {
    add: {
      heading: {
        label: 'project:bookingHeading',
        type: 'string',
        def: 'Book a class'
      },
      intro: {
        label: 'project:bookingIntro',
        help: 'project:bookingIntroHelp',
        type: 'string',
        textarea: true
      },
      classType: {
        label: 'project:bookingClassType',
        help: 'project:bookingClassTypeHelp',
        type: 'select',
        choices: [
          {
            label: 'project:bookingAll',
            value: 'all',
            def: true
          },
          {
            label: 'project:bookingCycling',
            value: 'cycling'
          },
          {
            label: 'project:bookingYoga',
            value: 'yoga'
          },
          {
            label: 'project:bookingStrength',
            value: 'strength'
          },
          {
            label: 'project:bookingBoxing',
            value: 'boxing'
          },
          {
            label: 'project:bookingPilates',
            value: 'pilates'
          },
          {
            label: 'project:bookingHiit',
            value: 'hiit'
          },
          {
            label: 'project:bookingBarre',
            value: 'barre'
          },
          {
            label: 'project:bookingRecovery',
            value: 'recovery'
          },
          {
            label: 'project:bookingRowing',
            value: 'rowing'
          }
        ]
      }
    }
  }
};
