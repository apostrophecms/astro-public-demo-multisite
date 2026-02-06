# Astro Frontend

This is the frontend portion of the ApostropheCMS + Astro hybrid demo.

## Running the Frontend

For installation and setup instructions, see the [main README](../README.md) at the project root.

```bash
# From this directory
npm run dev
```

The frontend runs on `http://localhost:4321` and connects to the ApostropheCMS backend for content.

## Learning More About Astro

This frontend uses standard Astro patterns with a few key integrations:

- **Single route system** - The `src/pages/[...slug].astro` file handles all routing via the CMS
- **Component registries** - Templates and widgets are mapped in `src/templates/index.js` and `src/widgets/index.js`
- **ApostropheCMS integration** - The `@apostrophecms/apostrophe-astro` package enables in-context editing and content fetching

For general Astro documentation and patterns, see the [Astro documentation](https://docs.astro.build/).

For details on the ApostropheCMS + Astro integration, see the [`apostrophe-astro` package documentation](https://github.com/apostrophecms/apostrophe-astro).