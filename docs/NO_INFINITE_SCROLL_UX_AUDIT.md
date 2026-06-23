# No Infinite Scroll UX Audit

## Scope

Routes reviewed in code for Block 15:

- `/dashboard`
- `/quick-entry`
- `/hours`
- `/hours/review`
- `/workers`
- `/workers/new`
- `/clients`
- `/clients/new`
- `/properties`
- `/properties/new`
- `/services`
- `/services/new`
- `/payroll`
- `/payroll/:month`
- `/settings`

## Current strengths

- Heavy create and edit flows already use StepFlow instead of giant stacked forms.
- Searchable selectors already replaced the worst long selector walls.
- Main list pages already use cards plus compact filter bars instead of raw dense tables.
- Settings already uses section switching instead of a single giant settings wall.

## Current risks

- `/payroll/:month` still feels like one long worker list without enough grouping.
- `/payroll` still emphasizes generic monthly stats more than clear worker payment readiness.
- `/hours/review` can become a long sequence of repeated cards when many pending entries exist.
- `/hours` can become a long single list when the month contains many entries.
- `/workers/new` and `/services/new` are structurally good, but helper text and final review clarity can still improve.
- `/dashboard` still mixes operational focus with some broader CRM-like actions that can be deprioritized.

## Low-risk fixes approved for this block

- strengthen grouped sections on payroll month closure
- add worker-centered payment cards instead of generic repeated rows
- support targeted review links from closures into hours review
- improve summary and review framing in worker and service creation flows
- keep dashboard focused on:
  - registrar horas
  - control de horas
  - cierres del mes
  - incidencias

## Deferred items

- no full pagination framework
- no virtualized list system
- no tab framework dependency
- no export-oriented table redesign

## Block 15 target

The app should feel controlled and sectioned even when the dataset grows:

- grouped card sections instead of endless lists
- worker-by-worker closure surfaces instead of flat payroll summaries
- review routes that can be opened already filtered from closure actions
- StepFlow surfaces with visible summary and helper text, not long unstructured form walls
