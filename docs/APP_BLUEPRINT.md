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
- Calculations, warnings or mock business datasets.

## Sprint 1 status

Sprint 1 established the application shell, strict TypeScript routing, base UI kit, visual tokens and initial project documentation.

## Block 2 status

Block 2 combines Sprint 3 and Sprint 4 over a mock-only repository layer.

- Sprint 3 turns the dashboard into an operational command center with KPIs, today services, activity feed, quick actions, operational focus and warning aggregation.
- Sprint 4 delivers a complete read-only workers module with worker list summaries, filter states, worker profile detail, monthly summary, service history and worker-specific warnings.

## Still intentionally excluded

- CRUD actions and real create/edit/delete flows.
- Real backend or database.
- Authentication.
- Payments.
- Any mutation of mock data from the UI.

## Block 3 status

Block 3 combines Sprint 5 and Sprint 6 on top of the same mock-only repository layer.

- Sprint 5 delivers the complete read-only clients module with client list summaries, client detail, property relationships, service history and client warnings.
- Sprint 6 delivers the complete read-only properties module with property list summaries, property detail, worker participation history, service history and property warnings.

## Still mock and local only

- No CRUD flows.
- No backend or database.
- No authentication.
- No payments.
