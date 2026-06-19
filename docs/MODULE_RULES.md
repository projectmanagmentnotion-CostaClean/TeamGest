# CostaFlow Ops Module Rules

## Ownership boundaries

Each business module owns its pages and any future module-specific components or services. Cross-module design primitives belong in the shared UI layer only when they are generic.

## Shared UI constraints

UI components must stay generic and reusable. They should not encode worker, client, property, service or payroll rules directly.

## Logic separation

Business logic must not live inside UI components. Calculations, repositories, draft logic and workflows should live in dedicated module or infrastructure layers.

## Repository policy

Pages must not import mock data directly. Read access must go through `getRepositories()`.

## Block 2 ownership

- Dashboard owns dashboard calculations and presentation components.
- Workers owns worker calculations, worker components and worker warnings.

## Block 3 ownership

- Clients owns client calculations, client components and client warnings.
- Properties owns property calculations, property components and property warnings.
- Cross-module navigation through links is allowed, but business logic should remain owned by the source module.

## Block 4 ownership

- Services owns service calculations, service components, service warnings, service lifecycle and new service draft validation.
- StepFlow draft logic must stay outside UI components.
- New service may persist only through repository abstraction and the localStorage adapter.
- Seed mock data must never be mutated.
- Detail pages should resolve route ids through repositories, not inline data lookups.

## Block 5 ownership

- Payroll owns payroll calculations, payroll components, payroll warnings, payroll status flow and payroll storage helpers.
- Payroll local state must persist only through the payroll repository and localStorage adapter.
- UI components must not call localStorage directly.
- Locked closure is operational only, not fiscal or legal.

## Block 6 ownership

- Storage infrastructure owns direct localStorage access, key namespaces, metadata, health checks, backups and migrations.
- Settings owns backup, import, reset and local data safety UI flows.
- App audit writes belong to the audit repository, not to UI components.
- Destructive local actions require explicit confirmation.

## Block 7 ownership

- Shared UI primitives are allowed only when they stay generic and reusable across modules.
- Module-specific business logic must stay inside the owning module even during polish work.
- Visual polish must not introduce business rules into UI primitives.

## Block 8 ownership

- QA hardening may fix low-risk bugs, but must not broaden runtime scope into new features.
- Real-data planning files must stay isolated from active runtime imports.
- Repository readiness types may be added for future work, but current repositories do not switch mode in this block.
