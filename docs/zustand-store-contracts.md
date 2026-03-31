# Zustand Store Contracts

Use two stores by default (`dashboardStore`, `presenceStore`), with optional `uiStore` only if shell state grows.

## `dashboardStore` Shape

```ts
type DashboardStore = {
  dashboardId: DashboardId | null;
  name: string;
  widgets: Widget[];
  layouts: WidgetLayout[];
  globalFilters: GlobalFilters;

  selectedWidgetId: WidgetId | null;
  isHydrated: boolean;
  isDirty: boolean;
  lastSavedAt: string | null;

  hydrateFromDashboard: (dashboard: Dashboard) => void;

  setDashboardName: (name: string) => void;

  addWidget: (widgetType: WidgetType) => void;
  updateWidget: (widgetId: WidgetId, updater: (widget: Widget) => Widget) => void;
  removeWidget: (widgetId: WidgetId) => void;
  duplicateWidget: (widgetId: WidgetId) => void;

  setLayouts: (layouts: WidgetLayout[]) => void;
  updateLayoutItem: (widgetId: WidgetId, patch: Partial<WidgetLayout>) => void;

  setGlobalFilters: (filters: Partial<GlobalFilters>) => void;

  selectWidget: (widgetId: WidgetId | null) => void;

  markSaved: (savedAt: string) => void;
  markDirty: () => void;
  resetDirty: () => void;
};
```

## `presenceStore` Shape

```ts
type PresenceStore = {
  connectionStatus: 'disconnected' | 'connecting' | 'connected';

  currentUser: PresenceUser | null;
  users: PresenceUser[];
  cursors: Record<UserId, RemoteCursor>;
  selections: Record<UserId, WidgetId | null>;

  setConnectionStatus: (status: PresenceStore['connectionStatus']) => void;
  setCurrentUser: (user: PresenceUser) => void;

  setSnapshot: (snapshot: PresenceStateSnapshot) => void;

  upsertUser: (user: PresenceUser) => void;
  removeUser: (userId: UserId) => void;

  updateCursor: (cursor: RemoteCursor) => void;
  removeCursor: (userId: UserId) => void;

  updateSelection: (selection: UserSelection) => void;
  clearSelection: (userId: UserId) => void;

  resetPresence: () => void;
};
```

## Optional `uiStore` Shape

```ts
type UiStore = {
  rightPanelTab: 'widget' | 'filters';
  isLeftSidebarOpen: boolean;

  setRightPanelTab: (tab: UiStore['rightPanelTab']) => void;
  setLeftSidebarOpen: (open: boolean) => void;
};
```

## Behavior Details

### `hydrateFromDashboard`

- populate store fields from fetched dashboard
- set `isHydrated = true`
- set `isDirty = false`
- clear selection if selected widget no longer exists

### `addWidget`

- generate widget id
- create default widget config by type
- create matching default layout
- select new widget
- mark dirty

Default templates:

```ts
function createDefaultWidget(type: WidgetType): Widget {
  const id = crypto.randomUUID();

  if (type === 'line') {
    return {
      id,
      type: 'line',
      title: 'Portfolio Value',
      config: {
        datasetKey: 'portfolioTimeseries',
        xField: 'date',
        yField: 'portfolioValue',
      },
    };
  }

  if (type === 'bar') {
    return {
      id,
      type: 'bar',
      title: 'Asset Allocation',
      config: {
        datasetKey: 'assetAllocation',
        categoryField: 'assetClass',
        valueField: 'marketValue',
      },
    };
  }

  return {
    id,
    type: 'stat',
    title: 'Total Value',
    config: {
      datasetKey: 'performanceStats',
      statKey: 'totalValue',
      format: 'currency',
    },
  };
}
```

### `duplicateWidget`

- clone source config/title
- generate new id
- create offset layout
- append `" Copy"` to title
- mark dirty

### `setLayouts`

- update on drag-stop / resize-stop only
- avoid persistence on drag ticks
- mark dirty

### `setGlobalFilters`

- merge partial updates
- mark dirty

## Autosave Strategy

Use TanStack Query mutation outside Zustand:

- Zustand holds editable draft state
- debounced effect watches relevant slices
- dirty state triggers `PUT /api/dashboards/:id`
- on success call `markSaved(updatedAt)`

Do not place fetch logic inside store actions.
