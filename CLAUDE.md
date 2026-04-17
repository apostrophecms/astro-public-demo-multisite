# Project: Talent Acquisition Demo Multisite

ApostropheCMS + Astro multisite project. Backend in `backend/`, frontend in `frontend/`.

## Development Tools

Reusable scripts live in `claude-tools/`. Use them instead of ad-hoc commands:

- `claude-tools/start-services.sh` — Start backend + frontend, wait until both are up
- `claude-tools/test-url.sh [URL]` — Quick HTTP test with error extraction from logs
- `claude-tools/check-logs.sh [lines]` — Show recent errors from backend/frontend logs
- `claude-tools/pw-test.mjs [URL] [--login] [--screenshot PATH]` — Playwright test with optional login

When you find yourself repeating a task, add a tool to `claude-tools/` and reuse it.

## Key URLs

- Backend: http://localhost:3000
- Frontend: http://localhost:4321
- Test site: http://infraco.localhost:4321
- Credentials: admin / tomtest1
- API key: `myapikey` (configured in `@apostrophecms/express`)

## Architecture Notes

- `backend/sites/index.js` — shared site config, registers all modules
- `backend/sites/lib/area.js` — widget configurations (basicConfig, fullConfig, fullConfigExpandedGroups)
- `frontend/src/templates/index.js` — template component registry
- `frontend/src/widgets/index.js` — widget component registry
- The external front JSON response does NOT include `req.query`; use `Astro.url.searchParams` instead
- HTMX is loaded via `import htmx from "htmx.org"` in the main slug route; uses `hx-select` to extract `#job-results` from full page responses
