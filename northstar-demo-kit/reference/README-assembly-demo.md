# Assembly Demo Kit — Northstar Fitness Collective

Everything you need to demo **Assembly** (ApostropheCMS multitenancy) with a believable multi-brand network: one parent franchisor plus nine studio-concept brands, each a separate tenant with its own logo, palette, and content — all from one shared codebase and widget library.

Everything here is fictional. Drop it straight into your demo instances.

## What's in this folder

| File / folder | What it is |
|---|---|
| `logos/*.svg` | Editable vector logos — 1 parent + 9 brands |
| `logos/*.png` | PNG exports of each logo (520×200) for quick drops |
| `logo-contact-sheet.html` | Open in a browser to preview all logos at once |
| `brand-kits.md` | Name, tagline, palette (hex), fonts, personality per brand |
| `page-content.md` | Ready-to-paste homepage copy, annotated by Assembly widget |
| `README-assembly-demo.md` | This file |

## The brands

| # | Brand | Concept | Tenant slug (suggested) |
|---|---|---|---|
| — | **Northstar Fitness Collective** | Parent / corporate | `northstar` |
| 1 | **Cadence** | Indoor cycling | `cadence` |
| 2 | **Emberflow** | Hot yoga | `emberflow` |
| 3 | **Ironhaus** | Strength & barbell | `ironhaus` |
| 4 | **Southpaw** | Boxing & kickboxing | `southpaw` |
| 5 | **Reform Room** | Reformer Pilates | `reform-room` |
| 6 | **Grit Lab** | HIIT & bootcamp | `grit-lab` |
| 7 | **Barre Theory** | Barre | `barre-theory` |
| 8 | **Unwind** | Stretch, mobility & recovery | `unwind` |
| 9 | **Wake** | Indoor rowing | `wake` |

## The demo story it tells

Each brand is a **tenant**: its own domain, theme tokens (palette + fonts from the brand kit), navigation, and content — all spun up from one shared codebase and one shared widget library. The Northstar corporate site is a tenant too.

The punchline for the audience: adding a tenth studio, or a second location of an existing one, is a new tenant — not a new codebase, not a fork, not a rebuild. That's the whole pitch of Assembly, shown rather than told.

Suggested demo beats:
1. Show the Northstar corporate site, then hop to Cadence and Emberflow — same platform, completely different look and voice.
2. Open the Assembly dashboard and show all ten tenants side by side.
3. Spin up an eleventh tenant live (a new location) to land the "scales without re-engineering" point.

## Notes on the assets

- Logos are hand-built SVG — fully editable (colors, text, spacing). Fonts use common system stacks so they render anywhere; swap in your real brand fonts if you take these further.
- Each logo is a tile with its own background so it reads well in the dashboard grid; strip the background `<rect>` if you want a transparent mark.
- Content copy is deliberately plain and specific — written to sound like real studios, not filler — so the demo doesn't look like lorem ipsum.
