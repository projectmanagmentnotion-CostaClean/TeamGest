# CostaFlow Ops Data Model

## Entities

- Worker: profile, role, base hourly rate, contact information and operational status.
- Client: commercial record and billing identity.
- Property: service location linked to a client.
- ServiceJob: operational service with status, date and worker assignments.
- ServiceAssignment: worker participation with hours, hourly rate, extras, deductions and confirmation state.
- HourEntry: derived view model built from `ServiceAssignment`, `ServiceJob`, `Worker`, `Property`, `Client` and payroll month state.
- PayrollSummary: monthly worker aggregation generated from confirmed assignments.
- PayrollMonthState: persisted local state for month status, worker statuses and lock metadata.
- PayrollAuditEntry: persisted local audit record for payroll workflow actions.
- QuickEntryDraft: transient model used by the fast hours flow before local service creation.
- ServiceInput: current transient draft model used by service create and edit flows before local persistence.

## Relationships

- One client can own many properties.
- One property can receive many services.
- One service belongs to one client and one property.
- One service can contain many assignments.
- One worker can appear in many assignments across many services.
- In the UI, client profiles aggregate their linked properties and linked services.
- In the UI, property profiles aggregate their linked services and worker participation history.
- Services follow a visible lifecycle from draft to closure.
- Payroll rows are derived from payable service assignments.
- HourEntry rows are derived from existing service assignments and are not persisted separately in Block 11.
- ServiceAssignment can now carry local review metadata such as status override, review note, incident note, exclusion flag, exclusion reason and review timestamps.
- Worker, client and property records can now have local created state, local overrides and archived state.

## Calculation rules

- Service labor cost is the sum of assignment pay for the service.
- Assignment pay = hours worked x hourly rate + extras - deductions.
- Worker monthly and payroll totals count only services in status `completed`, `reviewed` or `closed`.
- Monthly hours and monthly pay count only confirmed assignments.
- Hour status is derived from service status, confirmation state, worker/month payroll state and lock state.
- Payroll inclusion now excludes assignments with exclusion flags, excluded overrides, issue overrides, invalid hours or invalid rates even if the service month is otherwise payable.
- Missing hourly rate resolves safely to `0` and should surface as a warning.
- Client monthly cost is the sum of service labor cost for services linked to that client in the target month.
- Property monthly cost is the sum of service labor cost for services linked to that property in the target month.
- Property worker participation aggregates assignments by worker for the target month.
- Worker payroll status can diverge from month status in local state when needed.
- Hour review should reuse repository-safe service mutation rules instead of bypassing them.
- HourEntry remains derived in Block 12; no separate persisted hour entry namespace was introduced.

## Block 14 cleanup note

- The older `NewServiceDraft` step flow was removed after the audit proved it was no longer part of any live route.
- Current live create and edit work now centers on `ServiceInput` plus `QuickEntryDraft`.

## Payroll logic

- Payroll summaries are generated from repositories, not from UI pages.
- Each worker receives a monthly rollup with total services, hours, extras, deductions and estimated pay.
- Status in the current mock repository is derived from whether the worker has payable volume in the month.

## Block 15 closure note

- Monthly closure cards now derive their worker-facing view from `HourEntry` plus `PayrollMonthState`.
- Worker closure readiness remains derived, not separately persisted.
- Worker reviewed and paid tracking still persists through payroll month state only.

## Warning logic

- Service warnings validate related entities, assignments and missing rates.
- Worker warnings combine profile-level checks and operational assignment checks.
- Property warnings validate client linkage and inactive states.
- Dashboard warnings aggregate service, worker, property and payroll warnings into a prioritized list.

## Local service storage policy

- Seed mock services remain immutable.
- Newly created services can be appended only through the service repository.
- Created services are stored in localStorage and merged with seed data at read time.
- There is still no backend persistence.
- Payroll month states, audit entries and lock snapshots are stored only in localStorage.
- Worker, client, property and service local CRUD state is stored only in localStorage through repositories and storage helpers.

## Local persistence models

- StorageMetadata: schemaVersion, lastBackupAt, lastImportAt, lastResetAt and updatedAt.
- TeamGestBackupPayload: appName, exportedAt, schemaVersion and recognized local namespaces only.
- AppAuditEntry: local event log with action, message, optional entity reference and safe metadata.
- StorageHealthReport: availability, corrupted keys, missing expected keys, storage size, schema version and derived level.
- AppSettings: typed local configuration split into company, hours, quick entry, review, service, display, data safety and system sections.

## Local safety policy

- Import accepts only validated TeamGest backup payloads and writes only recognized namespaces.
- Reset actions affect local browser data only and require confirmation in UI.
- Locked closures remain operational state, not fiscal or legal finalization.
- Soft delete is not broadly implemented yet; reset is the only destructive local operation in this sprint.
- Local entity delete is guarded and limited to local-only records without blocked dependencies.

## Settings model note

- Settings now normalize through explicit defaults and safe validation before runtime use.
- System settings remain locked to `appMode = local` and `dataRealStatus = planning_only`.
- Settings audit events store section and changed keys, not the full settings payload.

## Block 8 readiness note

- Repository result envelopes and health models are planned for future real adapters but are not yet enforced across runtime repositories.
- Data-real mapping plans exist as documentation and planning constants only.
- Supabase and auth are still not active runtime dependencies.
