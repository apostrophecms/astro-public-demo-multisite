# Backend

This is the ApostropheCMS Assembly multisite backend for this project. It manages
content for the dashboard and every content site; the Astro app in `../frontend`
renders the pages.

For setup, project layout and development instructions, see the
[main README](../README.md) at the root of this repository.

In brief, from the project root, run `npm run dev-backend` and `npm run dev-frontend`
in two terminals, then visit `http://dashboard.localhost:4321/login`. Sites are
always accessed through the Astro frontend on port 4321, not directly on port 3000.
