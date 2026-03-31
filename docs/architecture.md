# Architecture

## Stack Recommendation

### Frontend

- React + TypeScript
- Vite
- TanStack Query
- Zustand
- React Grid Layout
- Recharts or Visx
- Tailwind CSS
- optional Framer Motion

### Backend

- Fastify + TypeScript (or Express + TypeScript)
- WebSocket server
- Postgres

## State Architecture

### 1) UI State (ephemeral, local, fast-changing)

Examples:

- selected widget
- open side panel
- drag and resize state
- hover state
- local unsaved inputs

Storage: Zustand

### 2) Server State (persisted entities)

Examples:

- dashboard
- widgets
- layout
- metadata

Storage: TanStack Query

### 3) Derived State (computed)

Examples:

- filtered dataset
- transformed chart series
- visible widgets
- selected widget model

Implementation:

- selectors
- pure helpers
- `useMemo` where needed

### 4) Realtime Presence State (ephemeral room state)

Examples:

- connected users
- remote cursors
- selected widget by user

Storage: dedicated presence Zustand store

## Suggested Entity Model

### Dashboard

- `id`
- `name`
- `createdAt`
- `updatedAt`

### Widget

- `id`
- `dashboardId`
- `type`
- `title`
- `layout`
- `config`

### Layout

- `x`
- `y`
- `w`
- `h`

### Presence User

- `userId`
- `name`
- `color`
- `cursorX`
- `cursorY`
- `selectedWidgetId`
- `lastSeenAt`

## Suggested Frontend Structure

```text
src/
  app/
    routes/
    providers/
  components/
    dashboard/
      DashboardShell.tsx
      DashboardCanvas.tsx
      WidgetCard.tsx
      WidgetToolbar.tsx
      GridLayer.tsx
      CursorLayer.tsx
    widgets/
      LineChartWidget.tsx
      BarChartWidget.tsx
      StatCardWidget.tsx
      widgetRegistry.ts
    panels/
      LeftSidebar.tsx
      RightConfigPanel.tsx
      GlobalFiltersPanel.tsx
      WidgetConfigForm.tsx
    presence/
      PresenceAvatars.tsx
      RemoteCursor.tsx
  stores/
    dashboardStore.ts
    presenceStore.ts
    uiStore.ts
  hooks/
    useDashboard.ts
    useDashboardSocket.ts
    useFilteredData.ts
  lib/
    charts/
    grid/
    filters/
    websocket/
    utils/
  data/
    seedData.ts
    mockDashboards.ts
  types/
    dashboard.ts
    widget.ts
    presence.ts
```

## Suggested Store Boundaries

### `dashboardStore`

- widgets
- layout
- selectedWidgetId
- dashboardName
- dirty state
- `addWidget`, `updateWidget`, `removeWidget`, `updateLayout`, `selectWidget`, `duplicateWidget`

### `presenceStore`

- connectedUsers
- remoteCursors
- selectedWidgetByUser
- websocket status
- `upsertUser`, `removeUser`, `updateCursor`, `setUserSelection`

### `uiStore` (optional)

- sidebar state
- config tab
- toasts
- modal visibility

Do not put server persistence logic in Zustand. Keep persistence in API + TanStack Query.
