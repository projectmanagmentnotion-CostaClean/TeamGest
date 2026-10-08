# Stack

React 19, TypeScript, Vite and React Router.

# Major components

`src/app` composes providers and lazy routes; `src/modules` owns business areas; `src/domain` owns types and rules; `src/infrastructure` owns repositories, localStorage, migrations, backup/import and audit; `src/components` owns generic UI and StepFlow; `src/utils` owns shared pure helpers.

# Data boundaries

Pages consume `getRepositories()`. Business calculations stay in pure services or module helpers. Local persistence uses the `teamgest:` namespace and stable IDs. `HourEntry` is derived, not a second source of truth.

# External services

None active. `src/infrastructure/real` and Supabase/auth documents are planning-only boundaries.

# Runtime model

Browser-local localStorage adapter, local audit and local backup/import/reset. Vite serves the frontend in development and production preview.

# Security boundaries

No enterprise security claim. Backups and localStorage may contain sensitive operational/payroll information. Do not add real credentials or owner data to tests.

# Deployment model

Localhost/internal local-first use only. Main merge, public deployment, production secrets and Supabase Production are human gates.

# Known architecture constraints

No automated test foundation or browser E2E existed at the verified baseline. Keep migration-ready contracts backend-neutral without replacing the local adapter.
