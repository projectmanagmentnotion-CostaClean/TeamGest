# QA Checklist

## Scope

Block 11 QA is a code-level validation pass over the current local-first runtime.

Verified by code review plus `npm run lint` and `npm run build`:

- `/dashboard`
- `/workers`
- `/workers/new`
- `/workers/:id`
- `/workers/:id/edit`
- `/clients`
- `/clients/new`
- `/clients/:id`
- `/clients/:id/edit`
- `/properties`
- `/properties/new`
- `/properties/:id`
- `/properties/:id/edit`
- `/services`
- `/services/:id`
- `/services/new`
- `/services/:id/edit`
- `/quick-entry`
- `/hours`
- `/hours/review`
- `/hours/workers/:workerId`
- `/hours/properties/:propertyId`
- `/quick-entry?workerId=...`
- `/quick-entry?propertyId=...`
- `/quick-entry?date=YYYY-MM-DD`
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
- Quick actions now route to quick entry, hours, services and payroll.
- Local services remain part of repository-driven reads.

### Workers

- List filters are state-based and compile cleanly.
- Worker monthly hours/pay still count only payroll-eligible services with confirmed assignments.
- Worker create and edit routes resolve through repository-backed form flows.
- Invalid worker id still renders safe empty state.

### Clients

- Client detail still resolves linked properties and service history through repository-backed relations.
- Client create and edit routes resolve through repository-backed form flows.
- Empty state remains safe for invalid ids.

### Properties

- Property detail still resolves linked client, worker participation and service history safely.
- Property create and edit routes resolve through repository-backed form flows.
- Empty state remains safe for invalid ids.

### Services

- Service detail still resolves client/property/worker links safely.
- LocalStorage-created services remain readable through repository list/detail lookups.
- Service edit route resolves through repository-backed form flow.
- Service mutation guards now block editing or deletion when the payroll month is locked.

### Quick Work Entry and service management

- Quick Work Entry creates one local service with one confirmed assignment.
- Manual service form keeps entity selections, assignments and notes in a local draft.
- Service delete remains limited to local-created services.
- Confirm-hours review updates assignment confirmation only through repository-safe service update.

### Payroll

- Monthly payroll still counts only `completed`, `reviewed`, and `closed` services.
- Draft, scheduled, in-progress and cancelled services remain excluded from payable month calculations.
- Confirmed assignments still drive payroll totals.
- Fixed worker service breakdown so it only lists confirmed assignments, matching the actual monthly payroll calculation rules.
- Invalid month param still falls back safely to current month with warning.
- Review, paid and locked workflow still builds with snapshot and audit updates.
- Payroll now links back to hour review before closure.

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

## FormFlow checklist

- Draft validation blocks empty or structurally invalid local saves.
- Shared form components stay generic and do not import module business logic.
- UI layers still avoid direct `localStorage` access.

## Behavior added in Block 9

1. Local CRUD now exists for workers, clients and properties through repository-backed form flows and guarded destructive actions.
2. Quick Work Entry now exists as a primary route for fast hour registration.
3. Service edit, cancel, restore and guarded delete now exist in local-first mode.
4. Backup, import and reset now account for local entity CRUD namespaces.

## Known limitations

- No automated test framework was added in this sprint.
- No browser visual QA was run in this sprint.
- Runtime remains local-first only; no real backend, auth, or Supabase activation exists.
- Backup export/import remains browser-local JSON handling, not enterprise backup infrastructure.

## Block 10 QA additions

### CRUD management QA checklist

- Worker, client and property repositories now resolve visible lists separately from archived-aware `getById`.
- Delete dependency checks now consider local-first data, not seed data only.
- Seed records still avoid hard delete and remain immutable.
- Local create and edit still persist through repositories only.

### Dependency protection checklist

- Worker hard delete remains blocked when any service assignment exists.
- Client hard delete remains blocked when any linked property or service exists.
- Property hard delete remains blocked when any linked service exists.
- Service edit, cancel and hard delete remain blocked inside locked payroll months.
- Archive and delete flows now require explicit confirmation text.

### Backup, import and reset compatibility checklist

- Backup payload includes CRUD namespaces for workers, clients, properties and services.
- Import normalizes older TeamGest backups when newer CRUD namespaces are missing.
- Reset panel exposes a dedicated reset for local CRUD entity state.
- Full reset remains scoped to TeamGest namespace only.

### Audit event checklist

- CRUD mutations still write audit entries through repositories.
- Quick Entry still writes `service.quick_entry_created`.
- Backup export/import and reset flows still write audit entries.

### Payroll compatibility checklist

- Quick Entry completed work continues feeding payroll through confirmed assignments.
- Scheduled, draft, in-progress and cancelled services remain outside payroll totals.
- Locked month edits and deletes remain blocked from service repository mutations.
- Payroll month detail warns when totals drift from a locked snapshot.

### Quick Entry URL prefill QA

- `/quick-entry?workerId=...` prefills worker when present in current local data.
- `/quick-entry?propertyId=...` prefills property when present in current local data.
- `/quick-entry?date=YYYY-MM-DD` prefills date only when the format is valid.

### Quick Entry payroll impact QA

- Summary bar shows worker, property, date, hours, rate and total pay.
- Quick Entry warns that the record will be added to the selected monthly closure.
- Success state exposes service, payroll month and repeat-entry actions.

### Mobile Quick Entry QA

- Worker and property selections use large card targets.
- Main actions remain full width on narrow screens through shared responsive action rows.
- Summary and success sections stack cleanly through existing responsive grids.

## Block 11 QA additions

- Hours routes resolve through the shared shell and compile cleanly.
- HourEntry remains derived only; no new persisted hours namespace was added.
- Worker and property detail pages link into dedicated hours drilldowns.
- Review queue exposes confirm-hours only when the entry is pending review and the month is not locked.
- Existing service, payroll, backup and reset behavior remains local-first.
