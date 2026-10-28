# AGENTS.md — astro-public-demo-multisite

Machine-readable project brief for AI coding assistants. Facts and conventions only. For anything
not covered here — API details, options, edge cases — consult the docs:
https://apostrophecms.com/docs/

---

## Architecture

Apostrophe Assembly multisite with an Astro frontend, in an npm workspace (`backend`, `frontend`). `@apostrophecms-pro/multisite`, `@apostrophecms-pro/multisite-dashboard` and `@apostrophecms-pro/automatic-translation` require an Assembly license.

One backend process (port 3000) serves a **dashboard** site, which only creates and manages sites, and any number of **content sites**. Every content site runs the same code with its own database and content. The backend chooses the site from the request hostname. One Astro app (port 4321) renders every content site, and `@apostrophecms/apostrophe-astro` connects the two and enables in-context editing.

The backend owns all content schemas, widgets, page types and pieces. The frontend owns all public markup: backend modules do not render templates for visitors.

| Path | Role |
|---|---|
| `backend/app.js` | Settings shared by all sites: port, MongoDB URL, shortname prefix |
| `backend/sites/index.js` | Module configuration for every content site. Enable modules here, not in `app.js` |
| `backend/sites/modules/` | Content-site modules. `nestedModuleSubdirs: true` allows grouping in subfolders |
| `backend/sites/lib/` | Shared field config (`area.js`, `link.js`) and per-theme config (`theme-<value>.js`) |
| `backend/dashboard/index.js`, `backend/dashboard/modules/` | The dashboard's configuration and modules |
| `backend/themes.js` | The list of themes |
| `backend/domains.js` | Base domains per environment (`local`, `staging`, `prod`) |
| `backend/deployment/` | Build and migrate scripts, run for the dashboard and once per theme or site |

## Dev Commands

Run each from the project root, in its own terminal. There is no combined `npm run dev`.

```
npm run dev-backend    # ApostropheCMS, port 3000
npm run dev-frontend   # Astro, port 4321
```

Sites are reached through Astro by hostname: the dashboard at `http://dashboard.localhost:4321`, a content site at `http://<shortname>.localhost:4321`. Outside Chrome, each `*.localhost` hostname needs an `/etc/hosts` entry.

Command-line tasks run from `backend/` and must name a site: `--site=dashboard`, `--site=<hostname>` (e.g. `--site=company1.localhost`), or `--all-sites` for every content site except the dashboard.

```
node app @apostrophecms/user:add admin admin --site=dashboard
```

## Adding a Widget

1. Create `backend/sites/modules/my-widget/index.js` — set `extend: '@apostrophecms/widget-type'`, `options.label`, and `fields.add`.
2. Register in `backend/sites/index.js`: add `'my-widget': {}` to the `modules` object.
3. Create `frontend/src/widgets/MyWidget.astro`. Widget data arrives as `Astro.props.widget`.
4. Add the mapping in `frontend/src/widgets/index.js`: `'my': MyWidget`. The key is the widget type — the module name without the `-widget` suffix.
5. Add the widget to an area's `widgets` config (also by widget type: `'my': {}`) in the relevant backend schema (import from `backend/sites/lib/area.js` or inline).
6. If the widget needs client-side JavaScript, see **Client-Side Widget JavaScript** below — do not add an inline `<script>` to the `.astro` file.

The key in `index.js` must be the widget type exactly. A mismatch renders nothing; the only sign is a "Missing widget mapping for <type>" error in the frontend server log.

## Client-Side Widget JavaScript

**The rule:** a web component must be *registered* independently of whether its widget rendered on the page. `customElements.define()` writes to a single document-global registry, so registration was never a component-scoped concern to begin with.

Never put an inline `<script>` in a widget's `.astro` file. Astro hoists a component-scoped script into the page bundle only for components that server-render on that page. When an editor *adds* a widget in-context, Apostrophe injects the markup client-side, the script is not in the bundle, and the widget silently does nothing — with no console error.

Register at page level instead:

1. Put the class and its `customElements.define()` call in `frontend/src/widgets/MyWidget.ts`.
2. Add `import './MyWidget';` to `frontend/src/widgets/players.ts`.
3. `players.ts` is already loaded from the `endBody` slot in `frontend/src/pages/[...slug].astro`; nothing else is needed.

Prefer passing data to the element as a `data-` attribute, taken from the page or widget itself — schema fields, or relationship fields Apostrophe populates. apostrophe-astro re-renders through Astro on every edit-mode change, so data that arrives this way stays current.

