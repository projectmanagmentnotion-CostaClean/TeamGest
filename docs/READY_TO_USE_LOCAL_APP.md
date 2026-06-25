# Ready To Use Local App

TeamGest is ready for internal local use in its current product scope.

## What it is ready for

- registrar horas de trabajo ya realizado
- revisar pendientes, incidencias, exclusiones y bloqueos
- consultar horas por trabajador e inmueble
- seguir cierres mensuales por trabajador
- gestionar trabajadores, clientes, inmuebles y servicios en local
- controlar ajustes, backup, import, reset y auditoria local

## Core daily flow

1. `Dashboard` tells the operator what matters today.
2. `Registrar horas` is the main input path.
3. `Control de horas` shows what exists and what needs attention.
4. `Revision de horas` resolves what should or should not enter the monthly closure.
5. `Cierres` shows who is ready, who is blocked and what remains pending.
6. `Ajustes` controls defaults and local data safety.

## Ready-to-use scope

- local-first only
- hours-first workflow
- StepFlow-based create and correction flows
- warning-driven review and closure logic
- mobile-friendly shell and stacked action behavior

## Honest limitations

- Browser visual QA was not performed in this sprint. The final pass is code-level plus build/lint validation.
- The app remains browser-local only.
- There is no backend, Supabase, auth or multi-user synchronization.
- There are no real payments.
- There is no export, PDF or CSV output.
- There is no calendar, Google Calendar or pipeline module.

## Intentionally not built

- export / PDF / CSV
- calendar
- pipeline
- backend
- Supabase
- auth
- real payments
