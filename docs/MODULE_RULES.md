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
