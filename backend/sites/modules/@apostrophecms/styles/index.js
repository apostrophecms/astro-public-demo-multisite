// Project-level configuration for the global styles module.
//
// Binds editor-controllable values to the CSS custom properties already
// declared at :root in frontend/src/styles/scss/_variables.scss so that
// edits in the Styles panel take effect site-wide without a rebuild.

export default {
  options: {
    defaultStyles: {
      borderColor: '#242859',
      shadowColor: 'rgba(36, 40, 89, 0.25)'
    }
  },
  styles: {
    add: {
      // --- Palette ---
      accentColor: {
        label: 'Accent / Link',
        type: 'color',
        def: '#0b1ae9',
        selector: ':root',
        property: '--accent-color'
      },
      linkColor: {
        label: 'Rich-text Link',
        type: 'color',
        def: '#6516dd',
        selector: ':root',
        property: '--link-color'
      },
      headingColor: {
        label: 'Heading Text',
        type: 'color',
        def: '#242859',
        selector: ':root',
        property: '--heading-color'
      },
      defaultColor: {
        label: 'Body Text',
        type: 'color',
        def: '#4a4b64',
        selector: ':root',
        property: '--default-color'
      },
      backgroundColor: {
        label: 'Page Background',
        type: 'color',
        def: '#ffffff',
        selector: ':root',
        property: '--background-color'
      },
      surfaceColor: {
        label: 'Surface (cards, panels)',
        type: 'color',
        def: '#efefef',
        selector: ':root',
        property: '--surface-color'
      },
      contrastColor: {
        label: 'Button Text',
        help: 'Text on primary buttons and other accent-colored pills',
        type: 'color',
        def: '#ffffff',
        selector: ':root',
        property: '--contrast-color'
      },
      faintColor: {
        label: 'Divider / Faint',
        type: 'color',
        def: '#e8e8e8',
        selector: ':root',
        property: '--faint-color'
      },

      // --- Chrome (navigation) ---
      navColor: {
        label: 'Nav Link',
        type: 'color',
        def: '#4a4b64',
        selector: ':root',
        property: '--nav-color'
      },
      navHoverColor: {
        label: 'Nav Link Hover',
        type: 'color',
        def: '#0b1ae9',
        selector: ':root',
        property: '--nav-hover-color'
      },
      navDropdownBg: {
        label: 'Dropdown Background',
        type: 'color',
        def: '#ffffff',
        selector: ':root',
        property: '--nav-dropdown-background-color'
      },
      navDropdownColor: {
        label: 'Dropdown Link',
        type: 'color',
        def: '#4a4b64',
        selector: ':root',
        property: '--nav-dropdown-color'
      },

      // --- Typography ---
      headingFont: {
        label: 'Heading Font',
        type: 'select',
        def: '"Quicksand", sans-serif',
        selector: ':root',
        property: '--heading-font',
        choices: [
          { label: 'Quicksand (default)', value: '"Quicksand", sans-serif' },
          { label: 'Poppins', value: '"Poppins", sans-serif' },
          { label: 'Roboto', value: '"Roboto", sans-serif' },
          { label: 'Georgia serif', value: 'Georgia, "Times New Roman", serif' },
          { label: 'System serif', value: 'ui-serif, Georgia, serif' }
        ]
      },
      defaultFont: {
        label: 'Body Font',
        type: 'select',
        def: '"Roboto", system-ui, sans-serif',
        selector: ':root',
        property: '--default-font',
        choices: [
          { label: 'Roboto (default)', value: '"Roboto", system-ui, sans-serif' },
          { label: 'Poppins', value: '"Poppins", sans-serif' },
          { label: 'Quicksand', value: '"Quicksand", sans-serif' },
          { label: 'System sans', value: 'system-ui, -apple-system, "Segoe UI", sans-serif' },
          { label: 'System serif', value: 'ui-serif, Georgia, serif' }
        ]
      },
      navFont: {
        label: 'Nav Font',
        type: 'select',
        def: '"Poppins", sans-serif',
        selector: ':root',
        property: '--nav-font',
        choices: [
          { label: 'Poppins (default)', value: '"Poppins", sans-serif' },
          { label: 'Quicksand', value: '"Quicksand", sans-serif' },
          { label: 'Roboto', value: '"Roboto", sans-serif' },
          { label: 'System sans', value: 'system-ui, -apple-system, "Segoe UI", sans-serif' }
        ]
      },

      // --- Layout & rhythm ---
      maxLayoutWidth: {
        label: 'Content Max Width',
        type: 'range',
        def: 1100,
        min: 900,
        max: 1600,
        step: 20,
        unit: 'px',
        selector: ':root',
        property: '--max-layout-width'
      },
      widgetSpacer: {
        label: 'Space Between Widgets',
        type: 'range',
        def: 50,
        min: 16,
        max: 120,
        step: 2,
        unit: 'px',
        selector: ':root',
        property: '--widget-spacer'
      }
    },
    group: {
      palette: {
        label: 'Palette',
        group: {
          brand: {
            label: 'Brand',
            fields: [ 'accentColor' ]
          },
          text: {
            label: 'Text',
            fields: [ 'headingColor', 'defaultColor', 'linkColor', 'contrastColor' ]
          },
          surfaces: {
            label: 'Surfaces',
            fields: [ 'backgroundColor', 'surfaceColor', 'faintColor' ]
          },
          navigation: {
            label: 'Navigation',
            fields: [ 'navColor', 'navHoverColor', 'navDropdownBg', 'navDropdownColor' ]
          }
        }
      },
      typography: {
        label: 'Typography',
        group: {
          fonts: {
            label: 'Fonts',
            fields: [ 'headingFont', 'defaultFont', 'navFont' ]
          }
        }
      },
      layout: {
        label: 'Layout',
        group: {
          rhythm: {
            label: 'Rhythm',
            inline: true,
            fields: [ 'maxLayoutWidth', 'widgetSpacer' ]
          }
        }
      }
    }
  }
};
