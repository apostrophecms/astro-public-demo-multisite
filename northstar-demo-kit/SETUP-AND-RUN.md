# Northstar demo — setup + seed (astro-public-demo-multisite)

Repo: `apostrophecms/astro-public-demo-multisite`, **`main` branch** (Astro frontend, built-in widgets). Ignore the `hospitality` branch.

> Supersedes the earlier Apollo/Bulma setup files — use these instead.

## Prereqs
- Node 22+, MongoDB 6+
- Your ApostropheCMS Assembly license / npm auth token (for `@apostrophecms-pro/*`)

## 1. Get your own copy
```bash
git clone https://github.com/apostrophecms/astro-public-demo-multisite.git northstar-demo
cd northstar-demo
git remote remove origin
npm install
```

## 2. /etc/hosts
```
127.0.0.1 dashboard.localhost northstar.localhost cadence.localhost emberflow.localhost ironhaus.localhost southpaw.localhost reformroom.localhost gritlab.localhost barretheory.localhost unwind.localhost wake.localhost
```

## 3. Dashboard admin
```bash
cd backend
node app @apostrophecms/user:add admin admin --site=dashboard
```

## 4. Run it (two terminals, from repo root)
```bash
export APOS_EXTERNAL_FRONT_KEY=dev
npm run dev-backend      # http://localhost:3000
npm run dev-frontend     # http://localhost:4321
```
Dashboard: `http://dashboard.localhost:4321`

## 5. Create the sites (dashboard UI)
Sites → + New Site, theme `demo`, for each shortname:
`northstar, cadence, emberflow, ironhaus, southpaw, reformroom, gritlab, barretheory, unwind, wake`

## 6. Install the seed module
```bash
cp -r fitness-seed backend/sites/modules/fitness-seed
mkdir -p assembly-demo/logos && cp /path/to/logos/*.svg assembly-demo/logos/   # for logos
```
Add one line to the modules list in `backend/sites/index.js` (near the other widgets):
```js
'price-card-widget': {},
'fitness-seed': {},   // <-- add
```

## 7. Seed each site (from backend/)
```bash
node app fitness-seed:home --site=northstar.localhost   --brand=northstar
node app fitness-seed:home --site=cadence.localhost     --brand=cadence
node app fitness-seed:home --site=emberflow.localhost   --brand=emberflow
node app fitness-seed:home --site=ironhaus.localhost    --brand=ironhaus
node app fitness-seed:home --site=southpaw.localhost    --brand=southpaw
node app fitness-seed:home --site=reformroom.localhost  --brand=reformroom
node app fitness-seed:home --site=gritlab.localhost     --brand=gritlab
node app fitness-seed:home --site=barretheory.localhost --brand=barretheory
node app fitness-seed:home --site=unwind.localhost      --brand=unwind
node app fitness-seed:home --site=wake.localhost        --brand=wake
```
Each seeds: global title + logo, then a home page with a hero, class cards, membership pricing cards, and a closing note — and publishes it.

Flags: `--logoDir=/abs/path` to point elsewhere for SVGs · `--no-logo` to skip logo import.

## 8. Per-site branding (colors + fonts) — one-time repo edit
The seed sets each site's accent color, link color, and a **heading + body Google
Fonts pairing** on its Global doc. For those to render, add the fields + a head
injection once. The frontend already themes off `--accent-color`, `--link-color`,
`--heading-font`, `--default-font` (body) and `--nav-font`, so this is all it needs.

**a. Add fields to `backend/sites/modules/@apostrophecms/global/index.js`** (in `add`, and list them in the `general` group):
```js
accentColor: { label: 'Accent color', type: 'color' },
linkColor:   { label: 'Link color', type: 'color' },
headingFont: { label: 'Heading font (Google family)', type: 'string' },
bodyFont:    { label: 'Body font (Google family)', type: 'string' }
```

**b. Inject them in `frontend/src/pages/[...slug].astro`**, inside `<Fragment slot="standardHead">`:
```astro
{(aposData.global?.headingFont || aposData.global?.bodyFont) && (
  <link rel="stylesheet"
    href={`https://fonts.googleapis.com/css2?${[aposData.global?.headingFont, aposData.global?.bodyFont]
      .filter(Boolean)
      .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700;900`)
      .join('&')}&display=swap`} />
)}
<style set:html={`:root{`
  + (aposData.global?.accentColor ? `--accent-color:${aposData.global.accentColor};` : '')
  + (aposData.global?.linkColor ? `--link-color:${aposData.global.linkColor};` : '')
  + (aposData.global?.headingFont ? `--heading-font:'${aposData.global.headingFont}',sans-serif;--nav-font:'${aposData.global.headingFont}',sans-serif;` : '')
  + (aposData.global?.bodyFont ? `--default-font:'${aposData.global.bodyFont}',system-ui,sans-serif;` : '')
  + `}`}></style>
```
Re-run the seed (step 7) after adding the fields.

**Pairings the seed applies (all Google Fonts):**
Northstar Sora/Inter · Cadence Anton/Inter · Emberflow Fraunces/Nunito Sans ·
Ironhaus Archivo Black/Archivo · Southpaw Oswald/Roboto · Reform Room Jost/Inter ·
Grit Lab Barlow Condensed/Barlow · Barre Theory Cormorant Garamond/Jost ·
Unwind Nunito/Nunito Sans · Wake Manrope/Inter.

> Note: Grit Lab's accent is a bright volt (`#C6FF00`); if button text is hard to read on it, set button text to a dark color for that one site, or swap the accent to something deeper.

## Notes / caveats
- **Smoke-test first.** Run `cadence` only, open `http://cadence.localhost:4321`, confirm it renders, then do the rest.
- **Publishes automatically** — no manual Commit needed.
- **Re-runnable** — overwrites the home page each run, so tweak the copy in `fitness-seed/index.js` and re-run.
- **Colors** come from the `demo` theme; the built-in widgets carry the styling. Brand-specific color is best shown via the theme/CSS, not per-widget here.
- **Logo import is best-effort** (SVG attachment support varies). If it warns and skips, set the logo by hand in Global settings; the page still seeds.
- I couldn't run this against a licensed instance, so treat the first run as the real test — errors will name the offending field and are quick to fix.

## Let Claude Code do it
From the repo root:
> Install the `fitness-seed` module (in `./fitness-seed`) into `backend/sites/modules/`, register `'fitness-seed': {}` in `backend/sites/index.js`, then run `node app fitness-seed:home` for all ten brands in `SETUP-AND-RUN.md`. Do `cadence` first and confirm `http://cadence.localhost:4321` renders before the rest. Fix the task if any field is rejected.
