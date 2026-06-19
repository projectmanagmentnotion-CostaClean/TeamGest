# Migration Plan Local to Real

## Goal

Move from validated local-first data into a future backend without losing references or audit history.

## Proposed sequence

1. Export a local TeamGest JSON backup.
2. Validate the backup schema and namespace integrity.
3. Transform local entities to backend table shapes.
4. Import in dependency order:
   - workers
   - clients
   - properties
   - service jobs
   - service assignments
   - payroll months and worker statuses
   - payroll audit entries
   - app audit entries
5. Verify imported counts against backup summary.
6. Verify relation integrity on sample records.
7. Preserve audit data and migration metadata.

## Rollback concept

- keep the original local backup untouched
- log backend import batch ids
- if counts or references fail, delete imported batch or restore into clean environment

## Migration checklist

- backup exported
- schema version recorded
- enum mapping reviewed
- archived/inactive records policy reviewed
- relation counts verified
- audit entries preserved
- spot-checks completed on services and payroll months
