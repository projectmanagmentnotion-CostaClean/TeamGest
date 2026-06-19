# Codex Workflow

## Delivery rules

Work sprint by sprint. Keep scope explicit, finish the requested architecture and avoid leaking future business logic into the current implementation.

## Validation

Always run the build before closing a sprint. Run lint whenever the project exposes a lint script and fix all errors before finishing.

## Git discipline

Always commit the completed sprint. Push when a remote exists. If no remote exists, leave the repository clean after the local commit and provide the exact commands required to publish it.

## Editing discipline

Do not make quick overrides or large mixed files. Keep modules focused, files small and responsibilities easy to trace.
