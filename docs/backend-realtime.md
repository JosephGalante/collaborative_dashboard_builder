# Backend and Realtime

## Backend Scope

Keep backend intentionally light and product-supporting.

### REST Endpoints

Dashboard:

- `POST /dashboards`
- `GET /dashboards/:id`
- `PUT /dashboards/:id`

Optional:

- `GET /dashboards`
- `DELETE /dashboards/:id`

### Realtime Events

WebSocket room per dashboard:

- join room
- leave room
- cursor move
- presence update
- selected widget update

Optional:

- dashboard updated broadcast

## Database Strategy

Use JSON-based persistence for speed and flexibility.

### `dashboards` table

- `id`
- `name`
- `layout_json`
- `widgets_json`
- `created_at`
- `updated_at`

This is intentionally non-normalized because frontend iteration speed is the priority.

## Collaboration Rules

### Supported

- user presence
- live cursors
- selected-widget signals

### Not Supported

- conflict-free merges
- operational transforms
- CRDT reconciliation
- strict concurrent config safety

Recommended UX/logic pairing:

- soft ownership in UI
- last-write-wins persistence model

## Suggested Backend Structure

```text
server/
  src/
    routes/
      dashboards.ts
    websocket/
      dashboardRoomServer.ts
    db/
      schema.ts
      queries.ts
    lib/
      validation.ts
      roomState.ts
```
