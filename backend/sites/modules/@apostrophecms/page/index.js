// This configures the @apostrophecms/pages module to add a "home" page type to the
// pages menu

export default {
  options: {
    types: [
      {
        name: 'default-page',
        label: 'project:defaultPage'
      },
      {
        name: 'article-page',
        label: 'project:articleIndexPage'
      },
      {
        name: 'room-page',
        label: 'Rooms & Suites'
      },
      {
        name: '@apostrophecms/home-page',
        label: 'project:home'
      }
    ]
  }
};
