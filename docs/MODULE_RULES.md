# CostaFlow Ops Module Rules

## Ownership boundaries

Each business module owns its pages and any future module-specific components or services. Cross-module design primitives belong in the shared UI layer only when they are generic.

## Shared UI constraints

UI components must stay generic and reusable. They should not encode worker, client, property or payroll rules directly.

## Logic separation

Business logic must not live inside UI components. Future calculations, repositories and workflows should be added in dedicated module or infrastructure layers.

## Data policy for Sprint 1

Real data must not be added in this sprint. No backend, no direct persistence and no production integrations should be introduced until a future sprint explicitly allows them.
