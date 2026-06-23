# Finished Local App Checklist

## What "finished local-first version" means

This version is considered operationally finished for its current purpose:

- local-first only
- hours-first workflow
- worker payment follow-up inside the app
- no backend, auth or real payments

## Finished capabilities

- Quick Entry for fast hour registration
- Hours Control for filtered review and follow-up
- Hours Review for pending, issue, excluded and locked entries
- Monthly closures centered on worker payment cards
- Worker, client, property and service CRUD management
- Settings with local rules, safety and audit visibility
- Backup, import and reset scoped to TeamGest data
- Local audit trail for operational and settings changes

## Current runtime boundaries

- No backend or Supabase runtime
- No authentication or multi-user model
- No PDF, CSV or export workflow in this block
- No calendar, Google Calendar sync or pipeline board
- `HourEntry` remains derived, not persisted separately
- Payment status is internal tracking only

## Known limitations

- Browser visual QA was not performed in this block
- Data remains tied to the current browser unless exported and restored manually
- Large datasets may still need future pagination or code-splitting work
- Export-oriented closure documents remain future work

## Next future modules

- export and PDF output
- CSV export
- calendar planning
- Google Calendar sync
- backend and Supabase activation
- auth and multi-user permissions

## Block 16 hardening status

- Final hardening and release-readiness review completed in one sprint.
- QA evidence is now separated across `docs/hardening/`.
- Runtime still has no backend, Supabase, auth, payments, export, calendar or pipeline activation.
- Route-level lazy loading was added to reduce eager bundle cost.
- Browser visual QA remains a known limitation.
