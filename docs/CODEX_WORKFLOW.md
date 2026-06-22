# Codex Workflow

## Delivery rules

Work sprint by sprint. Keep scope explicit, finish the requested architecture and avoid leaking future business logic into the current implementation.

## Validation

Always run the build before closing a sprint. Run lint whenever the project exposes a lint script and fix all errors before finishing.

## Git discipline

Always commit the completed sprint. Push when a remote exists.

## Editing discipline

Do not make quick overrides or large mixed files. Keep modules focused, files small and responsibilities easy to trace.

## Combined sprint blocks

When a request includes multiple sprints in one block, the final report should separate what was completed for each sprint.

## Closeout discipline

Always include build, lint, git status, commit hash and push status in the final report. Avoid unrelated refactors while closing a sprint block.

## Block 3 reporting

Combined sprint block 3 should report clients work and properties work separately, even when both are delivered in one implementation pass.

## Block 4 reporting

Combined sprint block 4 should report services read-only work and StepFlow work separately. Any persistence limitation must be stated explicitly.

## Block 5 reporting

Combined sprint block 5 should report payroll calculation work and review-lock workflow work separately. Any persistence limitation must be stated explicitly.

## Block 6 reporting

Combined sprint block 6 should report storage management work and safety-audit work separately. Any localStorage limitation must be stated explicitly and honestly.

## Block 7 reporting

Combined sprint block 7 should report visual polish work and mobile-first work separately. Any lack of browser visual QA should be stated explicitly and honestly.

## Block 8 reporting

Combined sprint block 8 should report QA-hardening work and data-real-readiness work separately. Any lack of automated tests or browser visual QA should be stated explicitly and honestly.

## Block 9 reporting

Combined sprint block 9 should report entity CRUD work and Quick Work Entry work separately. Any local-only persistence or payroll-lock limitation must be stated explicitly.

## Block 10 reporting

Block 10 should be reported as CRUD hardening plus Quick Entry polish. Any code-level QA limitation, missing browser visual QA or local-only runtime constraint must be stated explicitly.

## Block 11 reporting

Block 11 should be reported as hours-first audit plus Hours Control module delivery. Any limitation around derived-only hour entries, missing browser visual QA or local-only runtime must be stated explicitly.

## Block 12 reporting

Block 12 should be reported as hours review actions plus StepFlow Pro selector upgrade. Any limitation around shared service time fields, missing browser visual QA or local-only runtime must be stated explicitly.

## Block 13 reporting

Block 13 should be reported as mobile StepFlow hardening plus Quick Entry mobile polish. Any lack of browser visual QA or remaining local-only runtime limitations must be stated explicitly.

## Mobile StepFlow delivery rule

When changing shared form flows, verify that mobile does not keep desktop side rails, compressed columns or overflowing selector panels. Shared fixes should land in reusable StepFlow and selector layers before page-specific overrides are considered.
