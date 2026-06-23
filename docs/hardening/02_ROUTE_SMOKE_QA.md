# Route Smoke QA

This is a code-level route smoke audit. Browser clicking was not performed in this sprint.

## Routes verified

- `/dashboard`
- `/quick-entry`
- `/hours`
- `/hours/review`
- `/hours/workers/:workerId`
- `/hours/properties/:propertyId`
- `/workers`
- `/workers/new`
- `/workers/:id`
- `/workers/:id/edit`
- `/clients`
- `/clients/new`
- `/clients/:id`
- `/clients/:id/edit`
- `/properties`
- `/properties/new`
- `/properties/:id`
- `/properties/:id/edit`
- `/services`
- `/services/new`
- `/services/:id`
- `/services/:id/edit`
- `/payroll`
- `/payroll/:month`
- `/payroll/:month/workers/:workerId`
- `/settings`
- wildcard fallback

## Findings

- All listed routes exist in `src/app/routes.tsx`.
- Root redirect still points to `/dashboard`.
- Wildcard fallback still redirects to `/dashboard`.
- Sidebar navigation and mobile navigation point only to live routes.
- Dashboard quick actions point to live routes.
- Invalid entity ids still resolve to `EmptyState` or safe fallback pages for worker, client, property and service details and edit routes.
- Invalid payroll month params still fall back safely to the current month with a warning banner.
- No active route imports point to removed legacy files.

## Fixes applied

- Replaced eager page imports in `src/app/routes.tsx` with route-level `React.lazy` loading.
- Added a simple route loading fallback so lazy-loaded pages still render a stable shell and content placeholder.

## Result

Route graph remains intact and now loads more safely as separate chunks.
