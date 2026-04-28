import linkConfig from '../../lib/link.js';

export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'project:hero',
    icon: 'link-icon',
    previewImage: 'svg',
    description: 'project:heroDescription'
  },
  fields: {
    add: {
      content: {
        label: 'project:textContent',
        help: 'project:textContentHelp',
        type: 'area',
        max: 1,
        options: {
          widgets: {
            '@apostrophecms/rich-text': {
              toolbar: [
                'styles',
                'bold',
                'italic'
              ],
              styles: [
                {
                  tag: 'p',
                  label: 'project:rtParagraph'
                },
                {
                  tag: 'h2',
                  label: 'project:rtH2'
                },
                {
                  tag: 'h3',
                  label: 'project:rtH3'
                },
                {
                  tag: 'h4',
                  label: 'project:rtH4'
                }
              ]
            }
          }
        }
      },
      links: {
        label: 'project:buttonLinks',
        help: 'project:buttonLinksDescription',
        type: 'array',
        titleField: 'linkText',
        fields: {
          add: {
            ...linkConfig.link,
            style: {
              type: 'select',
              label: 'project:style',
              choices: [
                {
                  label: 'project:primary',
                  value: 'primary',
                  def: true
                },
                {
                  label: 'project:outline',
                  value: 'outline'
                }
              ]
            }
          }
        }
      }
    }
  },
  styles: {
    add: {
      minHeight: {
        label: 'Minimum Height',
        type: 'range',
        min: 200,
        max: 900,
        step: 20,
        def: 420,
        unit: 'px',
        selector: '.hero-widget',
        property: 'min-height'
      },
      textAlign: {
        label: 'Text Alignment',
        type: 'select',
        def: 'center',
        selector: '.hero-widget__content',
        property: 'text-align',
        choices: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' }
        ]
      },
      background: {
        label: 'Background Color',
        type: 'color',
        def: '#242859',
        selector: '.hero-widget',
        property: 'background-color'
      },
      textColor: {
        label: 'Text Color',
        type: 'color',
        def: '#ffffff',
        selector: '.hero-widget__content',
        property: 'color'
      }
    }
  }
};
