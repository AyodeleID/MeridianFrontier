<div align="center">

# 🌍 Meridian Frontier

### Trade, Climate &amp; the Developing Economy

**A live research dashboard at the intersection of trade, environmental, agricultural and development economics.**

[![Live Site](https://img.shields.io/badge/live-meridianfrontier.ayodeleid.com-4cc9b0?style=for-the-badge)](https://meridianfrontier.ayodeleid.com)
[![Data Source](https://img.shields.io/badge/data-World%20Bank%20Open%20Data-6699cc?style=for-the-badge)](https://data.worldbank.org)
[![License](https://img.shields.io/badge/license-MIT-e9c46a?style=for-the-badge)](LICENSE)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chart.js&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat-square&logo=github&logoColor=white)
![No Backend](https://img.shields.io/badge/backend-none-81b29a?style=flat-square)

</div>

---

## Overview

Meridian Frontier is a deliberately focused instrument. It does not try to mirror the large general data portals; it covers the questions at the edge where trade, climate and development meet, and treats each one as a research question rather than a chart for its own sake. The themes include deforestation and the EU Deforestation Regulation, the carbon and income tension, structural transformation, and inequality.

Every figure is fetched **live, in the browser**, from the World Bank Open Data API. Nothing is hand entered and nothing is cached on a server. A number on the page is exactly as current as the World Bank publishes it.

> **Built by [Ayodele Idowu](https://ayodeleid.com)**, economist and data scientist.
> Specializations: Environmental, Agricultural, Trade, Development Economics and Econometrics.

---

## Architecture

The whole application is three static files served from a CDN. There is no server, no database and no API key. Data fetching happens client side at page load, which is why the site stays current with zero maintenance.

```
                          ┌──────────────────────────────────────────┐
                          │                BROWSER                    │
                          │                                           │
   ┌──────────────┐       │   ┌────────────┐    ┌─────────────────┐   │
   │  index.html  │──────▶│   │  app.js    │───▶│   Chart.js      │   │
   │  structure   │       │   │  engine    │    │   render layer  │   │
   └──────────────┘       │   └─────┬──────┘    └─────────────────┘   │
                          │         │                                 │
   ┌──────────────┐       │         │ fetch() at load                 │
   │  styles.css  │──────▶│         ▼                                 │
   │  design      │       │   ┌───────────────────────────────────┐   │
   └──────────────┘       │   │  state { indicator, countries,    │   │
                          │   │          range, view }            │   │
                          │   └───────────────────────────────────┘   │
                          └─────────────────────┬─────────────────────┘
                                                │ HTTPS (live)
                                                ▼
                                ┌───────────────────────────────┐
                                │    World Bank Open Data API    │
                                │   api.worldbank.org/v2/...     │
                                └───────────────────────────────┘
```

**Request flow.** A user action (pick an indicator, add an economy, click a theme) updates a single `state` object. The engine fires one `fetch()` per selected economy in parallel via `Promise.allSettled`, normalizes every response into a `{ year: value }` map, and hands the result to the Chart.js render layer. Failed series are isolated and reported in the chart footer rather than breaking the view.

---

## Features

| Module | What it does |
| :-- | :-- |
| **The Questions** | 12 curated cards across 5 domains, each tied to a real research question. Click one to load it live in the Explorer. |
| **The Explorer** | 24 verified indicators grouped by domain, compared across up to 6 economies. Trend and latest views, year range, CSV export, a domain tag on every chart. |
| **Relationships** | Scatter one indicator against another for a single economy over time, with a Pearson `r` readout. Labelled descriptive, not causal, by design. |
| **Live Pulse** | 8 world headline indicators fetched on load, with year over year deltas. |

---

## Domains &amp; coverage

| Domain | Sample indicators | Colour |
| :-- | :-- | :-- |
| 🔵 **Trade** | Trade openness, merchandise exports, FDI inflows, high tech exports | `#6699cc` |
| 🟢 **Environment** | CO₂ per capita, forest cover, renewables, PM2.5, protected areas | `#81b29a` |
| 🟡 **Agriculture** | Agriculture value added, agri employment, cereal yield, fertilizer use | `#e9c46a` |
| 🔴 **Development** | Extreme poverty, life expectancy, child mortality, electricity, internet | `#e07a5f` |
| 🟩 **Macro** | GDP growth, GDP per capita, inflation, Gini, unemployment | `#4cc9b0` |

> All 24 indicators are API verified to return data. Four (Gini, inflation, agricultural employment, fertilizer) are not computed at the World aggregate but return full series for individual economies, which is how the themes use them. The code shows a clear note in the chart footer if any series comes back empty.

---

## Tech stack

| Layer | Choice | Why |
| :-- | :-- | :-- |
| **Markup** | Vanilla HTML5 | No framework overhead for a single page. |
| **Styling** | Hand written CSS, Fraunces + IBM Plex Mono + Inter | A research instrument look, not a template. |
| **Charts** | Chart.js 4 (CDN) | Mature, dependency free, good interaction defaults. |
| **Data** | World Bank Open Data REST API | Open, no key, and the one major economic source with reliable CORS for direct browser fetching. |
| **Hosting** | GitHub Pages | Free static hosting, custom domain support, zero ops. |

---

## Run locally

No build step. Clone and open, or serve statically.

```bash
git clone https://github.com/AyodeleID/MeridianFrontier.git
cd MeridianFrontier

# option A: just open the file
open index.html

# option B: serve it (recommended, avoids any file:// quirks)
python3 -m http.server 8000
# then visit http://localhost:8000
```

You should see the Live Pulse ticker populate within a few seconds. That confirms the data layer is reaching the World Bank API from your machine.

---

## Deploy on GitHub Pages

```bash
# from the folder containing index.html, styles.css, app.js
git init
git add index.html styles.css app.js
git commit -m "Meridian Frontier: live trade-climate-development dashboard"
git branch -M main
git remote add origin https://github.com/AyodeleID/MeridianFrontier.git
git push -u origin main
```

Then in the repository: **Settings > Pages > Source: Deploy from a branch > `main` / `(root)` > Save.**

The site goes live at `https://ayodeleid.github.io/MeridianFrontier/` within about a minute.

### Custom subdomain (optional)

Served on its own subdomain, fully separate from the personal site at `ayodeleid.com`.

| Step | Where | Action |
| :-- | :-- | :-- |
| 1 | **Porkbun DNS** | Add a `CNAME` record. Host: `meridianfrontier`. Target: `ayodeleid.github.io`. TTL: `600`. |
| 2 | **Repo > Settings > Pages** | Set Custom domain to `meridianfrontier.ayodeleid.com`, Save. |
| 3 | **Repo > Settings > Pages** | Tick **Enforce HTTPS** once the certificate is issued. |

DNS propagation takes a few minutes to a couple of hours. The existing personal site records stay untouched, so `ayodeleid.com` keeps working throughout.

---

## Extending it

The data model is intentionally small, so adding to it is a one line change in most cases.

```js
// app.js -> INDICATORS object -> add one entry
'EN.GHG.CO2.PC.CE.AR5': {
  d: 'env',                       // domain key
  label: 'CO2 emissions per capita (t)',
  short: 'CO2/capita',
  fmt: 'num',
  hint: 'Carbon dioxide emissions per person, tonnes.'
}
```

| To add | Where | Note |
| :-- | :-- | :-- |
| **An indicator** | `INDICATORS` in `app.js` | Verify the series code returns data first at [data.worldbank.org](https://data.worldbank.org). |
| **An economy** | `ECONOMIES` in `app.js` | One line: ISO3 code plus display name. |
| **A question card** | `THEMES` in `app.js` | One entry: domain, title, question, indicator, country set. |
| **A new data source** | new fetch function | Map the source into the same `{ year: value }` shape the engine expects. Any open API with CORS support can plug in. |

---

## Roadmap

- [ ] CBAM and EUDR exposure overlays
- [ ] Downloadable chart images (PNG export)
- [ ] Shareable deep links that encode the current Explorer state
- [ ] Additional World Bank indicators as coverage expands

---

## Design notes &amp; honest limits

- **Client side only.** A source that blocks CORS cannot be fetched directly from the browser. That single constraint is why the World Bank is the launch source.
- **Single source by design.** The World Bank Open Data API is the sole source. It is open, requires no key, supports direct browser fetching, and refreshes automatically whenever the World Bank publishes new figures.
- **Descriptive, not causal.** The Relationships view reports correlation and says so. Co-movement is not identification, and the tool is built for asking better questions, not claiming effects.
- **A research instrument, not a data portal.** It does a focused set of questions well rather than everything shallowly. That focus is the entire point.

---

<div align="center">

**[ayodeleid.com](https://ayodeleid.com)** · Built by Ayodele Idowu

<sub>Data fetched live, client side. Figures belong to their publishers.</sub>

</div>
