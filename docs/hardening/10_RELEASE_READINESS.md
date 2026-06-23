# Release Readiness

## Local-first version status

The app is operationally ready as a finished local-first internal tool for:

- quick hour registration
- hours review
- worker, client, property and service local CRUD
- worker-centered monthly closures
- local settings, backup, import, reset and audit visibility

## Not included

- backend or Supabase runtime
- auth or multi-user permissions
- payments
- export, PDF or CSV workflows
- calendar, Google Calendar or pipeline features

## Critical workflows ready

- `Registrar horas`
- `Control de horas`
- `Revision de horas`
- worker and property hours drilldowns
- monthly closure by worker
- worker monthly closure detail
- local data safety tooling

## Critical workflows not browser-tested

- full visual review across real mobile devices
- click-through smoke testing across every route in a browser session
- long-session storage behavior in a real browser

## Known limitations

- Browser visual QA was not performed in this sprint.
- Runtime is still tied to the current browser unless the operator exports and restores a backup manually.
- This release remains local-first only and should not be described as multi-user or cloud-backed.

## Validation snapshot

- lint: pass
- build: pass
- backend/auth/payments: inactive
- export/calendar/pipeline: not implemented
- Block 16 performance change: route-level lazy loading applied and the prior chunk warning was removed

## Current commit

- Pending final Block 16 commit

## Next recommended blocks

- browser-driven smoke QA with live device verification
- optional automated test coverage for storage and payroll calculations
- future export package work only if product direction explicitly approves it
