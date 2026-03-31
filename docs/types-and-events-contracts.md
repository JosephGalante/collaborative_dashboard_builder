# Types and Events Contracts

This document is the source of truth for exact domain types during implementation.

## Core IDs

```ts
export type DashboardId = string;
export type WidgetId = string;
export type UserId = string;
```

## Widget Types

```ts
export type WidgetType = 'line' | 'bar' | 'stat';
```

## Layout Type

```ts
export type WidgetLayout = {
  i: WidgetId; // react-grid-layout item id
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
};
```

## Filter Types

```ts
export type DateRangeFilter = {
  from: string | null; // ISO date string
  to: string | null; // ISO date string
};

export type AssetClass =
  | 'equities'
  | 'fixed_income'
  | 'cash'
  | 'alternatives';

export type GlobalFilters = {
  dateRange: DateRangeFilter;
  assetClasses: AssetClass[];
};
```

## Dataset Types

```ts
export type PortfolioTimeseriesPoint = {
  date: string; // ISO date
  portfolioValue: number;
  netFlows: number;
};

export type AssetAllocationPoint = {
  assetClass: AssetClass;
  marketValue: number;
};

export type PerformanceStatBlock = {
  totalValue: number;
  dailyChange: number;
  ytdReturnPct: number;
};

export type SeedDataset = {
  portfolioTimeseries: PortfolioTimeseriesPoint[];
  assetAllocation: AssetAllocationPoint[];
  performanceStats: PerformanceStatBlock;
};
```

## Widget Config Types (Discriminated Union)

```ts
export type BaseWidget = {
  id: WidgetId;
  title: string;
  type: WidgetType;
};

export type LineWidgetConfig = {
  datasetKey: 'portfolioTimeseries';
  xField: 'date';
  yField: 'portfolioValue' | 'netFlows';
};

export type BarWidgetConfig = {
  datasetKey: 'assetAllocation';
  categoryField: 'assetClass';
  valueField: 'marketValue';
};

export type StatWidgetConfig = {
  datasetKey: 'performanceStats';
  statKey: 'totalValue' | 'dailyChange' | 'ytdReturnPct';
  format: 'currency' | 'percent' | 'number';
};

export type LineWidget = BaseWidget & {
  type: 'line';
  config: LineWidgetConfig;
};

export type BarWidget = BaseWidget & {
  type: 'bar';
  config: BarWidgetConfig;
};

export type StatWidget = BaseWidget & {
  type: 'stat';
  config: StatWidgetConfig;
};

export type Widget = LineWidget | BarWidget | StatWidget;
```

## Dashboard Type

```ts
export type Dashboard = {
  id: DashboardId;
  name: string;
  widgets: Widget[];
  layouts: WidgetLayout[];
  globalFilters: GlobalFilters;
  createdAt: string;
  updatedAt: string;
};
```

## Presence Types

```ts
export type PresenceUser = {
  userId: UserId;
  name: string;
  color: string;
};

export type RemoteCursor = {
  userId: UserId;
  x: number;
  y: number;
  updatedAt: number;
};

export type UserSelection = {
  userId: UserId;
  selectedWidgetId: WidgetId | null;
};

export type PresenceStateSnapshot = {
  users: PresenceUser[];
  cursors: RemoteCursor[];
  selections: UserSelection[];
};
```

## WebSocket Event Types

```ts
export type ClientToServerEvent =
  | {
      type: 'presence:join';
      payload: {
        dashboardId: DashboardId;
        user: PresenceUser;
      };
    }
  | {
      type: 'cursor:move';
      payload: {
        dashboardId: DashboardId;
        userId: UserId;
        x: number;
        y: number;
      };
    }
  | {
      type: 'selection:update';
      payload: {
        dashboardId: DashboardId;
        userId: UserId;
        selectedWidgetId: WidgetId | null;
      };
    }
  | {
      type: 'presence:leave';
      payload: {
        dashboardId: DashboardId;
        userId: UserId;
      };
    };

export type ServerToClientEvent =
  | {
      type: 'presence:snapshot';
      payload: PresenceStateSnapshot;
    }
  | {
      type: 'presence:user_joined';
      payload: PresenceUser;
    }
  | {
      type: 'presence:user_left';
      payload: {
        userId: UserId;
      };
    }
  | {
      type: 'cursor:moved';
      payload: RemoteCursor;
    }
  | {
      type: 'selection:updated';
      payload: UserSelection;
    };
```
