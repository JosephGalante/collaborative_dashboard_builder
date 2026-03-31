# Collaborative Dashboard Builder

Built a collaborative dashboard builder with drag-and-drop layout editing, chart/stat widgets, global filtering, autosaved persistence, and best-effort multiplayer presence (online users, remote cursors, selected-widget signals).

## Scope and Philosophy

This project intentionally stays frontend-led and scoped to finish:

- no auth or teams
- no multi-tenant model
- no query builder
- no CRDT / operational transform merge logic
- collaboration is best-effort presence + last-write-wins persistence

The backend stores dashboard JSON (`widgets`, `layouts`, `globalFilters`) for iteration speed.

## Features

- Drag/resize dashboard grid with `react-grid-layout`
- Three widget types:
  - line chart (`portfolioTimeseries`)
  - bar chart (`assetAllocation`)
  - stat card (`performanceStats`)
- Widget configuration panel (title/type/per-widget config)
- Global filters (date range + asset classes)
- Debounced autosave + save status messaging
- Shareable URL routing (`/dashboards/:dashboardId`)
- Realtime presence over WebSocket:
  - connected users indicator
  - live remote cursors
  - selected-widget presence UI and "is editing this" copy

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind v4
- State: Zustand (UI/presence), TanStack Query (server fetch/mutation)
- Charts: Recharts
- Layout: react-grid-layout
- Backend: Fastify + Zod + Postgres
- Realtime: `@fastify/websocket`

## Architecture

State is split by responsibility to keep interaction-heavy UI responsive:

- **Ephemeral UI state**: Zustand (`dashboardStore`)
- **Persisted server state**: Fastify + Postgres + TanStack Query
- **Derived state**: memoized filtering/transforms from seeded data
- **Presence room state**: dedicated Zustand store + websocket room

```mermaid
flowchart LR
  UI[React UI]
  DS[dashboardStore]
  PS[presenceStore]
  Q[TanStack Query]
  API[Fastify REST API]
  WS[Fastify WS room]
  DB[(Postgres dashboards)]

  UI <--> DS
  UI <--> PS
  UI --> Q
  Q --> API
  API --> DB
  UI <--> WS
  WS --> PS
```

## One-Command Local Setup

Requirements:

- Node 20+
- Docker Desktop (for Postgres)

```bash
npm install && docker compose up -d && npm run dev:full
```

Open `http://localhost:5173`.

## Environment

Copy `.env.example` to `.env` (or use defaults):

```bash
cp .env.example .env
```

Default API server env:

- `DATABASE_URL=postgres://postgres:postgres@localhost:5433/dashboards`
- `PORT=3333`

## Scripts

- `npm run dev` - frontend only
- `npm run dev:api` - backend only
- `npm run dev:full` - frontend + backend
- `npm run seed:demo` - creates a polished demo dashboard via API
- `npm run lint` - eslint + server typecheck
- `npm run build` - production build

## Seed a Demo Dashboard

With API running (`npm run dev:api` or `npm run dev:full`):

```bash
npm run seed:demo
```

It prints the created dashboard URL.

## Deployment Notes

- Frontend: deploy Vite static build (`dist`) to Vercel/Netlify/Cloudflare Pages
- Backend: deploy Fastify app to Fly.io/Render/Railway
- Provision Postgres and set `DATABASE_URL`
- Set frontend env:
  - `VITE_API_BASE_URL=https://<api-domain>`
  - optionally `VITE_WS_BASE_URL=wss://<api-domain>`

## Tradeoffs

- **JSON persistence over normalized schema**: faster iteration, simpler API surface.
- **Best-effort realtime over strict collaboration correctness**: enough for portfolio demonstration without backend-heavy complexity.
- **Three fixed widget types**: keeps UX focused and finishable.

## Portfolio Write-up

Use `docs/portfolio-writeup.md` as the short recruiter-facing narrative and talking points.
