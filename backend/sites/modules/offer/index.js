export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Offer',
    pluralLabel: 'Offers',
    sort: {
      validFrom: 1,
      createdAt: -1
    },
    publicApiProjection: {
      title: 1,
      slug: 1,
      subtitle: 1,
      tagline: 1,
      fromPrice: 1,
      priceCurrency: 1,
      priceUnit: 1,
      validFrom: 1,
      validTo: 1,
      promoCode: 1,
      highlights: 1,
      ctaText: 1,
      ctaUrl: 1,
      _heroImage: 1,
      description: 1,
      _url: 1
    }
  },
  fields: {
    add: {
      subtitle: {
        label: 'Subtitle',
        type: 'string',
        help: 'Short line under the title, e.g. "Limited-Time Package"'
      },
      tagline: {
        label: 'Tagline',
        type: 'string',
        help: 'Small badge text, e.g. "Save 20%" or "Third Night Free"'
      },
      fromPrice: {
        label: 'Starting Price',
        type: 'integer',
        help: 'Leave blank to hide price'
      },
      priceCurrency: {
        label: 'Currency',
        type: 'select',
        def: 'USD',
        choices: [
          { label: 'USD', value: 'USD' },
          { label: 'EUR', value: 'EUR' },
          { label: 'GBP', value: 'GBP' }
        ]
      },
      priceUnit: {
        label: 'Price Unit',
        type: 'string',
        def: 'per night',
        help: 'e.g. "per night", "per couple", "total"'
      },
      validFrom: {
        label: 'Valid From',
        type: 'date'
      },
      validTo: {
        label: 'Valid Through',
        type: 'date'
      },
      promoCode: {
        label: 'Promo Code',
        type: 'string',
        help: 'Optional code guests can use at booking'
      },
      highlights: {
        label: 'Included Highlights',
        type: 'array',
        titleField: 'text',
        help: 'Bullet-point perks shown on the offer card',
        fields: {
          add: {
            text: {
              type: 'string',
              label: 'Highlight'
            }
          }
        }
      },
      _heroImage: {
        label: 'Hero Image',
        type: 'relationship',
        withType: '@apostrophecms/image',
        max: 1,
        aspectRatio: [ 3, 2 ]
      },
      description: {
        label: 'Full Description',
        type: 'area',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {
              toolbar: [
                'styles',
                'bold',
                'italic',
                'link',
                'bulletList',
                'orderedList'
              ],
              styles: [
                { tag: 'p', label: 'Paragraph' },
                { tag: 'h3', label: 'Heading 3' },
                { tag: 'h4', label: 'Heading 4' }
              ]
            },
            '@apostrophecms/image': {},
            '@apostrophecms/video': {}
          }
        }
      },
      ctaText: {
        label: 'Call-to-Action Label',
        type: 'string',
        def: 'Book this offer'
      },
      ctaUrl: {
        label: 'Call-to-Action URL',
        type: 'url',
        help: 'External booking URL; optional'
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'title',
          'subtitle',
          'tagline'
        ]
      },
      pricing: {
        label: 'Pricing',
        fields: [
          'fromPrice',
          'priceCurrency',
          'priceUnit'
        ]
      },
      validity: {
        label: 'Dates & Code',
        fields: [
          'validFrom',
          'validTo',
          'promoCode'
        ]
      },
      details: {
        label: 'Details',
        fields: [
          'highlights',
          '_heroImage',
          'description'
        ]
      },
      cta: {
        label: 'Call to Action',
        fields: [
          'ctaText',
          'ctaUrl'
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
