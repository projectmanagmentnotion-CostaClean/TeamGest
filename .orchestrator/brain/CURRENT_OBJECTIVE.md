# Objective

Finish and professionalize TeamGest as a tested, migration-ready, local-first hours-first operations system without rebuilding certified behavior.

# Why

The local app is feature-complete for its current workflow but lacks automated domain/storage tests and browser-driven QA evidence.

# Scope

Build the smallest professional test foundation; run live TeamGest preview and browser smoke QA; fix proven integrity, payroll, accessibility, responsive, storage and recovery defects; define safe backend-neutral repository/auth/data contracts only where supported by repository evidence.

# Out of scope

Main merge, production deployment, real users/data, Supabase Production, secrets, payments, calendar, pipeline, broad CRM, Notion or Google Calendar integrations.

# Acceptance criteria

- Critical domain and storage behavior has deterministic automated coverage.
- All documented primary routes pass localhost smoke QA at desktop and representative mobile viewport.
- Local adapter, namespace, migrations, backup/import/reset and locked-month protections remain compatible.
- Build, lint, typecheck, tests, browser QA and independent review pass with P0=0, P1=0 and P2_BLOCKING=0.

# Allowed autonomous work

Repository inspection, isolated branch/worktree changes, tests, local preview, synthetic fixtures, safe refactors, documentation, local/QA schema preparation, commits and branch pushes.

# Requires human approval

Main merge, public/production deployment, production credentials/secrets, Supabase Production mutation, real-data migration, destructive real-data operation, billing/payment and undefined payroll/business policy.

# Stop conditions

Unavoidable login/2FA/CAPTCHA, unavailable production-only credential, destructive real-data operation, or an unresolved policy decision not defined by repository evidence.

# Expected verification

Focused tests, full test suite, browser route and flow smoke, mobile smoke, migration dry-run tests where applicable, lint, typecheck, production build, localhost health and independent review.
