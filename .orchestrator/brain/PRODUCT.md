# Users

Internal Costa Clean operators and managers using a browser-local operational tool.

# Core use cases

- Register completed work and hours quickly.
- Review, correct, exclude or confirm hour entries.
- Close a month worker by worker and track internal payment readiness.
- Maintain workers, clients, properties and services.
- Protect local data through backup, import, reset and audit workflows.

# Product scope

Hours-first local operations with repository-backed local persistence and migration-ready contracts.

# Out of scope

Backend activation, Supabase runtime, authentication, RLS, multi-user sync, real payments, exports, calendar, pipeline, CRM expansion and production data migration.

# Domain concepts

Worker, Client, Property, ServiceJob, ServiceAssignment, derived HourEntry, PayrollSummary, PayrollMonthState, audit and typed settings.

# Major workflows

REGISTER HOURS -> REVIEW HOURS -> RESOLVE ISSUES -> MONTHLY WORKER CLOSURE -> INTERNAL PAYMENT FOLLOW-UP.

# Success criteria

Critical local domain/storage behavior is deterministic and tested; browser QA covers the live routes; local-first behavior and data compatibility remain intact.
