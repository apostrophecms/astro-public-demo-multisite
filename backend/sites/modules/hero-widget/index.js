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
      // A richText field rather than an area holding one rich text widget,
      // so editors type straight into the hero instead of first selecting a
      // widget inside a widget. `toolbar` and `styles` sit directly in
      // `options` here; for an area they were nested under the widget name.
      // `wysiwyg: true` sends the rendered markup and editing info to Astro,
      // which <AposField> needs to display and edit the field.
      content: {
        label: 'project:textContent',
        help: 'project:textContentHelp',
        type: 'richText',
        wysiwyg: true,
        options: {
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
  init(self) {
    self.addContentToRichTextMigration();
  },
  methods(self) {
    return {
      // `content` used to be an area of rich text widgets, stored as
      // `{ metaType: 'area', items: [ { content: '<p>…</p>' } ] }`. It is now
      // a richText field, stored as the HTML string itself. Copy the HTML up
      // a level wherever a hero widget appears, at any depth and in drafts
      // and published docs alike. The area's `max: 1` was never enforced, so
      // join every rich text widget rather than keeping only the first. A
      // hero whose `content` is already a string has been migrated and is
      // left alone.
      addContentToRichTextMigration() {
        self.apos.migration.add('hero-widget-content-to-rich-text', async () => {
          await self.apos.migration.eachWidget({}, async (doc, widget, dotPath) => {
            if ((widget.type !== 'hero') || (typeof widget.content === 'string')) {
              return;
            }
            const html = (widget.content?.items || [])
              .filter((item) => item.type === '@apostrophecms/rich-text')
              .map((item) => item.content || '')
              .join('');
            await self.apos.doc.db.updateOne(
              { _id: doc._id },
              { $set: { [`${dotPath}.content`]: html } }
            );
          });
        });
      }
    };
  }
};
