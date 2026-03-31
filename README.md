# Collaborative Dashboard Builder

A collaborative dashboard builder that combines a drag-and-drop analytics canvas, autosaved persistence, and lightweight realtime collaboration into a product-shaped full-stack demo.

## Live Demo

- Live app: [collaborative-dashboard-builder.vercel.app](https://collaborative-dashboard-builder.vercel.app/)

## Executive Summary

This project was built to demonstrate more than chart rendering. The goal was to show product-minded engineering across interaction design, backend persistence, and realtime behavior:

- A polished dashboard canvas with drag, resize, duplicate, selection, rename, and keyboard shortcuts
- Backend persistence with shareable URLs and debounced autosave
- Best-effort multiplayer collaboration with presence, remote cursors, selected-widget signals, and safe deferred remote updates
- A deliberately scoped collaboration model that feels live without overengineering into CRDT complexity

The result is a portfolio project that feels like an actual internal analytics product instead of a static chart gallery.

## Core Features

- Drag/resize dashboard grid with `react-grid-layout`
- Broad widget catalog across charts, KPI cards, ranked lists, insight panels, banners, and timeline-style feeds
- Widget configuration panel for title, type, and per-widget settings
- Global filters for date range and asset classes
- Debounced autosave with save-status feedback
- Shareable dashboard URLs via `/dashboards/:dashboardId`
- Realtime presence over WebSocket:
  - connected users indicator
  - live remote cursors
  - selected-widget signals and editing cues
- Remote saves auto-refresh clean tabs and defer on dirty tabs behind an explicit reload prompt
- Undo/redo support for local dashboard edits

## Technical Stack

- Frontend: React, TypeScript, Vite, Tailwind v4
- State: Zustand and TanStack Query
- Layout and charts: `react-grid-layout`, Recharts
- Backend: Fastify, Zod, PostgreSQL
- Realtime: `@fastify/websocket`
- Deployment target: Vercel + Render + Neon

## Architecture

The state model is intentionally split by responsibility so the UI stays responsive while persistence and collaboration remain understandable:

- **Ephemeral UI state**: Zustand for selected widget, panel state, and interaction flow
- **Persisted document state**: Fastify + Postgres for dashboard documents and shareable URLs
- **Derived state**: memoized transforms over seeded data and global filters
- **Presence state**: dedicated websocket room + Zustand store for users, cursors, and selected-widget signals

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

## Product And Systems Tradeoffs

This project intentionally optimizes for finish, clarity, and explainability:

- **Document persistence over a normalized schema**: whole-dashboard JSON is faster to iterate on and simpler to reason about for an MVP
- **Best-effort collaboration over strict merge correctness**: presence, editing signals, and deferred remote refresh add clear value without requiring CRDT/OT complexity
- **Last-write-wins persistence**: acceptable for a portfolio collaboration demo, but not positioned as fully conflict-safe realtime editing
- **Curated widget catalog over open-ended builder logic**: helps the app feel broader while keeping the UX coherent

These are deliberate choices I would call out in an interview, because they show scoping discipline rather than incomplete thinking.

## Local Setup

Requirements:

- Node 20+
- Docker Desktop for local Postgres

```bash
npm install
cp .env.example .env
docker compose up -d
npm run dev:full
```

Then open `http://localhost:5173`.

## Environment

Backend defaults:

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

## Demo Data

With the API running:

```bash
npm run seed:demo
```

This prints a dashboard URL you can share directly.

## Deployment

Recommended low-cost stack:

- Frontend: Vercel
- Backend + WebSockets: Render
- Database: Neon

Useful production endpoints:

- `GET /healthz`
- `GET /readyz`

Provider-specific guide:

- `docs/deploy-vercel-render-neon.md`

Included deployment files:

- `vercel.json`
- `render.yaml`
- `Dockerfile.api`

## Additional Project Notes

- Recruiter-facing narrative: `docs/portfolio-writeup.md`
- Deployment walkthrough: `docs/deploy-vercel-render-neon.md`
