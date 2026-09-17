# MS Dhoni vs Gautam Gambhir — head-to-head comparison

A single-page, dependency-free static website comparing the careers of **MS Dhoni** and
**Gautam Gambhir** — Test, ODI, T20I and IPL numbers, captaincy records, trophy cabinets,
a career timeline and a ten-category scorecard.

Live site: see the Render URL on the repository's about section (or the deployment link).

## What's in here

| File | Purpose |
| --- | --- |
| `index.html` | Page shell and section markup |
| `styles.css` | All styling — dark editorial theme, responsive, no frameworks |
| `data.js` | **All the numbers.** Every stat, the scorecard and the sources live here |
| `app.js` | Renders the page from `data.js` (tabs, animated bars, tables, timeline) |
| `render.yaml` | Render Blueprint — deploy as a static site with one click |
| `research/` | Raw source material used to build the dataset (Wikipedia tables) |

No build step, no npm install, no CDN. Open `index.html` in a browser and it works.

## Running locally

```bash
# any static server works
python3 -m http.server 8099
# then visit http://127.0.0.1:8099
```

## Updating the numbers

Everything on the page is generated from the objects in `data.js`:

- `PLAYERS` — profile cards
- `FORMATS` — the four tabs (`test`, `odi`, `t20i`, `ipl`) and their batting/fielding figures
- `CAPTAINCY` — captaincy tables and win rates
- `TROPHIES` — trophy cabinets, with the role held for each title
- `SCORECARD` — the ten judged categories and who wins each
- `MOMENTS` — the career timeline
- `SOURCES` — the source list rendered in the footer section

Edit `data.js`, refresh, done. The tally in the scorecard section is computed from
`SCORECARD`, so it can never drift out of sync with the cards.

## Data & method

International career figures are final — both players have retired from international
cricket — and are taken from the career-statistics and captaincy tables on their
Wikipedia articles, which cite ESPNcricinfo scorecards. MS Dhoni's IPL totals are current
as of the 2026 season; Gautam Gambhir's IPL playing career ended in 2018.

The ten-category scorecard is an **editorial judgement** based on those numbers, not a
statistic. Reasonable people will score the close ones differently — that is part of the
point.

## Deploying

The site is static, so any static host works. On Render:

- **Type:** Static Site
- **Build command:** *(leave empty)*
- **Publish directory:** `.`

Or point Render at this repo as a Blueprint — `render.yaml` already describes exactly that.

## Disclaimer

Independent and unofficial. Not affiliated with the BCCI, the ICC, the IPL, or either
player.
