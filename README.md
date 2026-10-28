# ApostropheCMS Assembly Multisite + Astro Demo

> **Important Notice**
>
> This project uses the `@apostrophecms-pro/multisite`,
> `@apostrophecms-pro/multisite-dashboard` and
> `@apostrophecms-pro/automatic-translation` modules, which require an
> Apostrophe Assembly license. To obtain a license, visit
> [apostrophecms.com/assembly](https://apostrophecms.com/assembly) or contact the
> Apostrophe team. If you want a license-free starting point instead, see the
> open-source [ApostropheCMS + Astro starter kits](https://apostrophecms.com/starter-kits).

## Purpose

This repository is a working multisite project you can run locally to evaluate
Apostrophe Assembly with Astro as the frontend. One codebase serves:

* A **dashboard** site whose only job is to create and manage the other sites.
* Any number of **content sites**, all sharing the same code but with independent
  databases and content, rendered by Astro with full in-context editing.

It also serves as example code for organizing a multisite + Astro project and for
writing your own page types, piece types and widgets.

## How this project is organized

The repository is an npm workspace with two packages:

* `backend/`: an ApostropheCMS Assembly multisite project. It manages content
  for all of the sites and provides the editing UI.
* `frontend/`: a single Astro application that renders the pages of **every**
  content site. It forwards each request, including its `Host` header, to the
  backend, which works out which site is meant from the hostname.

In a normal single-site Apostrophe project, you configure modules in `app.js`. In
a multisite project the backend is laid out differently:

| Path | Role |
| --- | --- |
| `backend/app.js` | Top-level configuration shared by **all** sites (port, database URL, shortname prefix, session secret, etc.). |
| `backend/sites/index.js` | The equivalent of a single-site project's `app.js`: module configuration for your content sites. |
| `backend/sites/modules/` | Project-level modules for your content sites (the equivalent of a single-site `modules/`). |
| `backend/sites/lib/` | Shared helpers (area and link field configuration) and the per-theme configuration files. |
| `backend/dashboard/index.js`, `backend/dashboard/modules/` | The same idea, for the management dashboard. |
| `backend/domains.js` | Base domains for each environment (`local`/`staging`/`prod`), used to build site hostnames. |
| `backend/themes.js` | The list of available site themes. |
| `backend/deployment/` | Build and migration scripts that run once for the dashboard and once per theme or site. |

### Prerequisites
- Node.js v22.19 or later
- MongoDB v6.0 or later ([setup guide](https://docs.apostrophecms.org/guide/development-setup.html))
And the frontend:

```
frontend/
├── src/
│   ├── pages/[...slug].astro   # Single catch-all route, for every site
│   ├── templates/              # Page type components + index.js registry
│   ├── widgets/                # Widget components + index.js registry
│   └── components/             # Reusable Astro components
└── astro.config.mjs            # apostrophe-astro integration settings
```

In all other respects, development is ordinary ApostropheCMS + Astro development.
If you are new to these, start with the
[ApostropheCMS documentation](https://apostrophecms.com/docs) and the
[ApostropheCMS + Astro tutorial](https://docs.apostrophecms.org/tutorials/astro/apostrophecms-and-astro.html).

## First steps: before you start it up

### Set your shortname prefix

In `backend/app.js`, `shortNamePrefix` defaults to `astro-public-demo-multisite-`
(you can also set the `SHORTNAME_PREFIX` environment variable). Change it to a
unique string for your project, conventionally your repo name followed by `-`.
This prefixes the MongoDB database names so they don't collide with other
Assembly projects in development.

> If you self-host on a low-end MongoDB Atlas cluster (below M10), keep the prefix
> under 12 characters before the `-`.

### Configure your domains

Edit `backend/domains.js` so the values match your real domains. Leave `local`
set to `localhost:4321`: that is the **Astro** dev server, because visitors and
editors always reach the sites through the frontend. `staging` and `prod`
are placeholders (`staging.example.com`, `example.com`). Replace them with real
domains backed by a wildcard DNS record and a wildcard TLS certificate if you
self-host.
The first key in the object is treated as the local development environment.

Each site you create gets a **shortname** and is automatically reachable as a
subdomain of every configured domain (e.g. `company1.localhost:4321`,
`company1.staging.example.com`).

### Set the dashboard shortname (optional)

By default the dashboard lives on the `dashboard` subdomain. Override it with
`dashboardShortName` in `backend/app.js` (or the `APOS_DASHBOARD_SHORTNAME`
environment variable).

### Change the secrets

Before any real deployment, replace the placeholder secrets with your own random
strings:

* `sessionSecret` in `backend/app.js` (currently `CHANGEME`). This one secret
  signs sessions for every site.
* `session.secret` in `backend/dashboard/modules/@apostrophecms/express/index.js`
  (currently `undefined`)
* `disabledFileKey` in
  `backend/dashboard/modules/@apostrophecms/uploadfs/index.js` (currently
  `CHANGEME`; used to disable access to files in the local uploads backend)
* `APOS_EXTERNAL_FRONT_KEY`, which the backend and frontend must share. The `dev`
  scripts set it to `dev`; use a real secret in production.

## Requirements for local development

* Node.js v22 or later (v24 recommended)
* MongoDB v7.0 or later (v8.0 recommended)

See the Apostrophe
[development setup guide](https://apostrophecms.com/docs/guide/development-setup.html)
for details. The backend connects to `mongodb://localhost:27017` unless you set
`APOS_MONGODB_URI`.

### `/etc/hosts`

Because this project serves multiple hostnames, subdomains must resolve to your
machine. **In Chrome only, every `*.localhost` subdomain already resolves to
127.0.0.1**, so you can skip this at first. In other browsers, add an entry per
site you test, for example:

```
127.0.0.1 dashboard.localhost company1.localhost
```

## Starting up in development

First, fork the
[astro-public-demo-multisite](https://github.com/apostrophecms/astro-public-demo-multisite/)
repo (give it a star while you're there). Then:

```bash
git clone <your-repo-url>
cd astro-public-demo-multisite
# Be sure to use "npm update" the first time, and periodically, to ensure you don't
# get an old release
npm update
```

Automatic translation with DeepL is optional. To turn it on, also set your DeepL API key:

```bash
export APOS_DEEPL_API_SECRET=your-deepl-key
```

Then start both servers:
Add an admin user to the **dashboard** site (it manages all the others). You'll be
prompted for a password:

```bash
cd backend
node app @apostrophecms/user:add admin admin --site=dashboard
```

> When running command-line tasks in a multisite project you must always say which
> site you mean. Use `--site=dashboard` for the dashboard, any of a site's valid
> hostnames for an individual site (e.g. `--site=company1.localhost`), or
> `--all-sites` to run a task on every site except the dashboard. Run these tasks
> from the `backend` folder.

Start the backend and the frontend in two terminals, from the project root:

```bash
# Terminal 1: ApostropheCMS backend (port 3000)
npm run dev-backend

# Terminal 2: Astro frontend (port 4321)
npm run dev-frontend
```

Both `dev` scripts set `APOS_EXTERNAL_FRONT_KEY=dev` for you.

Then visit:

```
http://dashboard.localhost:4321/login
```

Log in with the admin account you just created. From the **Sites** menu in the
admin bar, add a new site. Sites are Apostrophe pieces in the dashboard:

* Give it a distinct **shortname** such as `company1`.
* Fill in the site's **admin password** field. This provisions an `admin` user on
  the new site.

After saving, log into the site directly:

```
http://company1.localhost:4321/login
```

Create `company2`, `company3`, and so on. The code is shared, but each site's
database and content are independent.

> Logged out, you'll only see content that has been published on a site.

## Site development

### Backend

Put the backend code for your content sites in `backend/sites/`, exactly as you
would in a single-site project's `app.js` and `modules/`. Backend modules define
schemas, fields and behavior only: all public-facing markup is written as Astro
components in `frontend/src`, not as templates in the backend.

* Configure and enable modules in `backend/sites/index.js`.
* Add project modules under `backend/sites/modules/`.

This project sets `nestedModuleSubdirs: true`, so modules can be grouped in
subfolders. It also installs and configures `@apostrophecms/blog`,
`@apostrophecms/seo`, `@apostrophecms/open-graph`, `@apostrophecms/favicon`,
`@apostrophecms/import-export` and `@apostrophecms-pro/automatic-translation`.
See `backend/sites/index.js`. Automatic translation uses DeepL and needs the
`APOS_DEEPL_API_SECRET` environment variable.

### Frontend

The Astro app renders pages for every content site. Backend page types and
widgets are mapped to Astro components by name in two registries:

* `frontend/src/templates/index.js`: maps page type names to Astro components
* `frontend/src/widgets/index.js`: maps widget names to Astro components

Keys must match backend module names exactly (e.g. `'default-page'`,
`'@apostrophecms/rich-text'`).

### Adding a new widget

1. Create the widget module in `backend/sites/modules/{name}-widget/index.js`
2. Enable it in `backend/sites/index.js`
3. Create the Astro component in `frontend/src/widgets/{Name}Widget.astro`
4. Add the mapping in `frontend/src/widgets/index.js`

### Adding a new page type

1. Create the page module in `backend/sites/modules/{page-name}/index.js`
2. Enable it in `backend/sites/index.js` and add it to the `types` option in
   `backend/sites/modules/@apostrophecms/page/index.js`
3. Create the template in `frontend/src/templates/{PageName}.astro`
4. Add the mapping in `frontend/src/templates/index.js`

### Using areas in templates

```astro
---
import AposArea from '@apostrophecms/apostrophe-astro/components/AposArea.astro';
const { page } = Astro.props;
---

<AposArea area={page.main} />
```

### Provided example modules

`backend/sites/modules` contains example code you can adapt or delete, including
widgets (`hero-widget`, `card-widget`, `price-card-widget`, `button-widget`,
`article-widget`, `github-prs-widget`, plus layout widgets) and piece and page
types (`article`, `article-category`, `author`, `article-page`,
`default-page`), each with matching Astro components in `frontend/src`.

#### GitHub PRs widget token

`github-prs-widget` renders pull requests from a GitHub repository (it defaults to
`apostrophecms/apostrophe`). It is just a code example and you don't have to keep
it. If you do, be aware that unauthenticated GitHub API requests are
rate-limited. To raise the limit, supply a personal access token as a module
option in `backend/sites/index.js`:

```js
'github-prs-widget': {
  options: {
    token: process.env.GITHUB_TOKEN
  }
}
```

## Themes

Each site selects a single theme in the dashboard. This project ships one theme,
`demo`, listed in `backend/themes.js`:

```js
export default [
  {
    value: 'demo',
    label: 'Demo'
  }
];
```

A theme `value` is a permanent shortname and must not change once in use. Each
theme has a matching `backend/sites/lib/theme-<value>.js` file that can enable
extra modules or adjust configuration for sites using that theme. For `demo`,
that's `backend/sites/lib/theme-demo.js`, which enables the (empty) `theme-demo`
module.

To add a theme, add an entry to `themes.js` and create the corresponding
`sites/lib/theme-<value>.js`. Keeping `themes.js` accurate matters because the
backend build compiles assets once per listed theme.

Note that the site's public-facing markup and styles come from the Astro
frontend, which all sites share. A backend theme controls which modules and
configuration a site gets. It does not change the Astro components by itself.

For best results, avoid creating one theme per site. Themes are meant for groups
of sites with similar feature requirements.

## Dashboard development

The dashboard exists only to manage sites, so it doesn't need to be
public-facing. It is extended just like a content site, but its code lives in
`backend/dashboard/`. The key module is `site`
(`backend/dashboard/modules/site/index.js`), a piece type with one piece per
managed site. It is provided by `@apostrophecms-pro/multisite-dashboard` and
configured here with the available `themes` and the `baseUrlDomains`.

Site schema field values are passed to each site as the `site` object in
`backend/sites/index.js` (this is how the selected `theme` reaches each site). To
expose additional dashboard-controlled settings to sites, add fields to the `site`
piece and pass them through as module options in `backend/sites/index.js`.

## Accessing MongoDB for a specific site

A site's database name is the prefix followed by the site piece's `_id`, which is
awkward to look up. Utility tasks are provided. Run them from `backend/`:

```bash
# Mongo shell for the dashboard
node app mongo:mongo --site=dashboard
# Mongo shell for an individual site (use its hostname)
node app mongo:mongo --site=company1.localhost
# mongodump / mongorestore
node app mongo:mongodump --site=company1.localhost
node app mongo:mongorestore --site=company1.localhost -- --drop
```

`--` by itself marks the end of Apostrophe's options, so flags like `--drop` are
passed through to the underlying tool.

## Building and running for production

From the project root:

```bash
npm run build          # backend assets (dashboard + once per theme), then astro build
npm run migrate        # database migrations for the dashboard and all sites
npm run serve-backend  # in one process
npm run serve-frontend # in another
```

Set `APOS_EXTERNAL_FRONT_KEY` to the same secret value for both processes.

### Astro security configuration

Astro requires an `allowedDomains` entry in `frontend/astro.config.mjs` for
certain ApostropheCMS operations, including file uploads and logout, to work
correctly in production. Without it, those operations silently fail with a 403.
This does **not** affect local development.

Since every site is a subdomain of your configured domains, use a wildcard
matching your `staging` and `prod` domains from `backend/domains.js`. The
placeholder below matches the placeholder domains; replace it with your own:

```js
security: {
  allowedDomains: [
    { hostname: '**.example.com', protocol: 'https' }
  ]
}
```

This tells Astro to trust `X-Forwarded-Host` headers, which it uses to construct
the request origin for CSRF validation. Setting `checkOrigin: false` alone is
**not** sufficient. This requires `astro@5.14.2` or later.

## Hosting and deployment

We offer and recommend our hosting, which provides easy deployment via
`git push` and high availability, scalability and durability via AWS EC2, AWS S3
and MongoDB Atlas. Self-hosting is also fully supported, so reach out to us for
sample scripts. For production you must configure a cloud upload backend (such
as Amazon S3) and a managed MongoDB. **Do not** rely on the local filesystem for
uploads across multiple instances. Contact the Apostrophe Assembly team or see
the [Assembly documentation](https://apostrophecms.com/assembly) for current
hosting and deployment options.

## Resources

- [ApostropheCMS Documentation](https://docs.apostrophecms.org/)
- [Astro Documentation](https://docs.astro.build/)
- [apostrophe-astro Package](https://github.com/apostrophecms/apostrophe-astro)
- [ApostropheCMS + Astro Tutorial](https://docs.apostrophecms.org/tutorials/astro/apostrophecms-and-astro.html)
- [Discord Community](https://discord.com/invite/HwntQpADJr)
