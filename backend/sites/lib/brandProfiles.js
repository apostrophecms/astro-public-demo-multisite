// Single source of truth for each tenant's brand identity colors + fonts.
// Used by fitness-seed (to set the Global doc's siteTitle/accentColor/
// linkColor/fonts) and by @apostrophecms/styles (to build each tenant's own
// Colors swatch presets) so a brand only has to be defined in one place.
export const brandProfiles = {
  northstar: {
    accent: '#1E2A5A',
    link: '#1E2A5A',
    heading: 'Sora',
    body: 'Inter'
  },
  cadence: {
    accent: '#FF3B47',
    link: '#E11D2A',
    heading: 'Anton',
    body: 'Inter'
  },
  emberflow: {
    accent: '#E2571E',
    link: '#C0430F',
    heading: 'Fraunces',
    body: 'Nunito Sans'
  },
  ironhaus: {
    accent: '#F5A623',
    link: '#B57400',
    heading: 'Archivo Black',
    body: 'Archivo'
  },
  southpaw: {
    accent: '#C1121F',
    link: '#C1121F',
    heading: 'Oswald',
    body: 'Roboto'
  },
  reformroom: {
    accent: '#6B8E6B',
    link: '#4E6E4E',
    heading: 'Jost',
    body: 'Inter'
  },
  gritlab: {
    accent: '#C6FF00',
    link: '#5C7000',
    heading: 'Barlow Condensed',
    body: 'Barlow'
  },
  barretheory: {
    accent: '#B76E79',
    link: '#9E5763',
    heading: 'Cormorant Garamond',
    body: 'Jost'
  },
  unwind: {
    accent: '#5B8A9A',
    link: '#3E6C7C',
    heading: 'Nunito',
    body: 'Nunito Sans'
  },
  wake: {
    accent: '#2C9BA0',
    link: '#12324F',
    heading: 'Manrope',
    body: 'Inter'
  }
};

// Multisite shortNames look like `astro-public-demo-multisite-cadence`.
// Strip the shared prefix down to the trailing brand key.
export function inferBrandKey(shortName) {
  const sn = shortName || '';
  return sn.replace(/^.*?-(?=[a-z]+$)/, '') || sn;
}
