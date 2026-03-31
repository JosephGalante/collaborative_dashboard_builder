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
- Multiple widget types across charts, KPI cards, ranked lists, insight panels, banners, and timeline-style feeds
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
- `HOST=0.0.0.0`
- `CORS_ORIGIN=http://localhost:5173`

Frontend deploy env:

- `VITE_API_BASE_URL=https://<api-domain>`
- `VITE_WS_BASE_URL=wss://<api-domain>`

## Scripts

- `npm run dev` - frontend only
- `npm run dev:api` - backend only
- `npm run dev:full` - frontend + backend
- `npm run seed:demo` - creates a polished demo dashboard via API
- `npm run lint` - eslint + server typecheck
- `npm run build:client` - production frontend build
- `npm run build:server` - production backend build to `dist-server`
- `npm run build` - production frontend + backend build
- `npm run start:api` - run compiled backend

## Seed a Demo Dashboard

With API running (`npm run dev:api` or `npm run dev:full`):

```bash
npm run seed:demo
```

It prints the created dashboard URL.

## Deployment Notes

Frontend:

- Deploy Vite static build (`dist`) to Vercel, Netlify, or Cloudflare Pages
- Set `VITE_API_BASE_URL=https://<api-domain>`
- Set `VITE_WS_BASE_URL=wss://<api-domain>` if websocket traffic is on a different origin than the page

Backend:

- Deploy the Fastify API separately to Render, Railway, Fly.io, or a container host
- Build command: `npm run build:server`
- Start command: `npm run start:api`
- Health endpoint: `GET /healthz`
- Readiness endpoint: `GET /readyz`
- Required env: `DATABASE_URL`
- Recommended env: `PORT`, `HOST`, `CORS_ORIGIN`

Container option:

- `Dockerfile.api` builds a production backend image
- Example:

```bash
docker build -f Dockerfile.api -t collaborative-dashboard-api .
docker run --env-file .env -p 3333:3333 collaborative-dashboard-api
```

Suggested rollout order:

1. Provision Postgres and set `DATABASE_URL`
2. Deploy backend and confirm `/healthz` and `/readyz`
3. Deploy frontend with `VITE_API_BASE_URL` and `VITE_WS_BASE_URL`
4. Run `npm run seed:demo` against the live API if you want a polished shareable demo link

## Tradeoffs

- **JSON persistence over normalized schema**: faster iteration, simpler API surface.
- **Best-effort realtime over strict collaboration correctness**: enough for portfolio demonstration without backend-heavy complexity.
- **Curated widget catalog over open-ended widget building**: keeps UX focused and finishable while still showing product breadth.

## Portfolio Write-up

Use `docs/portfolio-writeup.md` as the short recruiter-facing narrative and talking points.
