export default {
  options: {
    label: 'project:video',
    description: 'project:videoDescription',
    previewImage: 'svg',
    className: 'widget demo-video'
  },
  extendMethods(self) {
    return {
      annotateWidgetForExternalFront(_super, widget, { scene } = {}) {
        return {
          ..._super(widget, { scene }),
          className: self.options.className
        };
      }
    };
  }
};
