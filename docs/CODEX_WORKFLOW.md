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
