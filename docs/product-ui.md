# Product UI and Data Strategy

## Frontend Information Architecture

### Main Layout

Three-column app shell:

- left sidebar: add widget, widget library, dashboard nav
- center canvas: grid layout, widgets, cursor layer, empty state
- right sidebar: widget settings when selected, global filters when no selection

Top bar:

- dashboard title
- save status
- connected users
- share action

## Key Screens and States

1. Empty dashboard
   - friendly empty state
   - CTA to add first widget
2. Populated dashboard
   - widgets visible
   - filters active
   - selected widget editable
3. Shared dashboard
   - connected users visible
   - cursors moving
   - selected-widget presence
4. Loading/saving
   - skeleton canvas
   - autosave badge
   - "saved just now" feedback

## Data Model Strategy

Do not build a backend analytics engine.

Use seeded realistic data, such as:

- portfolio value over time
- holdings by asset class
- transactions over time
- returns by sector
- account-level totals

Data can come from:

- client-side mock JSON
- backend static seeded endpoint

Filtering and chart recomputation should happen primarily on the frontend.
