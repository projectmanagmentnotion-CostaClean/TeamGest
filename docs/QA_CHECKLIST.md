# QA Checklist

## Scope

Block 8 QA was a code-level hardening pass over the current local-first runtime.

Verified by code review plus `npm run lint` and `npm run build`:

- `/dashboard`
- `/workers`
- `/workers/:id`
- `/clients`
- `/clients/:id`
- `/properties`
- `/properties/:id`
- `/services`
- `/services/:id`
- `/services/new`
- `/payroll`
- `/payroll/:month`
- `/settings`

Browser visual QA was not performed in this block.

## Route checklist

- Root redirect still points to `/dashboard`.
- Added wildcard route fallback to redirect invalid URLs back to `/dashboard`.
- Invalid entity ids on worker, client, property and service detail pages still resolve to safe empty states.
- Cross-links remain present between client/property/service/worker/payroll surfaces.

## Flow checklist

### Dashboard

- Stats and warnings still resolve through repositories.
- Quick actions still route to services and payroll.
- Local services remain part of repository-driven reads.

### Workers

- List filters are state-based and compile cleanly.
- Worker monthly hours/pay still count only payroll-eligible services with confirmed assignments.
- Invalid worker id still renders safe empty state.

### Clients

- Client detail still resolves linked properties and service history through repository-backed relations.
- Empty state remains safe for invalid ids.

### Properties

- Property detail still resolves linked client, worker participation and service history safely.
- Empty state remains safe for invalid ids.

### Services

- Service detail still resolves client/property/worker links safely.
- LocalStorage-created services remain readable through repository list/detail lookups.
- Fixed persistence normalization so created assignment rows now store the real `serviceJobId` instead of preview placeholder data.

### New Service StepFlow

- Client change still resets property selection.
- Property step still reads only properties for the selected client.
- Validation still blocks invalid next/confirm transitions.
- Assignment hours and hourly rate validation still block invalid confirmation.
- Persisted service still routes to `/services` and `/services/:id`.

### Payroll

- Monthly payroll still counts only `completed`, `reviewed`, and `closed` services.
- Draft, scheduled, in-progress and cancelled services remain excluded from payable month calculations.
- Confirmed assignments still drive payroll totals.
- Fixed worker service breakdown so it only lists confirmed assignments, matching the actual monthly payroll calculation rules.
- Invalid month param still falls back safely to current month with warning.
- Review, paid and locked workflow still builds with snapshot and audit updates.

### Settings and storage

- Storage overview and health still read through infrastructure helpers.
- Backup/import/reset still build in local-first mode.
- Strengthened backup validation so import now rejects malformed but shape-compatible payloads more safely.
- JSON parse errors now return explicit TeamGest-friendly import errors instead of raw parser failures.
- Full reset remains scoped to TeamGest keys only through storage infrastructure.

## localStorage checklist

- No direct `window.localStorage` or `localStorage.*` usage in `src/app`.
- No direct `window.localStorage` or `localStorage.*` usage in `src/components`.
- No direct `window.localStorage` or `localStorage.*` usage in `src/modules`.
- Runtime storage access remains isolated to infrastructure storage/repository layers.

## Payroll calculation checklist

- Eligible statuses: `completed`, `reviewed`, `closed`.
- Ignored statuses: `draft`, `scheduled`, `in_progress`, `cancelled`.
- Confirmed assignments drive payroll totals.
- Breakdown now matches confirmed-assignment policy.
- Locked snapshot flow remains compile-safe.

## StepFlow checklist

- Draft resets property when client changes.
- Worker selection still rebuilds assignment rows from selected workers.
- Confirm button remains gated by review validation.
- Success state still offers route back to services and created service detail.

## Bugs fixed in Block 8

1. Invalid top-level URLs had no explicit fallback route.
   Fix: added wildcard redirect back to `/dashboard`.

2. Persisted services could keep assignment `serviceJobId: "preview"` after StepFlow save.
   Fix: repository now normalizes persisted assignments to the real service id before storage.

3. Payroll worker breakdown could show unconfirmed assignments even though payroll totals exclude them.
   Fix: breakdown now filters to confirmed assignments only.

4. Backup validation accepted overly loose payload shapes.
   Fix: import validation now checks recognized arrays/records explicitly and wraps JSON parse failures with safe user-facing errors.

## Known limitations

- No automated test framework was added in this sprint.
- No browser visual QA was run in this sprint.
- Runtime remains local-first only; no real backend, auth, or Supabase activation exists.
- Backup export/import remains browser-local JSON handling, not enterprise backup infrastructure.
