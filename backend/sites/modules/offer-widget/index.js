export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Offers & Packages',
    description: 'Feature seasonal offers and packages',
    icon: 'tag-outline-icon',
    previewImage: 'svg'
  },
  icons: {
    'tag-outline-icon': 'TagOutline'
  },
  fields: {
    add: {
      heading: {
        type: 'string',
        label: 'Heading',
        def: 'Special Offers'
      },
      layout: {
        type: 'select',
        label: 'Layout',
        def: 'cards',
        choices: [
          { label: 'Image cards', value: 'cards' },
          { label: 'Side-by-side feature', value: 'feature' }
        ]
      },
      limit: {
        type: 'integer',
        label: 'Number of Offers',
        def: 3,
        min: 1,
        max: 8
      },
      _offers: {
        label: 'Select Specific Offers',
        type: 'relationship',
        withType: 'offer',
        help: 'Leave empty to show the newest offers automatically',
        builders: {
          project: {
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
            _url: 1
          }
        }
      }
    }
  },
  styles: {
    add: {
      padding: 'padding',
      cardRadius: {
        label: 'Card Corner Radius',
        type: 'range',
        min: 0,
        max: 32,
        step: 1,
        def: 8,
        unit: 'px',
        selector: '.offer-card',
        property: 'border-radius'
      },
      ribbonColor: {
        label: 'Promo Ribbon Color',
        type: 'color',
        def: '#ea433a',
        selector: '.offer-card__promo',
        property: 'background-color'
      },
      priceColor: {
        label: 'Price Color',
        type: 'color',
        def: '#0b1ae9',
        selector: '.offer-card__price',
        property: 'color'
      },
      shadow: 'boxShadow'
    }
  }
};
