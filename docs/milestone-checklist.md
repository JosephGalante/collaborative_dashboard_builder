# Milestone Checklist

This is the operational build checklist to execute directly.

## Milestone 1: App foundation

Goal: shell and architecture baseline.

- [ ] Create Vite React TypeScript app
- [ ] Add Tailwind
- [ ] Add Zustand, TanStack Query, React Grid Layout, Recharts
- [ ] Set up routing
- [ ] Create `DashboardPage`
- [ ] Build app shell
- [ ] Define all shared TS types
- [ ] Create seed dataset file
- [ ] Create widget registry file
- [ ] Create dashboard store skeleton
- [ ] Create presence store skeleton

Exit criteria: static shell and clean structure.

## Milestone 2: Grid layout and static widget cards

Goal: interactive canvas without charts.

- [ ] Integrate `react-grid-layout`
- [ ] Render widget cards from Zustand
- [ ] Implement `addWidget`
- [ ] Implement `removeWidget`
- [ ] Implement `selectWidget`
- [ ] Implement drag/resize behavior
- [ ] Persist changed layouts in Zustand on drag-stop/resize-stop
- [ ] Add selected widget visual state
- [ ] Add empty dashboard state

Exit criteria: add/move/resize/select/remove cards.

## Milestone 3: Real chart widgets

Goal: turn cards into meaningful visuals.

- [ ] Implement `LineChartWidget`
- [ ] Implement `BarChartWidget`
- [ ] Implement `StatCardWidget`
- [ ] Build `WidgetCard` chrome wrapper
- [ ] Render by `type` via registry
- [ ] Feed seeded data into widgets
- [ ] Add loading and no-data widget states

Exit criteria: dashboard looks demoable.

## Milestone 4: Widget settings panel

Goal: editable selected widget config.

- [ ] Build `RightConfigPanel`
- [ ] Show widget settings when selected
- [ ] Allow title edit
- [ ] Allow widget type edit
- [ ] Allow config edits by widget type
- [ ] Keep temporary form inputs local where useful
- [ ] Commit changes into Zustand cleanly

Exit criteria: selected widget settings update live.

## Milestone 5: Global filters and derived data

Goal: reactive dashboard-wide filtering.

- [ ] Build `GlobalFiltersPanel`
- [ ] Implement date range UI
- [ ] Implement asset class multi-select
- [ ] Write pure filtering helpers
- [ ] Write widget-specific data derivation helpers
- [ ] Memoize expensive transforms
- [ ] Ensure all widgets react correctly

Exit criteria: filter changes update all widgets correctly.

## Milestone 6: Backend persistence

Goal: refresh-safe and shareable dashboards.

- [ ] Create backend app
- [ ] Add Zod validation
- [ ] Create `dashboards` table
- [ ] Implement `POST /api/dashboards`
- [ ] Implement `GET /api/dashboards/:id`
- [ ] Implement `PUT /api/dashboards/:id`
- [ ] Build frontend API helpers
- [ ] Add dashboard creation flow
- [ ] Load dashboard by route param
- [ ] Hydrate Zustand from fetched dashboard
- [ ] Implement autosave debounce
- [ ] Add save status UI

Exit criteria: refresh and URL sharing work.

## Milestone 7: Polish pass

Goal: portfolio quality finish.

- [ ] Improve spacing and typography
- [ ] Add hover states
- [ ] Add selected states
- [ ] Add skeleton/loading placeholders
- [ ] Add duplicate widget action
- [ ] Add keyboard delete for selected widget
- [ ] Add inline dashboard rename
- [ ] Add save status messaging
- [ ] Improve empty states
- [ ] Tighten right panel UX
- [ ] Tighten left sidebar UX

Exit criteria: app feels intentional and polished.

## Milestone 8: Presence

Goal: connected-user visibility.

- [ ] Create websocket server
- [ ] Add room join message
- [ ] Track connected users by dashboard ID
- [ ] Broadcast join/leave events
- [ ] Build `useDashboardSocket` hook
- [ ] Sync presence snapshot into `presenceStore`
- [ ] Render connected user avatars/chips
- [ ] Add connection status indicator

Exit criteria: two tabs show both users.

## Milestone 9: Live cursors

Goal: realtime cursor movement.

- [ ] Track local mouse position relative to canvas
- [ ] Throttle outgoing cursor events
- [ ] Broadcast cursor updates over websocket
- [ ] Update `presenceStore` with remote positions
- [ ] Render `CursorLayer`
- [ ] Render labeled `RemoteCursor`
- [ ] Ignore stale cursor updates after timeout
- [ ] Isolate cursor layer from widget rerenders

Exit criteria: smooth cursor visibility across clients.

## Milestone 10: Selected-widget presence

Goal: light collaboration semantics.

- [ ] Broadcast selected widget ID on selection change
- [ ] Render remote selection outlines/badges
- [ ] Show "X is editing this" message
- [ ] Add soft-lock messaging in config panel
- [ ] Keep write semantics last-write-wins

Exit criteria: shared editing feels thoughtful.

## Milestone 11: Deploy and package

Goal: portfolio-ready delivery.

- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Seed polished demo dashboard
- [ ] Write README overview + architecture + tradeoffs
- [ ] Record demo video or GIF
- [ ] Add screenshots
- [ ] Add portfolio write-up

Exit criteria: ready to share with recruiters.

## Recommended Prompt Sequence

1. Set up foundation, folder structure, shared types, app shell, placeholder dashboard page.
2. Implement dashboard store and grid canvas with add/select/remove/resize behavior.
3. Implement three widget types and registry with seeded data.
4. Implement right-side widget config panel and editable widget configuration.
5. Implement global filters and derived data helpers for date range and asset class.
6. Implement backend create/get/update routes, Zod validation, API helpers, and autosave.
7. Polish UI and add duplicate, keyboard delete, rename, and save status.
8. Implement websocket presence, live cursors, and selected-widget presence (best-effort).

## Scope Discipline Constraints

Repeat these constraints in implementation prompts:

- no auth
- no teams
- no multi-tenant model
- no CRDTs
- no query builder
- max three widget types
- client-side filtering
- backend persists dashboard JSON shape
- collaboration is best-effort presence, not correctness-heavy editing

## Persistence Tradeoff

Persisting `widgets`, `layouts`, and `globalFilters` as JSON on the dashboard row is the preferred choice for this project due to iteration speed and constrained backend scope.
