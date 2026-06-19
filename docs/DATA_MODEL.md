# CostaFlow Ops Data Model

## Entities

- Worker: profile, role, base hourly rate, contact information and operational status.
- Client: commercial record and billing identity.
- Property: service location linked to a client.
- ServiceJob: operational service with status, date and worker assignments.
- ServiceAssignment: worker participation with hours, hourly rate, extras, deductions and confirmation state.
- PayrollSummary: monthly worker aggregation generated from confirmed assignments.
- NewServiceDraft: transient model used by the StepFlow before preview or local persistence.
- PayrollMonthState: persisted local state for month status, worker statuses and lock metadata.
- PayrollAuditEntry: persisted local audit record for payroll workflow actions.

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

## Calculation rules

- Service labor cost is the sum of assignment pay for the service.
- Assignment pay = hours worked x hourly rate + extras - deductions.
- Worker monthly and payroll totals count only services in status `completed`, `reviewed` or `closed`.
- Monthly hours and monthly pay count only confirmed assignments.
- Missing hourly rate resolves safely to `0` and should surface as a warning.
- Client monthly cost is the sum of service labor cost for services linked to that client in the target month.
- Property monthly cost is the sum of service labor cost for services linked to that property in the target month.
- Property worker participation aggregates assignments by worker for the target month.
- New service draft assignments reuse the same assignment pay formula before persistence.
- Worker payroll status can diverge from month status in local state when needed.

## Payroll logic

- Payroll summaries are generated from repositories, not from UI pages.
- Each worker receives a monthly rollup with total services, hours, extras, deductions and estimated pay.
- Status in the current mock repository is derived from whether the worker has payable volume in the month.

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

## Local persistence models

- StorageMetadata: schemaVersion, lastBackupAt, lastImportAt, lastResetAt and updatedAt.
- TeamGestBackupPayload: appName, exportedAt, schemaVersion and recognized local namespaces only.
- AppAuditEntry: local event log with action, message, optional entity reference and safe metadata.
- StorageHealthReport: availability, corrupted keys, missing expected keys, storage size, schema version and derived level.

## Local safety policy

- Import accepts only validated TeamGest backup payloads and writes only recognized namespaces.
- Reset actions affect local browser data only and require confirmation in UI.
- Locked closures remain operational state, not fiscal or legal finalization.
- Soft delete is not broadly implemented yet; reset is the only destructive local operation in this sprint.