Do not call an Apostrophe API route from a component's frontmatter. The backend chooses the site from the request's `Host` header, and neither `aposFetch` from `@apostrophecms/apostrophe-astro/helpers/server` nor plain `fetch` sends the site's hostname, so the call gets a 404 instead of reaching the site. `ArticleWidget.astro` makes such a call and renders no articles; do not copy it.

When a widget needs data from an API route, fetch it from the element in the browser with a relative URL (`/api/v1/...`). The request goes through Astro with the site's hostname, so it reaches the right site. `VideoWidget.ts` does this for oembed data. Keep the URL relative: an absolute backend URL loses the site's hostname and gets the same 404.

Registration of web components must be eager; the *implementation* behind it need not be. Everything `players.ts` imports ships on every page, so if it grows large, move the heavy code behind a dynamic `import()` inside `connectedCallback` and keep only the `customElements.define()` call at page level. Note that a dynamic import also stops Astro inlining the script into each page's HTML, making it a separately cached file instead.

## Layout Slots

Slot content is passed from `frontend/src/pages/[...slug].astro`, as children of `<AposLayout>` carrying a `slot` attribute. The available slots are `startHead`, `standardHead`, `extraHead`, `startBody`, `beforeMain`, `main`, `afterMain` and `endBody` — typically meta tags in `standardHead`, a site header in `beforeMain`, page content in `main`, a footer in `afterMain`, and page-level scripts in `endBody`.

`AposLayout` renders `beforeMain`, `main` and `afterMain` as siblings, with Apostrophe's `prependMain` / `appendMain` injections bracketing the `main` slot. A project wrapper like `<main>` belongs **inside** the `main` slot.

In this project each template in `frontend/src/templates/` renders its own `<main>`, so breadcrumbs and page titles can sit outside it. Do not wrap `<AposTemplate>` in `<main>` in `[...slug].astro`; give a new page template its own `<main>` instead.

Do not split an element's opening and closing tags across `beforeMain` and `afterMain` to wrap the main slot — Astro drops attributes on a closing tag, so the element closes early, the whole subtree lands in `beforeMain`, and the injections render outside it.

## Adding a Page Type

1. Create `backend/sites/modules/my-page/index.js` — set `extend: '@apostrophecms/page-type'` and `fields.add`.
2. Register in `backend/sites/index.js`: add `'my-page': {}` to the `modules` object.
3. Add to the `types` array in `backend/sites/modules/@apostrophecms/page/index.js` so editors can select it.
4. Create `frontend/src/templates/MyPage.astro`. Page data arrives as `Astro.props.page`.
5. Add the mapping in `frontend/src/templates/index.js`: `'my-page': MyPage`.

## Themes

Each site has one theme, chosen in the dashboard. Themes are listed in `backend/themes.js`; this project ships `demo`.

- A theme's `value` is a permanent shortname. Do not change it once a site uses it.
- Each theme has `backend/sites/lib/theme-<value>.js`, which receives `(site, config)` and can enable or configure modules for sites using that theme.
- Adding a theme means adding both the `themes.js` entry and its `theme-<value>.js` file. The backend build compiles assets once per listed theme.
- Themes change backend modules and configuration only. All sites share one Astro frontend.

## Dashboard

The dashboard manages sites and nothing else. Each content site is a piece of the `site` type, configured in `backend/dashboard/modules/site/index.js` with `themes` and `baseUrlDomains` (from `backend/domains.js`). Do not add content features to the dashboard.

## The `_` Prefix Convention

Fields starting with `_` are relationship fields. Apostrophe populates them at request time and returns them as **arrays**, even when `max: 1`.

```js
// Relationship fields are populated at request time and returned as arrays; [0] gets the first result.
const image = widget._image?.[0];        // first image from a max:1 relationship
const author = article._authors?.[0]?.title;
```

## Filter and Pagination URLs

`backend/sites/modules/@apostrophecms/url` sets `static: true`, so piece-page filters and pages are **paths**,
not query strings: `/articles/categories/news/page/2`, not `/articles?categories=news&page=2`.

- Filters are declared in `piecesFilters` on `backend/sites/modules/article-page/index.js` (`categories`,
  `authors`). Each arrives in `aposData.filters`, with a `_url` and `active` flag per choice.
- Build filter and pager paths with `getChoiceFilter(name, value, page)` and `getPageFilter(page)` from
  `frontend/src/utils/filters.js`; don't build these URLs yourself. Append the result to a page's `_url`
  or a piece's `_parentUrl`. Never use `_parentSlug`: it lacks the locale prefix (`/fr`, `/de`).
- A static URL expresses one filter at a time.

## Article Authors

Articles credit **`author` pieces** through `_authors` (coauthors allowed), never users.
An author is a byline and may have no user account at all.

