import { klona } from 'klona';
import { brandProfiles } from '../../../../lib/brandProfiles.js';
import { brandSwatches } from './color.js';

// color.js's static schema can only bake in one fallback brand's swatches
// (Northstar's) — @apostrophecms/styles is a single shared module definition,
// and in this multisite project the real per-tenant identity (shortName)
// isn't resolved yet at the point that schema is built. `req`, on the other
// hand, IS always correctly scoped to the current tenant by the time
// getBrowserData runs. So the real per-tenant swatches are patched in here,
// per request, using this site's own Global doc accentColor/linkColor —
// the same two colors fitness-seed already sets per brand — rather than
// re-deriving brand identity from the request in some other way.
const brandFieldNames = [
  'defaultColorLight', 'defaultColorDark',
  'headingColorLight', 'headingColorDark',
  'faintColorLight', 'faintColorDark',
  'accentColorLight', 'accentColorDark'
];

export default self => ({
  getBrowserData(_super, req) {
    const data = _super(req);
    if (!data.schema) {
      return data;
    }

    const global = req.data.global || {};
    const accent = global.accentColor || brandProfiles.northstar.accent;
    const link = global.linkColor || brandProfiles.northstar.link;
    const swatch = brandSwatches({
      accent,
      link
    });

    const patches = {
      defaultColorLight: swatch.defaultLight,
      defaultColorDark: swatch.defaultDark,
      headingColorLight: swatch.headingLight,
      headingColorDark: swatch.headingDark,
      faintColorLight: swatch.faintLight,
      faintColorDark: swatch.faintDark,
      accentColorLight: swatch.accentLight,
      accentColorDark: swatch.accentDark
    };

    const schema = klona(data.schema);
    for (const field of schema) {
      if (!brandFieldNames.includes(field.name)) {
        continue;
      }
      const presetColors = patches[field.name];
      field.def = presetColors[0];
      field.options = {
        ...field.options,
        presetColors
      };
    }

    return {
      ...data,
      schema
    };
  }
});
