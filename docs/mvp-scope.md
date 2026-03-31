# MVP Scope

## Strict Scope Boundaries

### Must Have

- dashboard canvas/grid
- add widget
- move/resize widget
- edit widget title/type/config
- global filters
- save/load dashboard
- shareable URL
- presence
- live cursors
- selected-widget presence highlight
- polished UI

### Nice To Have

- duplicate widget
- keyboard delete
- undo/redo
- dashboard rename
- dark mode
- small animation polish

### Explicitly Out of Scope

- auth
- teams/permissions
- multi-tenant architecture
- SQL query builder
- custom chart rendering engine
- many widget types
- perfect collaboration correctness
- CRDTs
- version history
- comments
- notifications
- ingestion pipelines

## Widget Scope

### V1 Widget Types

- line chart
- bar chart
- KPI/stat card

### Optional Later

- pie/donut chart

## Collaboration Semantics

This project supports:

- presence
- live cursors
- selected widget visibility
- optional best-effort layout broadcasts

This project does not support:

- conflict-free concurrent editing
- OT/CRDT merge correctness
- safe simultaneous config editing

Practical rule:

- UI uses soft ownership messaging ("Joe is editing this")
- persistence remains last-write-wins
