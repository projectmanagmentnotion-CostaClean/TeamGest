# Performance And Bundle

## Build review

The pre-Block-16 build had a Vite chunk-size warning on the main bundle. That warning did not fail the build, but it showed that routes were still loaded too eagerly.

## Findings

- `src/app/routes.tsx` was importing every page eagerly.
- Runtime code does not import docs or planning files into active bundles.
- No large mock-data activation issue was found beyond the normal local repository footprint.
- Route-level code splitting was feasible with the current app structure and did not require new dependencies.

## Fix applied

- Implemented route-level `React.lazy` loading for major page routes.
- Added a simple shared route loading fallback inside `src/app/routes.tsx`.

## Build result after fix

- `npm run build` succeeds.
- Main bundle warning no longer appears in the current build output.
- Runtime output now splits pages into smaller route chunks such as dashboard, quick entry, hours, payroll and settings.

## Deferred

- No deep per-component micro-splitting was added.
- No speculative memoization or over-optimization work was added.
