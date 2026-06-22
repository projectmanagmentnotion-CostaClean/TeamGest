# Hours-First Audit

## Scope

Sprint 21 audited the real TeamGest codebase after Blocks 1-10 to verify how well the current product supports the new direction:

- control de horas trabajadas por trabajador
- revision operativa
- cierre mensual
- pago interno

This audit is based on the current local-first runtime. No backend, Supabase, auth, payments, pipeline or calendar work was activated.

## Current architecture review

### What already supports the new direction

- `src/domain/services/service.types.ts` already stores the raw hour source in `ServiceAssignment`.
- `ServiceAssignment` already includes `hoursWorked`, `hourlyRate`, `extraAmount`, `deductions` and `confirmed`.
- `src/modules/services/pages/QuickWorkEntryPage.tsx` already creates one completed local service with one confirmed assignment, which fits the new "Registrar horas trabajadas" flow.
- `src/modules/payroll/services/payrollCalculations.ts` already derives monthly pay from confirmed assignments in payable service statuses.
- `src/infrastructure/repositories/serviceRepository.ts` already blocks service edits inside locked payroll months.
- `src/infrastructure/repositories/payrollRepository.ts` already persists month status, worker status, audit trail and locked snapshots.
- `src/infrastructure/storage/storageBackup.ts` already includes service CRUD state and payroll namespaces, so derived hour views do not require a new backup namespace.

### What is still too service-centric

- Primary structure and wording still revolve around `ServiceJob` as the central surface.
- Navigation still favored services over a dedicated hour-control area.
- Dashboard summaries still mixed service lifecycle language with the faster hours-first workflow.
- Worker and property detail pages exposed `Registrar horas`, but did not provide a dedicated review surface for existing hour records.

### Current source of hours

- Source entity: `ServiceAssignment.hoursWorked`.
- Source context: `ServiceJob.date`, `startTime`, `endTime`, `status`, `clientId`, `propertyId`.
- Source relation: `ServiceAssignment.workerId`.

### Current source of pay

- Source formula: `hoursWorked * hourlyRate + extraAmount - deductions`.
- Implementation: `src/modules/services/services/serviceCalculations.ts` and `src/modules/payroll/services/payrollCalculations.ts`.

### Current source of payroll inclusion

- Payroll includes only services in status `completed`, `reviewed` or `closed`.
- Within those services, payroll counts only assignments with `confirmed === true`.
- Month lock state comes from `PayrollMonthState`.

### Current assignment model

- `ServiceAssignment` is already the right grain for a derived Hour Entry UI.
- A separate persisted `hour_entries` entity is not required in this block.

### Current Quick Entry model

- Quick Entry is already the fastest operational input path.
- It builds one local service and one confirmed assignment through repository-backed persistence.
- It already explains payroll impact, effective rate and total pay.

### Current payroll lock rules

- Service repository checks the service month before update, cancel or delete.
- If the month is locked, service mutation is rejected.
- This is enough to safely prevent post-lock hour confirmation as long as confirmation goes through service update.

### Current CRUD implications

- Workers, clients, properties and services already use repository-backed local CRUD.
- Deleting a worker/property/client is dependency-guarded against linked service usage.
- Because hours are derived from services, CRUD protections automatically protect the future Hours module.

## Current user flow review

### Quick Entry -> creates service or assignment data

What works:

- Quick Entry already maps directly to "worker + property + date + hours + rate + total pay".
- Persistence already goes through the service repository.
- Payroll impact messaging is already present.

What is confusing:

- The resulting record lands in Services, not in a dedicated hours review surface.
- The mental model is still "service created" instead of "hours registered and pending closure review".

What was missing:

- A central cross-worker hours list.
- A focused review queue for pending confirmations and issues.
- Worker/property drilldowns centered on hours rather than service history.

### Service assignment -> feeds payroll

What works:

- Confirmed assignments already feed payroll correctly.
- Hourly cost, extras and deductions are already supported.

Gap:

- The relationship is technically correct, but not visible enough at the product level.

### Worker detail -> shows hours and pay

What works:

- Worker detail already shows monthly hours and pay.

Gap:

- The page had no direct dedicated "control de horas" destination.

### Payroll -> summarizes hours and pay

What works:

- Payroll already summarizes monthly hours, pay and warnings.
- Locked months already protect downstream edits.

Gap:

- Payroll needed a clearer bridge back to hour review before closure.

### Locked payroll -> blocks service edits

What works:

- Lock protection already exists at repository level.

Gap:

- Hours review needed to respect the same rule instead of bypassing it.

### Backup/import/reset -> includes hours-related data

What works:

- Service and payroll local data are already part of backup/import/reset coverage.

Gap:

- Documentation needed to state that HourEntry is derived, so no new backup namespace is required.

## Navigation audit

Previous navigation felt service-first:

- Inicio
- Servicios
- Trabajadores
- Inmuebles
- Clientes
- Cierres
- Ajustes

Recommended priority for the next phase:

- Inicio
- Registrar horas
- Control de horas
- Trabajadores
- Cierres
- Servicios
- Inmuebles
- Clientes
- Ajustes

Low-risk changes applied in Block 11:

- Added `Control de horas` to main navigation.
- Moved mobile `Horas` to `/hours`.
- Kept `Registrar horas` as the main CTA and quick action target to `/quick-entry`.

Not applied yet:

- Full global reorder including a permanent `Registrar horas` nav item.
- Removal of services-first vocabulary from every legacy surface.

## Data model audit

### Recommended approach

Hour Entry should be a derived view model, not a new persisted entity, in this block.

Reasoning:

- All required fields already exist across `ServiceAssignment`, `ServiceJob`, `Worker`, `Property`, `Client`, and `PayrollMonthState`.
- Payroll and lock rules already depend on these existing entities.
- Creating a second persisted hour entity now would duplicate source-of-truth and increase drift risk.

### Derived HourEntry fields supported today

- `id`: derived from service id + assignment id
- `serviceId`
- `assignmentId`
- `workerId`
- `workerName`
- `propertyId`
- `propertyName`
- `clientId`
- `clientName`
- `serviceType`
- `date`
- `startTime`
- `endTime`
- `hoursWorked`
- `hourlyRate`
- `extraAmount`
- `deductions`
- `totalPay`
- `confirmed`
- `serviceStatus`
- `hourStatus`
- `payrollMonth`
- `isLocked`
- `warnings`

No separate persisted `hour_entries` storage was justified by the audit.

## Status audit

Derived `hourStatus` is enough for this block:

- `draft`
- `pending_review`
- `confirmed`
- `issue`
- `excluded`
- `paid`
- `locked`

Status derivation can stay non-persisted because:

- service lifecycle already exists
- confirmation already exists
- month and worker payroll status already exist
- lock state already exists

## Low-risk fixes applied before building Hours

- Added a dedicated Hours module and routes instead of broad service refactors.
- Added low-risk nav and dashboard wording changes to make hours more central.
- Added worker/property links into dedicated hours drilldowns.
- Added payroll links back to `Revisar horas`.
- Added repository-safe confirm-hours behavior through service update plus lock guard.

## Main findings summary

- The current codebase already has the right raw model for hours-first control.
- The biggest gap was product framing and review UX, not storage architecture.
- Payroll already consumes the correct raw source: confirmed assignments on payable services.
- Quick Entry already fits the new primary workflow and should stay the main input.
- A derived Hours module is the correct next step.
- Pipeline, calendar, Google Calendar and Notion work remain intentionally deprioritized.
