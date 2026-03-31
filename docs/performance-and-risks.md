# Performance and Risks

## Performance Focus Areas

Watch for:

- full dashboard rerender on every drag
- chart rerenders from unrelated state updates
- cursor updates causing global rerenders
- expensive transforms on each keystroke

Mitigate with:

- narrow Zustand selectors
- memoized derived chart data
- cursor layer isolation from widget layer
- throttled cursor broadcasting
- debounced autosave
- local form draft state where possible

## Project Risks and Controls

### Risk: widget config UI balloons

Control:

- keep config surface intentionally small
- restrict valid dataset/field combinations

### Risk: realtime consumes project

Control:

- deliver presence first, cursors second
- avoid deep collaboration correctness

### Risk: grid behavior takes too long

Control:

- use established grid library defaults
- accept library constraints where reasonable

### Risk: backend scope creep

Control:

- persist dashboard as JSON payload
- perform filtering on client
- no auth/ownership model for MVP

### Risk: too many widget types

Control:

- keep total at three core types (plus optional one extra)
