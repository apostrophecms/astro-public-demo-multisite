# START HERE — Northstar Assembly demo kit

Everything in this kit is for building a filled-in **ApostropheCMS Assembly** multisite demo: one parent fitness franchisor (Northstar) + nine studio brands, each its own tenant.

## The correct starting point (important)
Build on:
- **Repo:** `apostrophecms/astro-public-demo-multisite`
- **Branch:** `main`

Do **not** use: the Apollo/Bulma `starter-kit-astro-apollo-assembly` (heavier, Bulma), the Nunjucks `public-demo-multisite` (no Astro frontend), or this repo's `hospitality` branch (hotels).

## What's in this kit
```
START-HERE.md            <- this file
SETUP-AND-RUN.md         <- full runbook: clone, install, create sites, seed
fitness-seed/            <- the seed module -> backend/sites/modules/fitness-seed
logos/                   <- 10 brand SVG logos (+ PNG exports)
reference/
  brand-kits.md          <- names, taglines, palettes, fonts, voice
  page-content.md        <- homepage copy per brand (source for the seed)
  logo-contact-sheet.html<- open in a browser to preview all logos
  README-assembly-demo.md<- overview + brand/tenant mapping
```

## What to do (short version)
1. Fork/clone `astro-public-demo-multisite` (`main`), `npm install`.
2. Follow **SETUP-AND-RUN.md** to get the dashboard running and create the ten sites.
3. Drop `fitness-seed/` into `backend/sites/modules/`, register `'fitness-seed': {}` in `backend/sites/index.js`, copy `logos/` to `assembly-demo/logos/`.
4. Run the ten seed commands (in SETUP-AND-RUN.md). Smoke-test `cadence` first.

## Paste this into Claude Code (from the cloned repo root)
> This repo is `astro-public-demo-multisite` on `main`. I have a demo kit at `./northstar-demo-kit`. Read `northstar-demo-kit/SETUP-AND-RUN.md`, then: install the `fitness-seed` module into `backend/sites/modules/`, register `'fitness-seed': {}` in `backend/sites/index.js`, and copy `northstar-demo-kit/logos/*.svg` to `assembly-demo/logos/`. Then help me create the ten sites in the dashboard and run `node app fitness-seed:home` for all ten brands. Do `cadence` first and confirm `http://cadence.localhost:4321` renders before the rest, and fix the seed task if any widget field is rejected.

## Heads-up (so Code can plan for it)
- Installing needs the Assembly Pro license / npm auth token; the seed and dashboard need local MongoDB.
- The seed was written against this repo's widget schemas but not run against a licensed instance — the first run is the real test. Errors name the offending field and are quick to fix.
- Logo import is best-effort (SVG attachment support varies); it warns and skips rather than failing the page.
