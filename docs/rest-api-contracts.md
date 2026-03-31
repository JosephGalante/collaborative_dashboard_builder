# REST API Contracts

Keep REST surface intentionally small.

## `POST /api/dashboards`

Creates a new dashboard.

### Request

```ts
export type CreateDashboardRequest = {
  name?: string
}
```

### Response

```ts
export type CreateDashboardResponse = {
  dashboard: Dashboard
}
```

### Behavior

- if `name` is missing, default to `"Untitled Dashboard"`
- initialize dashboard with empty `widgets`, empty `layouts`, and default `globalFilters`

## `GET /api/dashboards/:id`

Fetch one dashboard.

### Response

```ts
export type GetDashboardResponse = {
  dashboard: Dashboard
}
```

### Errors

- `404` if dashboard not found

## `PUT /api/dashboards/:id`

Full overwrite update for persisted dashboard shape.

### Request

```ts
export type UpdateDashboardRequest = {
  name: string
  widgets: Widget[]
  layouts: WidgetLayout[]
  globalFilters: GlobalFilters
}
```

### Response

```ts
export type UpdateDashboardResponse = {
  dashboard: Dashboard
}
```

### Behavior

- overwrite current persisted dashboard state
- update `updatedAt`

## Optional `GET /api/dashboards`

Add only for a simple dashboard listing page.

### Response

```ts
export type ListDashboardsResponse = {
  dashboards: Array<Pick<Dashboard, 'id' | 'name' | 'createdAt' | 'updatedAt'>>
}
```

## Validation Rules (Zod)

Enforce at API boundary:

- widget IDs must be unique
- layout item IDs must match widget IDs
- every widget must have a matching layout
- dashboard name max length: 100
- widget title max length: 80
- widget config values limited to allowed literals

## Suggested Frontend API Helpers

```ts
export async function createDashboard(
  input: CreateDashboardRequest,
): Promise<CreateDashboardResponse> {}

export async function getDashboard(id: DashboardId): Promise<GetDashboardResponse> {}

export async function updateDashboard(
  id: DashboardId,
  input: UpdateDashboardRequest,
): Promise<UpdateDashboardResponse> {}
```
