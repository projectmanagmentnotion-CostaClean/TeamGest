# Technical Cleanup Audit

## Executive summary

Block 14 audited the real TeamGest runtime after Blocks 1-13. The codebase is still coherent, local-first and modular, but it had a clear layer of legacy service-step files, older FormFlow remnants and settings copy that no longer matched the hours-first direction.

The safe Sprint 28 work focused on:

- removing proven-unused legacy files
- keeping live StepFlow and searchable selector paths intact
- polishing `/settings` copy, structure clarity and runtime messaging
- updating documentation to reflect the current hours-first local runtime

No backend, Supabase, auth, payments, pipeline or calendar work was activated.

## Safe cleanup candidates

Proven unused and safe to remove after import search:

- `src/modules/services/components/new-service/NewServiceStepAssignments.tsx`
- `src/modules/services/components/new-service/NewServiceStepClient.tsx`
- `src/modules/services/components/new-service/NewServiceStepProperty.tsx`
- `src/modules/services/components/new-service/NewServiceStepReview.tsx`
- `src/modules/services/components/new-service/NewServiceStepSchedule.tsx`
- `src/modules/services/components/new-service/NewServiceStepType.tsx`
- `src/modules/services/components/new-service/NewServiceStepWorkers.tsx`
- `src/modules/services/components/new-service/NewServiceStepper.tsx`
- `src/modules/services/components/new-service/NewServiceSuccess.tsx`
- `src/modules/services/components/quick-entry/QuickEntryShell.tsx`
- `src/modules/services/services/newServiceDraft.ts`
- `src/modules/services/services/newServiceValidation.ts`
- `src/components/forms/FormFlow.tsx`
- `src/components/forms/FormFlowStep.tsx`

## Do-not-delete list

Still live or intentionally retained:

- `src/components/forms/FormFlowActions.tsx`
- `src/components/forms/FormSummary.tsx`
- `src/components/forms/FormValidationPanel.tsx`
- `src/components/forms/StepFlowScreen.tsx`
- `src/components/forms/StepFlowHeader.tsx`
- `src/components/forms/StepFlowFooter.tsx`
- `src/components/forms/SearchableSelect.tsx`
- `src/components/forms/SearchableEntitySelect.tsx`
- `src/modules/services/components/manage/ServiceFormFlow.tsx`
- current quick-entry step files under `src/modules/services/components/quick-entry`
- planning files under `src/infrastructure/real`
- backup, import, reset and audit infrastructure

## Legacy and unused findings

- The old `src/modules/services/components/new-service` step system was no longer imported by live routes.
- `newServiceDraft.ts` and `newServiceValidation.ts` were only referenced by that legacy step system.
- `QuickEntryShell.tsx` was not imported by the current quick-entry page.
- `FormFlow.tsx` and `FormFlowStep.tsx` were no longer imported anywhere.
- Current worker, client, property and service management flows already rely on the shared StepFlow screen or current reusable form helpers.

## StepFlow and FormFlow findings

- The active standard is `StepFlowScreen` plus `StepFlowHeader` and `StepFlowFooter`.
- `FormFlowActions` remains useful as a compact action wrapper and is still live.
- `FormSummary` remains live in current management flows and should stay.
- Naming overlap existed because `FormFlow.tsx` and `FormFlowStep.tsx` survived after the StepFlow upgrade, even though live flows no longer used them.
- Searchable selectors are correctly used in current high-volume paths such as quick entry worker/property selection and service/property management selectors.
- No giant selector walls remain in current live Quick Entry or ServiceFormFlow paths based on code review.

## Settings QA findings

- The settings section structure was correct, but several controls lacked helper text.
- `SettingsHealthPanel` was too narrow: it exposed version and warnings, but not storage mode, runtime inactivity or backup coverage.
- `SystemSettingsPanel` still used copy such as `Supabase/backend`, `Auth` and raw `planning_only`, which felt too technical.
- `DataSafetySettingsPanel` still referenced a generic danger-zone idea instead of clearer local safety wording.
- `StorageHealthPanel` and payroll lock copy still exposed `localStorage` directly in user-facing strings.
- The data-safety area already had the right operational capabilities: backup, import, reset and audit remained separated and local-first.

## Runtime boundary findings

- No direct `localStorage` usage was found in `src/app`, `src/components` or `src/modules`.
- Runtime storage access remains isolated to infrastructure storage and repository layers.
- No active Supabase, `createClient`, `fetch`, `axios`, auth or backend runtime activation was found in the live app surface.
- Planning-only Supabase material remains documented and intentionally inactive.

## Navigation and copy findings

- Main navigation still matches the hours-first direction well enough: `Inicio`, `Control de horas`, `Servicios`, `Trabajadores`, `Inmuebles`, `Clientes`, `Cierres`, `Ajustes`.
- `/quick-entry` remains intentionally prioritized through CTAs and quick actions rather than permanent main-nav placement.
- The most visible copy drift was inside Settings and payroll lock messaging, not the shell navigation itself.
- User-facing runtime copy should prefer `almacenamiento local del navegador` over `localStorage`.

## Documentation drift findings

- Several docs still said `Quick Work Entry` instead of `Quick Entry`.
- `docs/DATA_MODEL.md` still documented `NewServiceDraft` even though the live runtime now centers on `ServiceInput` and `QuickEntryDraft`.
- `docs/MODULE_RULES.md` still referenced old new-service draft validation as an active ownership rule.
- `docs/QA_CHECKLIST.md` still started from older block framing and needed a Block 14 addition.
- `docs/CODEX_WORKFLOW.md` was missing a specific Block 14 reporting rule.

## Recommended cleanup applied in Sprint 28

- Removed the proven-unused legacy new-service step files.
- Removed unused `QuickEntryShell.tsx`.
- Removed unused `FormFlow.tsx` and `FormFlowStep.tsx`.
- Kept live shared StepFlow, selector and summary utilities intact.
- Expanded settings helper text and clarified local-only runtime messaging.
- Replaced user-facing `localStorage` references in live settings and payroll copy.
- Updated architecture and audit docs to reflect the current runtime.

## Cleanup deferred intentionally

- No broad service-module refactor was done.
- No route or navigation reshuffle was forced beyond current working priorities.
- No planning-only docs or infrastructure files were deleted.
- No browser visual QA claims are made in this block.
- Any legacy wording left only in historical or planning documentation can be cleaned later without runtime risk.
