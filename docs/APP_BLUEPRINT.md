# CostaFlow Ops App Blueprint

## What the app is

CostaFlow Ops is a lightweight operations CRM for a cleaning business. It is designed to organize workers, clients, properties, service jobs, assignments and monthly closures from a single operational workspace.

## Core modules

- Dashboard: operational overview, alerts and quick summaries.
- Workers: worker profiles, hourly rates, availability and monthly workload.
- Properties: service locations linked to each client.
- Clients: commercial relationships and linked properties.
- Services: service lifecycle, assignments and labor cost control.
- Payroll: monthly summaries and closure workflow.
- Settings: controlled operational configuration.

## Future workflow

The intended workflow starts with service planning, continues with worker assignment and finishes with monthly closure review. The current shell, routing and reusable components are prepared to support that sequence without mixing future business rules into the UI layer.

## Intentionally not included yet

- Real backend or database connection.
- Supabase.
- Authentication and role management.
- Payments or invoicing logic.
- Real forms, CRUD flows or persistence.

## Sprint 1 status

Sprint 1 established the application shell, strict TypeScript routing, base UI kit, visual tokens and initial project documentation.

## Block 2 status

Block 2 combines Sprint 3 and Sprint 4 over a mock-only repository layer.

- Sprint 3 turns the dashboard into an operational command center with KPIs, today services, activity feed, quick actions, operational focus and warning aggregation.
- Sprint 4 delivers a complete read-only workers module with worker list summaries, filter states, worker profile detail, monthly summary, service history and worker-specific warnings.

## Block 3 status

Block 3 combines Sprint 5 and Sprint 6 on top of the same mock-only repository layer.

- Sprint 5 delivers the complete read-only clients module with client list summaries, client detail, property relationships, service history and client warnings.
- Sprint 6 delivers the complete read-only properties module with property list summaries, property detail, worker participation history, service history and property warnings.

## Block 4 status

Block 4 combines Sprint 7 and Sprint 8 over the existing repository layer.

- Sprint 7 delivers the complete read-only services module with list, detail, warnings, lifecycle, assignments and labor cost summaries.
- Sprint 8 delivers the guided New Service StepFlow with draft validation and local repository persistence for newly created services.

## Persistence note

New services can be stored only in browser localStorage through the repository abstraction. There is still no backend persistence, auth or payments.

## Still mock and local only

- No production CRUD flows.
- No backend or database.
- No authentication.
- No payments.
- Any persistence remains local to the browser.

## Block 5 status

Block 5 combines Sprint 9 and Sprint 10 over local repository and localStorage state.

- Sprint 9 delivers the monthly payroll module with month summary, worker rows, warnings and service breakdown.
- Sprint 10 delivers review, paid and locked closure tracking with localStorage-only state, lock snapshot and audit trail.

## Payroll persistence note

Payroll review, paid and locked states are internal operational markers stored in localStorage. They do not execute real payments and do not represent legal or fiscal closure.

## Block 6 status

Block 6 combines Sprint 11 and Sprint 12 over the existing local-first architecture.

- Sprint 11 consolidates browser persistence with centralized storage keys, metadata, health checks, migrations, backup export, import and reset tools.
- Sprint 12 adds app-level audit, safety checklist, storage risk reporting and protected destructive actions inside Settings.

## Local data management note

Services, payroll states, payroll audit, app audit and local settings are still browser-only data. There is still no backend, auth or real payment infrastructure.

## Block 7 status

Block 7 combines Sprint 13 and Sprint 14 over the existing local-first product.

- Sprint 13 improves visual hierarchy, shared UI primitives, calmer cards, status consistency and premium operational polish.
- Sprint 14 improves mobile-first behavior, responsive grids, tap targets, StepFlow readability and small-screen usability.

## Product quality note

This block adds no backend, auth, payments or new database capabilities. It focuses on presentation quality and responsive operational use.

## Block 8 status

Block 8 combines Sprint 15 and Sprint 16 on top of the same local-first runtime.

- Sprint 15 performs QA hardening, route verification, bug fixes, and checklist documentation.
- Sprint 16 adds data-real readiness contracts and planning documents without activating Supabase or auth.

## Runtime note

Local-first runtime remains active. Supabase, auth, and real backend execution are still intentionally disabled.
