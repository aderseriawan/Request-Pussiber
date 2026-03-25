# Request-Pussiber

Social Media Threat Monitoring Dashboard built with Nuxt 3 + TypeScript.

This project monitors threat signals from X (Twitter) and Instagram, then renders operational intelligence in tabs: Ringkasan, Agenda Demo, Twitter Feed, Instagram Monitor, Analisis Ancaman, and Rekomendasi.

## Key Features

- Nuxt 3 app with TypeScript, Tailwind CSS, Pinia, Chart.js, and Vitest.
- Internal API routes:
  - `server/api/twitter.ts`
  - `server/api/instagram.ts`
- Dummy-first mode (`NUXT_USE_DUMMY_ONLY=true`) so UI always runs locally.
- Full dashboard tabs matching reference workflow:
  - `Ringkasan`
  - `Agenda Demo`
  - `Twitter Feed`
  - `Instagram Monitor`
  - `Analisis Ancaman`
  - `Rekomendasi`
- Interactive relationship graph in Threat Analysis:
  - Node click -> detail panel
  - Zoom in/out
  - Pan canvas
  - Drag nodes
  - Edge highlight for focused node

## Tech Stack

- Nuxt 3
- Vue 3 + TypeScript
- Tailwind CSS
- Chart.js + vue-chartjs
- Pinia
- Vitest + @testing-library/vue

## Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create `.env` from `.env.example`:

```bash
NUXT_USE_DUMMY_ONLY=true
NUXT_X_BEARER_TOKEN=
NUXT_X_API_BASE=https://api.x.com/2
NUXT_INSTAGRAM_ACCESS_TOKEN=
NUXT_INSTAGRAM_API_BASE=https://graph.instagram.com
NUXT_INSTAGRAM_BUSINESS_ID=
```

### 3) Run locally

```bash
npm run dev
```

### 4) Test and build

```bash
npm run test
npm run build
```

## Data Modes

- `NUXT_USE_DUMMY_ONLY=true`
  - Server always returns deterministic dummy data.
  - Best for development, demos, and UI verification.
- `NUXT_USE_DUMMY_ONLY=false`
  - Server tries live API first.
  - Falls back to dummy if token missing or request fails.

## Project Structure

- `assets/css/main.css`: global cyber-dark styling.
- `layouts/default.vue`: navbar, sidebar, theme control.
- `pages/index.vue`: tab orchestration and dashboard composition.
- `components/*`: all panels/charts/tables/graph UI.
- `composables/useThreatData.ts`: unified data orchestration.
- `stores/threat.ts`: watchlist/filter state.
- `utils/*`: typed models + API adapters.
- `server/api/*`: internal endpoints for Twitter and Instagram.
- `tests/*`: unit tests.

## Flow Documentation

Detailed system and operational flow is documented in:

- `docs/FLOW.md`

## Operational Notes

- This repository is configured for local-first development.
- Use API credentials only in local `.env` and never commit secrets.
- If you enable live mode, verify X/Instagram API terms and access scopes.
