# Monthly Closure Audit

## Scope

This audit reviews the current monthly closure implementation before Block 15 changes:

- `src/modules/payroll`
- `src/modules/hours`
- `src/domain/payroll`
- `src/domain/hours`
- `src/infrastructure/repositories`
- `src/modules/settings`
- `docs/QA_CHECKLIST.md`
- `docs/DATA_MODEL.md`

## Current monthly data source

- The current payroll page still derives totals from `ServiceAssignment` payroll eligibility through `calculatePayrollMonthSummary()`.
- The hours module already exposes `HourEntry` as a derived view model built from services, assignments, workers, clients, properties and payroll month state.
- `HourEntry` is already the best source for month-closure UX because it exposes:
  - confirmed vs pending review state
  - issue and excluded state
  - lock awareness
  - per-entry hours, rate and pay
  - worker, client and property context

## Current worker payroll status model

- `PayrollMonthState` stores:
  - month status
  - `workerStatuses`
  - lock snapshot
  - timestamps
- Worker payment status is persisted separately from services inside `workerStatuses`.
- Current worker status values remain `pending`, `reviewed`, `paid`, `locked`.
- The current status layer is usable, but the UI does not explain worker readiness well enough.

## Current lock behavior

- Locked month state is persisted in `PayrollMonthState`.
- Service repository mutations already respect the locked month and block service edits and deletes.
- Hour review actions also respect the same month lock.
- Payroll month detail already warns if current totals drift from the locked snapshot.
- Lock remains month-level, not worker-level.

## Current reviewed and paid behavior

- Month-level actions exist: mark reviewed, mark paid, lock month.
- Worker-level persisted statuses also exist in storage, but the current UI does not expose strong worker-by-worker actions.
- `HourEntry` derivation already reflects month paid or worker paid state.
- The current experience is technically functional, but visually weak and not centered on worker payment control.

## Current dependency with HourEntry

- `HourEntry` remains derived only.
- No separate persisted hours entity exists, and none is needed for this block.
- Current payroll screens still compute their main rows from payroll calculations rather than from the richer `HourEntry` view model.
- That is the main UX gap this block can safely fix without changing storage architecture.

## Current handling of pending, issue and excluded hours

- Pending review entries already exist through `HourEntry.hourStatus = pending_review`.
- Issues already exist through hour review metadata and invalid hours/rates.
- Excluded entries are already visible in hours review and excluded from payroll inclusion.
- Current payroll month detail only surfaces these states indirectly through warnings, not as worker-centered operational cards.

## Current UI weaknesses

- `/payroll/:month` is still a long vertical list of generic worker detail cards.
- The current page is not table-heavy, but it is still scroll-heavy and not strongly sectioned.
- The month page does not immediately answer:
  - who is ready to pay
  - who still has pending review
  - who has incidents
  - who is already reviewed or paid
- Worker actions are not first-class.
- There is no dedicated worker-by-month closure page.

## Safe improvement boundaries

Low-risk improvements for Block 15:

- build worker closure cards from derived `HourEntry`
- preserve `PayrollMonthState` and existing storage
- preserve month lock rules
- preserve hour review actions
- add worker-focused status and readiness logic at view-model level
- add worker-level closure actions through existing payroll repository updates
- add a worker monthly detail route backed by existing derived data

## What should not change in this block

- no separate persisted `HourEntry` entity
- no backend, auth, Supabase or payment integration
- no export, PDF or CSV work
- no removal of existing lock protections
- no broad rewrite of service repository rules

## Recommended implementation direction

- use `HourEntry` as the source of truth for closure cards
- derive worker closure summaries in a dedicated `monthlyClosure*` service layer
- group the month page into:
  - summary
  - ready workers
  - workers needing attention
  - reviewed and paid workers
  - lock and audit
- keep lock controls month-level
- add worker-level actions for reviewed, paid and paid revert where safe
