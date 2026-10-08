# Brain

TeamGest is a local-first operational application for Costa Clean.

## Product

The canonical product direction is hours-first internal operations: register worked hours, review issues, close workers monthly, and follow up internal payment readiness.

## Current truth

- Repository evidence is authoritative at canonical main head c901e6b.
- Existing local-first modules are implemented: dashboard, Quick Entry, hours control/review, worker/property drilldowns, workers, clients, properties, services, monthly closures, settings, audit, storage metadata, migrations, backup/import/reset, responsive StepFlow and lazy routes.
- Automated tests and browser QA are the current engineering gaps.
- Runtime remains browser-local through localStorage. Backend, Supabase, auth, RLS, payments and multi-user execution are not active.

## Operating constraints

Preserve the `teamgest:` namespace, local data compatibility, migrations, repository abstraction, hours-first UX and documented module ownership. Do not add CRM, calendar, pipeline or payment scope.
