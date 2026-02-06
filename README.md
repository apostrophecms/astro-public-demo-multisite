# ApostropheCMS Assembly + Astro Hybrid Demo

> **Note:** This starter kit requires an ApostropheCMS Assembly license, which includes all Pro features. [View Assembly pricing](https://apostrophecms.com/pricing) or [contact us](https://apostrophecms.com/contact-us) to learn more about licensing options.
>
> **Hosting option:** ApostropheCMS provides turnkey hosting for Assembly + Astro projects, managing the infrastructure so you can focus on building. [Learn more](https://apostrophecms.com/hosting) and [contact us](https://apostrophecms.com/contact-us) to get started.

**Learn how to build modern websites with a headless CMS architecture** using ApostropheCMS multisite as your backend and Astro for lightning-fast frontend rendering. This demo shows you the complete integration pattern with working examples you can use immediately.

This repository serves as both a learning resource and starter template for building your own ApostropheCMS + Astro projects.

## Why This Architecture?

This hybrid approach combines:
- **Multisite Management** – Run multiple sites from one dashboard and one codebase
- **Structured content management** - ApostropheCMS provides an intuitive editing experience with in-context editing
- **Modern frontend performance** - Astro delivers optimal page load speeds with partial hydration
- **Developer flexibility** - Keep backend content modeling separate from frontend presentation
- **Production-ready patterns** - Demonstrates real-world integration including external API calls and blog functionality

**Perfect for:** Development teams evaluating headless CMS options, agencies building client sites, or developers learning modern web architecture patterns.

## What's Included

**Page Types:**
- Home page with customizable areas
- Default content page template
- Article index and show pages with working blog functionality

**Widgets:**
- Core content widgets (rich text, image, video, file)
- Marketing components (hero, button, card, price card)
- Article widget for content relationships
- GitHub PRs widget demonstrating external API integration

**Additional Features:**
- Component registry pattern for mapping backend modules to frontend templates
- Shared utilities for area configuration and link fields
- Complete development and deployment workflows

## Quick Start

### Prerequisites
- Node.js v22 or later
- MongoDB v6.0 or later ([setup guide](https://docs.apostrophecms.org/guide/development-setup.html))

### Installation

First, fork the [astro-public-demo-multisite](https://github.com/apostrophecms/astro-public-demo-multisite/) repo (give it a star while you're there).

Then:
```bash
git clone <your-repo-url>
cd astro-public-demo-multisite
npm run install
```

### Development

Then start both servers in separate terminals:

```bash
npm run dev-frontend
npm run dev-backend
```

Or run them manually by folder in separate terminals:

```bash
# Terminal 1 - Backend (port 3000)
cd backend && npm run dev

# Terminal 2 - Frontend (port 4321)
cd frontend && npm run dev
```

> NOTE: You can change the secret key that is used to communicate between the frontend and backend by setting the `APOS_EXTERNAL_FRONT_KEY` environment variable. By default, it is set to `dev` in the `dev` npm script, but you can change it to anything you like. 

### Create an Admin User

```bash
cd backend
node app @apostrophecms/user:add admin admin --site=dashboard
```

Visit `http://dashboard.localhost:4321` to see the dashboard and create new sites.

## Architecture

```
├── backend/               # ApostropheCMS headless multisite application
│   ├── dashboard/         # Multisite dashboard
│   ├── sites/             # Individual site configurations and modules
│   └── app.js             # Main configuration
├── frontend/              # Astro application
│   ├── src/
│   │   ├── pages/         # Single [...slug].astro catch-all route
│   │   ├── templates/     # Page type components
│   │   ├── widgets/       # Widget components
│   │   └── components/    # Reusable Astro components
│   └── astro.config.mjs
└── package.json           # Root scripts for running both projects
```

### How It Works

1. **Backend** (ApostropheCMS) defines content schemas, widgets, and page types
2. **Frontend** (Astro) renders content using mapped components
3. **Bridge** (`@apostrophecms/apostrophe-astro`) connects them, enabling in-context editing

This pattern allows you to maintain a clean separation between content modeling and presentation while still providing editors with a seamless editing experience.

### Component Registries

Templates and widgets are mapped by name in index files:

- `frontend/src/templates/index.js` - Maps page type names to Astro components
- `frontend/src/widgets/index.js` - Maps widget names to Astro components

Keys must match backend module names exactly (e.g., `'default-page'`, `'@apostrophecms/rich-text'`).

## Development Guide

> NOTE: For convinience, all modules are registered in `backend/sites/index.js`. In a real project, you would typically register modules in their respective site themes, using `backend/sites/lib/theme-{site-name}.js` (see `backend/sites/lib/theme-demo.js` for an example).

### Adding a New Widget

1. Create the widget module in `backend/sites/modules/{widget-name}/index.js`
2. Register it in `backend/sites/index.js`
3. Create the Astro component in `frontend/src/widgets/{WidgetName}.astro`
4. Add the mapping in `frontend/src/widgets/index.js`

### Adding a New Page Type

1. Create the page module in `backend/sites/modules/{page-name}/index.js`
2. Register it in `backend/sites/index.js` and add to `@apostrophecms/page` types
3. Create the template in `frontend/src/templates/{PageName}.astro`
4. Add the mapping in `frontend/src/templates/index.js`

### Using Areas in Templates

```astro
---
import AposArea from '@apostrophecms/apostrophe-astro/components/AposArea.astro';
const { page } = Astro.props;
---

<AposArea area={page.main} />
```

## Deployment

### ApostropheCMS Hosting (Recommended)

Zero-config deployment with automatic database provisioning, SSL, and asset optimization. [Learn more](https://apostrophecms.com/hosting)

### Self-Hosted

Deploy the backend and frontend separately:

**Backend:** Any Node.js host with MongoDB access (see [hosting docs](https://docs.apostrophecms.org/guide/hosting.html))

**Frontend:** Any SSR-capable host (Netlify, Vercel, Cloudflare Pages, etc.) with the `APOS_EXTERNAL_FRONT_KEY` environment variable set

## Production-Ready Starter Kits

This demo focuses on core integration patterns. For production projects with complete design systems and advanced features, check out:

- **[Apollo Starter Kit](https://github.com/apostrophecms/starter-kit-astro-apollo)** - Production-ready with Bulma design system
- **[Astro Essentials](https://github.com/apostrophecms/starter-kit-astro-essentials)** - Minimal foundation for custom designs

Need enterprise features like advanced permissions, automated translation, or document versioning? [Contact us](https://apostrophecms.com/contact-us) to learn about ApostropheCMS Pro.

## Resources

- [ApostropheCMS Documentation](https://docs.apostrophecms.org/)
- [Astro Documentation](https://docs.astro.build/)
- [apostrophe-astro Package](https://github.com/apostrophecms/apostrophe-astro)
- [ApostropheCMS + Astro Tutorial](https://docs.apostrophecms.org/tutorials/astro/apostrophecms-and-astro.html)
- [Discord Community](https://discord.com/invite/HwntQpADJr)

---

*Built by the ApostropheCMS team. [Star us on GitHub](https://github.com/apostrophecms) if this helps your project!*
