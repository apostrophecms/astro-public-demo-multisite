export default {
  options: {
    label: 'project:layout',
    description: 'project:layoutDescription',
    previewImage: 'svg'
  },
  styles: {
    add: {
      gap: {
        label: 'apostrophe:styleLayoutGap',
        type: 'range',
        min: 0,
        def: 24,
        max: 64,
        unit: 'px',
        property: 'gap'
      }
    }
  }
};
