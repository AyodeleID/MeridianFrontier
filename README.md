# Meridian Frontier

**Trade, Climate & the Developing Economy**, a live research dashboard by Ayodele Idowu.

A deliberately focused instrument covering the questions at the intersection of
trade, environmental, agricultural and development economics: deforestation and
the EUDR, the carbon,income tension, structural transformation, inequality. Not a
general stats portal, a tool built around one research identity.

## What it is

Three files, no build step, no backend, no API keys:
- `index.html`, structure
- `styles.css`, design
- `app.js`, data engine + charts

Every figure is fetched **live, in the browser**, from the World Bank Open Data API.
Nothing is hand-entered, nothing is cached on a server. A number on the page is exactly
as fresh as the World Bank publishes it (verified against data refreshed 2026-04-08).

## Structure

- **The questions**, 12 curated cards across five domains (Trade, Environment,
  Agriculture, Development, Macro), each tied to a real research question. Click one
  to load it live in the Explorer.
- **The Explorer**, 24 verified indicators grouped by domain × up to 6 economies,
  trend/latest toggle, year range, CSV export. Domain tag on every chart.
- **Relationships**, scatter one indicator against another for a single economy over
  time, with a Pearson r readout. Labelled descriptive, not causal, on purpose.
- **Live pulse**, eight world headline indicators fetched on load.

All 24 indicators were API-verified to return data. Four (Gini, inflation,
agricultural employment, fertilizer) are not computed at the World aggregate but
return full series for individual economies, which is how the themes use them; the
code shows a clear note if any series comes back empty.

## Deploy on GitHub Pages (5 minutes, you do this part)

Your account: https://github.com/AyodeleID
This is its **own** standalone site, separate from your personal site ayodeleid.com.

**Terminal:**
```bash
# 1. on github.com/AyodeleID: New repository, name it: meridian-frontier (leave it empty)
# 2. in the folder with the three files:
git init
git add index.html styles.css app.js
git commit -m "Meridian Frontier: live trade-climate-development dashboard"
git branch -M main
git remote add origin https://github.com/AyodeleID/meridian-frontier.git
git push -u origin main
# 3. repo > Settings > Pages > Source: main, /root > Save
```
Live at `https://ayodeleid.github.io/meridian-frontier/` in ~1 minute.

**No terminal:** create the `meridian-frontier` repo on github.com/AyodeleID, click
"uploading an existing file", drag in all three, commit, then Settings > Pages.

**Optional clean subdomain:** in Porkbun add a CNAME record `data` →
`ayodeleid.github.io`, then set Custom domain to `data.ayodeleid.com` in repo
Settings > Pages.

## Extending it

- Add an indicator: one line in the `INDICATORS` object in `app.js` (with its World
  Bank series code and a domain key). Verify it returns data first at
  data.worldbank.org.
- Add an economy: one line in `ECONOMIES`.
- Add a question card: one entry in `THEMES`.
- Add a second source (OWID CSVs are next-easiest): write a fetch function that maps
  that source into the same `{year: value}` shape the rest of the code expects. The
  World Bank is the launch source because it's the only major one with reliably open
  CORS for direct browser fetching.

## Honest limits

- Client-side only: a source that blocks CORS can't be fetched directly from the browser.
- World Bank is the sole source at launch. The "planned" tags on OWID and Comtrade are
  roadmap, not current claims.
- This is one person's research instrument, not a data portal with provenance tooling.
  It does a focused set of questions well rather than everything shallowly, which is
  the entire point.
