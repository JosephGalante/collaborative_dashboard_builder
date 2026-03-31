# Portfolio Write-up (Draft)

## Project

Collaborative Dashboard Builder

## What I built

I built a frontend-heavy dashboard product where users can compose analytics widgets on a drag-and-drop grid, configure each widget, apply global filters, and share dashboards by URL with autosaved persistence. I also implemented best-effort realtime collaboration signals (presence, live cursors, selected-widget cues) to make the product feel multiplayer without introducing heavyweight conflict-resolution infrastructure.

## Why this is interesting

- It demonstrates product-level UX decisions, not only isolated components.
- It balances interaction performance with persistence reliability.
- It shows explicit architectural tradeoffs instead of overbuilding backend complexity.

## Technical decisions and tradeoffs

1. **State separation**
   - Zustand for high-frequency UI/presence state.
   - API persistence + query/mutation orchestration for durable dashboard state.
   - Derived selectors/helpers for filtered chart views.

2. **Persistence model**
   - Dashboard JSON persisted as a single shape (`widgets`, `layouts`, `globalFilters`).
   - Faster iteration and simpler contracts than a fully normalized BI schema.

3. **Realtime model**
   - Presence and cursors are best-effort.
   - Selected-widget signals provide collaboration awareness.
   - Final write semantics remain last-write-wins.
   - Intentionally no CRDT/OT layer for this portfolio scope.

4. **Scope discipline**
   - Fixed widget set (line/bar/stat), no auth, no teams, no query builder.
   - Prioritized polished end-to-end flow over broad feature surface.

## Results

- Interactive dashboard composition flow works end-to-end.
- State survives refresh and route sharing.
- Two tabs can see each other online, with cursor and selection awareness.
- UX includes loading/skeleton states, keyboard actions, and save status feedback.

## What I would do next

- Broadcast dashboard mutations for optional true realtime state mirroring.
- Add screenshot/demo assets and deploy frontend + API.
- Add lightweight analytics/performance instrumentation for production tuning.
