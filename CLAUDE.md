# Project: Hospitality Multisite Demo

ApostropheCMS + Astro multisite demo for hospitality-as-a-service providers.
Two hotel brands are shipped as loadable fixtures: Azure Coast Resort (luxury
seaside) and Metro Loft Hotels (urban boutique).

Backend in `backend/`, frontend in `frontend/`.

## Development Tools

Reusable scripts live in `claude-tools/`. Use them instead of ad-hoc commands:

- `claude-tools/start-services.sh` — Start backend + frontend, wait until both are up
- `claude-tools/test-url.sh [URL]` — Quick HTTP test with error extraction from logs
- `claude-tools/check-logs.sh [lines]` — Show recent errors from backend/frontend logs
- `claude-tools/pw-test.mjs [URL] [--login] [--screenshot PATH]` — Playwright test with optional login

Fixture loader: `scripts/load-brand.mjs --brand azure-coast|metro-loft [--base-url http://host:3000]`.
It uploads images, creates rooms/offers/testimonials, ensures a /rooms page,
and rewrites the home page main area to a brand-appropriate layout.

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
- HTMX is loaded via `import htmx from "htmx.org"` in the main slug route; uses `hx-select` to extract `#room-results` from full page responses

## Hospitality-specific modules

Pieces: `room`, `offer`, `testimonial`.
Piece pages: `room-page` (with HTMX-filtered room index).
Widgets: `room` (featured rooms), `offer`, `testimonial`, `amenities` (icon
grid with inline SVG), `booking-cta` (check-in/out/guests/submit form).

Room filters on the index: roomType, view, bedConfiguration.
