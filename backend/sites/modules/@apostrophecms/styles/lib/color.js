import { TinyColor } from '@ctrl/tinycolor';
import { brandProfiles } from '../../../../lib/brandProfiles.js';

// Structural colors (page/surface backgrounds, and the text color that has
// to read clearly on top of a vivid accent button) aren't part of any
// brand's identity — tinting them per-brand would hurt readability for no
// governance benefit. These stay a small, shared set for every tenant.
export const neutralLight = [ '#ffffff', '#f8f9fa', '#eaeaea' ];
export const neutralDark = [ '#000000', '#1a1a1a', '#2e2e2e' ];

function tint(hex, amount) {
  return new TinyColor(hex).mix('#ffffff', amount).toHexString();
}
function shade(hex, amount) {
  return new TinyColor(hex).mix('#000000', amount).toHexString();
}
function lighten(hex, amount) {
  return new TinyColor(hex).lighten(amount).toHexString();
}

// Every other color field IS part of brand identity (text, headings, soft
// and strong accents) — derive a short, on-brand swatch list for each from
// a tenant's two established colors (accent + link), rather than showing
// every tenant the same generic swatches. Used both for the static fallback
// schema below (Northstar's colors, in case the request-time patch in
// extendMethods.js can't run) and, per-request, for the tenant actually
// being viewed — see extendMethods.js.
export function brandSwatches({ accent, link }) {
  return {
    accentLight: [ accent, link ],
    accentDark: [ lighten(accent, 12), lighten(link, 12) ],
    faintLight: [ tint(accent, 85), tint(link, 85) ],
    faintDark: [ shade(accent, 65), shade(link, 65) ],
    headingLight: [ shade(accent, 55), '#111111' ],
    headingDark: [ tint(accent, 70), '#ffffff' ],
    defaultLight: [ shade(accent, 70), '#333333' ],
    defaultDark: [ tint(accent, 78), '#e5e5e5' ]
  };
}

const fallback = brandSwatches(brandProfiles.northstar);

export default {
  fields: {
    defaultColorLight: {
      type: 'color',
      label: 'project:textColor',
      help: 'project:textColorHelp',
      selector: ':root',
      property: '--default-color',
      def: fallback.defaultLight[0],
      options: {
        presetColors: fallback.defaultLight
      }
    },
    headingColorLight: {
      type: 'color',
      label: 'project:headingColor',
      help: 'project:headingColorHelp',
      selector: ':root',
      property: '--heading-color',
      def: fallback.headingLight[0],
      options: {
        presetColors: fallback.headingLight
      }
    },
    faintColorLight: {
      type: 'color',
      label: 'project:softAccent',
      help: 'project:softAccentHelp',
      selector: ':root',
      property: '--faint-color',
      def: fallback.faintLight[0],
      options: {
        presetColors: fallback.faintLight
      }
    },
    accentColorLight: {
      type: 'color',
      label: 'project:strongAccent',
      help: 'project:strongAccentHelp',
      selector: ':root',
      property: '--accent-color',
      def: fallback.accentLight[0],
      options: {
        presetColors: fallback.accentLight
      }
    },
    contrastColorLight: {
      type: 'color',
      label: 'project:contrastColor',
      help: 'project:contrastColorHelp',
      selector: ':root',
      property: '--contrast-color',
      def: '#ffffff',
      options: {
        presetColors: neutralLight
      }
    },
    backgroundColorLight: {
      type: 'color',
      label: 'project:pageBackground',
      selector: ':root',
      property: '--background-color',
      def: '#ffffff',
      options: {
        presetColors: neutralLight
      }
    },
    surfaceColorLight: {
      type: 'color',
      label: 'project:surfaceBackground',
      help: 'project:surfaceBackgroundHelp',
      selector: ':root',
      property: '--surface-color',
      def: '#efefef',
      options: {
        presetColors: neutralLight
      }
    },
    defaultColorDark: {
      type: 'color',
      label: 'project:textColor',
      help: 'project:textColorHelp',
      selector: '.dark',
      property: '--default-color',
      def: fallback.defaultDark[0],
      options: {
        presetColors: fallback.defaultDark
      }
    },
    headingColorDark: {
      type: 'color',
      label: 'project:headingColor',
      help: 'project:headingColorHelp',
      selector: '.dark',
      property: '--heading-color',
      def: fallback.headingDark[0],
      options: {
        presetColors: fallback.headingDark
      }
    },
    faintColorDark: {
      type: 'color',
      label: 'project:softAccent',
      help: 'project:softAccentHelp',
      selector: '.dark',
      property: '--faint-color',
      def: fallback.faintDark[0],
      options: {
        presetColors: fallback.faintDark
      }
    },
    accentColorDark: {
      type: 'color',
      label: 'project:strongAccent',
      help: 'project:strongAccentHelp',
      selector: '.dark',
      property: '--accent-color',
      def: fallback.accentDark[0],
      options: {
        presetColors: fallback.accentDark
      }
    },
    contrastColorDark: {
      type: 'color',
      label: 'project:contrastColor',
      help: 'project:contrastColorHelp',
      selector: '.dark',
      property: '--contrast-color',
      def: '#ffffff',
      options: {
        presetColors: neutralLight
      }
    },
    backgroundColorDark: {
      type: 'color',
      label: 'project:pageBackground',
      selector: '.dark',
      property: '--background-color',
      def: '#05071e',
      options: {
        presetColors: neutralDark
      }
    },
    surfaceColorDark: {
      type: 'color',
      label: 'project:surfaceBackground',
      help: 'project:surfaceBackgroundHelp',
      selector: '.dark',
      property: '--surface-color',
      def: '#131428',
      options: {
        presetColors: neutralDark
      }
    }
  },
  group: {
    colors: {
      label: 'project:colors',
      group: {
        lightMode: {
          label: 'project:lightMode',
          fields: [
            'defaultColorLight',
            'headingColorLight',
            'faintColorLight',
            'accentColorLight',
            'contrastColorLight',
            'backgroundColorLight',
            'surfaceColorLight'
          ]
        },
        darkMode: {
          label: 'project:darkMode',
          fields: [
            'defaultColorDark',
            'headingColorDark',
            'faintColorDark',
            'accentColorDark',
            'contrastColorDark',
            'backgroundColorDark',
            'surfaceColorDark'
          ]
        }
      }
    }
  }
};
