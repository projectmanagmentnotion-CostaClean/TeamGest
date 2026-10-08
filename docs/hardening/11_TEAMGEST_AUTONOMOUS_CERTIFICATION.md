# TeamGest Autonomous Certification

## Scope

This phase hardens the local-first TeamGest runtime on the isolated worker branch
`codex/teamgest-finish`, based on canonical `main` at `c901e6b02e6302da7d911ecc091505bdc03b4c6e`.

No production data, Supabase project, authentication provider, or remote runtime was activated.

## Validation evidence

- `npm test`: 2 files, 7 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- Browser preview: `http://127.0.0.1:3008/` on the isolated TeamGest worktree.
- Browser route smoke: dashboard, quick entry, hours, hours review, workers, properties, clients, services, payroll and settings loaded without route errors after lazy modules settled.
- Quick-entry validation visibly kept `Continuar` disabled until a worker is selected.
- Hours review visibly kept invalid-rate confirmations disabled and exposed correction/exclusion actions.
- Settings visibly reported local browser storage and planning-only backend/auth status.

## Contracts added

- `accessPolicy.ts` contains a pure, inactive least-privilege role/capability policy.
- `migrationValidation.ts` validates TeamGest backup shape, supported schema version and duplicate entity ids before any future import.
- The existing async remote repository contracts and Supabase schema plan remain planning-only; no network adapter is wired into the runtime.

## Human gates

- Main branch merge remains a human gate.
- Auth provider, RLS policy, Supabase project, real-adapter wiring and production migration remain deferred until explicit security and rollout approval.
