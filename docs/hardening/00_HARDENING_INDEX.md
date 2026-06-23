# Block 16 Hardening Index

Sprint 31 is the final hardening pass for the finished local-first app. This folder separates each QA and release-readiness area into a focused document instead of one oversized audit.

## Documents

- `01_RUNTIME_BOUNDARIES.md`: confirms that runtime stays local-first and that backend, Supabase, auth and payment activation remain inactive.
- `02_ROUTE_SMOKE_QA.md`: code-level route verification for shell routes, detail routes, edit routes and wildcard fallback.
- `03_VISUAL_QA.md`: code-level visual consistency review plus low-risk copy and spacing polish.
- `04_MOBILE_QA.md`: responsive audit for shell, StepFlow, closure cards, settings navigation and narrow-screen action rows.
- `05_STEPFLOW_FORMS_QA.md`: review of create, edit and review flows with selector, validation and summary checks.
- `06_SETTINGS_QA.md`: settings architecture, safety tools, validation and helper-text review.
- `07_HOURS_PAYROLL_QA.md`: hours-first logic, review actions, closure inclusion rules and worker monthly closures.
- `08_DATA_SAFETY_QA.md`: backup, import, reset, namespace scope and audit coverage review.
- `09_PERFORMANCE_BUNDLE.md`: build output review and the route-level lazy loading change applied in this block.
- `10_RELEASE_READINESS.md`: honest summary of what is ready, what is still not tested in browser, and what remains deferred.

## Validation basis

- Code review over active runtime files in `src`
- Search-based boundary audit for storage, backend and network usage
- `npm run lint`
- `npm run build`

Browser visual QA was not performed in this sprint.
