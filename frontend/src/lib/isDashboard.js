// The Astro front end serves every hostname in the project, the multisite
// dashboard included, through the same `[...slug].astro` page. Anything that
// page renders unconditionally therefore shows up on the dashboard too, even
// though the dashboard is not one of the tenant sites and has none of their
// content or styling behind it.
//
// The dashboard is reached at `dashboard.<domain>` (see backend/domains.js and
// the shortName-based hostname convention multisite uses). If a project
// overrides the dashboard's short name, this is the single place to adjust.
export default function isDashboard(url) {
  const { hostname } = url;
  return hostname === 'dashboard' || hostname.startsWith('dashboard.');
}
