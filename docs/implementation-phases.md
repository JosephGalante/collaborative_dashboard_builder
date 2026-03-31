# Implementation Phases

## Phase 1: Foundation and app shell

Goal: static structure and visual baseline.

Deliver:

- Vite React setup
- Tailwind setup
- routing
- app shell layout
- dashboard page scaffold
- placeholder sidebars/canvas/panel
- spacing and theme conventions

Exit: polished static shell is visible.

## Phase 2: Dashboard canvas and grid

Goal: first interactivity.

Deliver:

- `react-grid-layout` integration
- widget cards on canvas
- drag/resize
- add/remove/select widget

Exit: full widget layout interaction with static shells.

## Phase 3: Widget rendering and charts

Goal: meaningful visuals.

Deliver:

- line chart widget
- bar chart widget
- KPI/stat card widget
- widget chrome states (hover/selected/menu/title)

Exit: demoable visual dashboard.

## Phase 4: Widget configuration panel

Goal: edit widget behavior.

Deliver right-panel controls:

- title
- type
- dataset
- x/y fields
- aggregation
- local filter override

Exit: selecting a widget opens real editable settings.

## Phase 5: Global filters and derived flow

Goal: dashboard-wide reactive data behavior.

Deliver:

- date range filter
- category filter
- filtered recomputation across all widgets
- derived helper layer

Exit: filters update all widgets quickly and correctly.

## Phase 6: Persistence and shareable URLs

Goal: product realism.

Deliver backend:

- create/get/update dashboard

Deliver frontend:

- save/load
- autosave with debounce
- save indicator
- dashboard rename
- shareable route

Exit: refresh and shared URL preserve state.

## Phase 7: UI polish pass

Goal: portfolio-level quality.

Deliver:

- hover/selected/empty states
- skeletons and save indicators
- spacing/chrome polish
- improved panel interactions
- keyboard delete
- duplicate widget

Optional:

- Framer Motion micro-animations

Exit: intentional, polished UX.

## Phase 8: Presence

Goal: multiplayer visibility.

Deliver:

- websocket room connection
- users list with colors
- avatars/chips
- connection status indicator

Exit: two windows can see connected users.

## Phase 9: Live cursors

Goal: biggest collaboration wow factor.

Deliver:

- local pointer tracking
- throttled cursor broadcast
- remote cursor rendering + labels
- bounded canvas coordinates

Tech notes:

- send updates every 50-100ms
- use throttling/requestAnimationFrame
- best-effort delivery

Exit: smooth mutual cursor visibility.

## Phase 10: Selected-widget presence

Goal: smart collaboration semantics.

Deliver:

- broadcast selected widget id
- show presence outline/badge
- show "is editing this" messaging
- optional soft-lock copy in UI

Exit: collaboration feels thoughtful without heavy syncing.

## Phase 11: Final hardening and packaging

Goal: employer-ready presentation.

Deliver:

- strong README
- architecture diagram
- demo GIF/video
- seeded demo data
- one-command local setup
- deployment
- portfolio write-up and screenshots
