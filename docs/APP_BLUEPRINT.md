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

Sprint 1 establishes the application shell, strict TypeScript routing, base UI kit, visual tokens and project documentation. It intentionally stops before domain modeling and business logic so later sprints can evolve on a clean foundation.