- `author` is `localized: false`: one author per person, shared by every locale.
- A user links to at most one author through their own `_author` field, which admins can set.
- `apos.author.ensureForUser(user)` returns that author, creating and linking a new one if the
  user has none or theirs was archived or deleted.
  It runs when a user starts a new article (the default `_authors`) and whenever they save one.
- A user's display name change is copied to their author unless `syncUserName: false`. Nothing
  else syncs, and archiving a user leaves their author untouched.
- Render bylines with `frontend/src/components/Byline.astro`, which joins names per locale.
- Do not add relationships to `@apostrophecms/user` for anything visitors see.

## Shared Field Utilities — Backend (`backend/sites/lib/`)

- **`lib/link.js`** — Canonical link field set (`linkType`, `_linkPage`, `_linkFile`, `linkUrl`, `linkTarget`). Spread with `...linkConfig.link` into any schema needing a link. Do not copy these fields manually.
- **`lib/area.js`** — Exports `basicConfig`, `fullConfig`, `fullConfigExpandedGroups`. Import the right one for each area's `widgets` option.

## Frontend Utilities

**`frontend/src/utils/link.js`** — Canonical link resolution. Always use these; do not navigate `_linkPage[0]._url` manually.
- `getLinkPath(link)` — resolves a link object (page, file, or custom URL) to a URL string.
- `opensInNewTab(linkTarget)` — returns `true` if `linkTarget` is `['_blank']`.

```js
import { getLinkPath, opensInNewTab } from '../../utils/link.js';
const href = getLinkPath(widget);          // works for all three linkType values
const newTab = opensInNewTab(widget.linkTarget);
```

**`@apostrophecms/apostrophe-astro/lib/attachment.js`** — Canonical image helpers. Use these for all image rendering; do not navigate `widget._image[0].attachment` manually. See `ImageWidget.astro` for the reference implementation.
- `getAttachmentUrl(imageObj)` — returns the image URL.
- `getAttachmentSrcset(imageObj)` — returns a `srcset` string for responsive images.
- `getFocalPoint(imageObj)` — returns an `object-position` CSS value (e.g. `"40% 60%"`).
- `getWidth(imageObj)` / `getHeight(imageObj)` — return intrinsic dimensions for layout shift prevention.

```js
// Image helpers from the integration package — use these instead of navigating widget._image[0].attachment manually.
import { getAttachmentUrl, getAttachmentSrcset, getFocalPoint, getWidth, getHeight }
  from '@apostrophecms/apostrophe-astro/lib/attachment.js';

const imageObj = widget._image?.[0];
const src = getAttachmentUrl(imageObj);
const srcset = getAttachmentSrcset(imageObj);
```

## AposArea

```astro
---
// AposArea renders a CMS-editable widget sequence. The matching field is defined in the backend schema.
import AposArea from '@apostrophecms/apostrophe-astro/components/AposArea.astro';
const { page } = Astro.props;
---
<AposArea area={page.main} />
```

## i18n Key Convention

The project uses the `project:` namespace by default: `label: 'project:myField'`.
Translations live in `backend/sites/modules/@apostrophecms/i18n/i18n/project/`.
Add keys there or introduce your own namespace with a matching folder under `i18n/`.

## Component Registries

```
frontend/src/templates/index.js   Maps page type names → Astro components
frontend/src/widgets/index.js     Maps widget names → Astro components
```

Template keys must match the page type's backend module name exactly. Widget keys must match the widget type: the backend module name without the `-widget` suffix (e.g. module `@apostrophecms/rich-text-widget` → key `'@apostrophecms/rich-text'`, module `hero-widget` → key `'hero'`). A wrong widget key renders nothing, with no browser console error — the only sign is a "Missing widget mapping for <type>" error in the frontend server log. A wrong template key silently falls back to the `apos-no-template` template if one is mapped.

## Project Constraints

- Do not change existing HTML class names — they are tied to existing SCSS.
- Do not rename or alter field names in `backend/sites/lib/link.js` — widget components and frontend utils depend on them.
- `card-title-rt` and `card-content-rt` reuse `RichTextWidget` in the registry intentionally — they are inline rich-text variants.
- Widget visual variants use the widget's `styles` property in `index.js`, not `select` schema fields for appearance.
- Frontend is presentation-only — never change backend schemas from the frontend side.

## Further Reading

- ApostropheCMS + Astro: https://docs.apostrophecms.org/tutorials/astro/apostrophecms-and-astro.html
- Apostrophe Assembly: https://apostrophecms.com/assembly

## Team Conventions

<!-- Add your team's own conventions below. Keep entries as facts, file paths and rules. -->
