# CostaFlow Ops Data Model

## Entities

- Worker: profile, role, base hourly rate, contact information and operational status.
- Client: commercial record and billing identity.
- Property: service location linked to a client.
- ServiceJob: operational service with status, date and worker assignments.
- ServiceAssignment: worker participation with hours, hourly rate, extras, deductions and confirmation state.
- PayrollSummary: monthly worker aggregation generated from confirmed assignments.

## Relationships

- One client can own many properties.
- One property can receive many services.
- One service belongs to one client and one property.
- One service can contain many assignments.
- One worker can appear in many assignments across many services.

## Calculation rules

- Service labor cost is the sum of assignment pay for the service.
- Assignment pay = hours worked x hourly rate + extras - deductions.
- Worker monthly and payroll totals count only services in status `completed`, `reviewed` or `closed`.
- Monthly hours and monthly pay count only confirmed assignments.
- Missing hourly rate resolves safely to `0` and should surface as a warning.

## Payroll logic

- Payroll summaries are generated from repositories, not from UI pages.
- Each worker receives a monthly rollup with total services, hours, extras, deductions and estimated pay.
- Status in the current mock repository is derived from whether the worker has payable volume in the month.

## Warning logic

- Service warnings validate related entities, assignments and missing rates.
- Worker warnings combine profile-level checks and operational assignment checks.
- Property warnings validate client linkage and inactive states.
- Dashboard warnings aggregate service, worker, property and payroll warnings into a prioritized list.
