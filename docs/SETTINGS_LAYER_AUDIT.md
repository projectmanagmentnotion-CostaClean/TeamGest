# Settings Layer Audit

## Scope

This audit reviews the real Block 12 runtime before Block 13 settings work:

- `src/modules/settings`
- `src/infrastructure/storage`
- `src/infrastructure/audit`
- `src/infrastructure/repositories`
- `src/app`
- `src/components/layout`
- `src/domain`
- `docs/APP_BLUEPRINT.md`
- `docs/DATA_MODEL.md`
- `docs/MODULE_RULES.md`
- `docs/UX_SYSTEM.md`
- `docs/QA_CHECKLIST.md`

## 1. Current settings structure

### What already existed

- `/settings` already existed and was routed through the shared shell.
- The page was a local control center for:
  - storage overview
  - storage health
  - data safety checklist
  - backup export
  - backup import
  - audit log
  - reset actions
- Existing components were operational and local-first, but they were not a typed application settings layer yet.

### What was only backup/import/reset

- `BackupExportPanel.tsx`
- `ImportDataPanel.tsx`
- `ResetDemoDataPanel.tsx`
- `StorageOverview.tsx`
- `StorageHealthPanel.tsx`
- `AuditLogPanel.tsx`
- `DataSafetyChecklist.tsx`
- `LocalDataWarning.tsx`

These components exposed storage health and destructive tooling, not product configuration.

### What configuration already existed

- `src/infrastructure/storage/storageKeys.ts` already defined `SETTINGS_KEY`.
- `src/modules/settings/services/settingsStorage.ts` exposed `getLocalSettingsState()` and `saveLocalSettingsState()`.
- `src/infrastructure/storage/storageAdmin.ts` stored only a tiny `LocalSettingsState` object.
- Before Block 13, that settings state only supported UI-local concerns, not business settings.

### What storage keys existed

Recognized TeamGest keys before this block:

- `teamgest:services:created`
- `teamgest:services:overrides`
- `teamgest:services:archived`
- `teamgest:workers:created`
- `teamgest:workers:overrides`
- `teamgest:workers:archived`
- `teamgest:clients:created`
- `teamgest:clients:overrides`
- `teamgest:clients:archived`
- `teamgest:properties:created`
- `teamgest:properties:overrides`
- `teamgest:properties:archived`
- `teamgest:payroll:months`
- `teamgest:payroll:audit`
- `teamgest:app:audit`
- `teamgest:storage:metadata`
- `teamgest:settings`
- `teamgest:backup:history`

### What app settings were persisted

Before Block 13, no typed `AppSettings` model existed.

The `teamgest:settings` namespace held only:

- `importMode?: 'text' | 'file'`

There was no typed structure for:

- company identity
- hours defaults
- quick entry behavior
- hour review policy
- display preferences
- system mode flags

### What data safety functions existed

- `getStorageHealthReport()`
- `getStorageMetadata()`
- `buildTeamGestBackup()`
- `parseTeamGestBackup()`
- `restoreTeamGestBackup()`
- `markLastBackupAt()`
- `markLastImportAt()`
- `markLastResetAt()`
- `migrateStorageIfNeeded()`
- `clearServiceLocalState()`
- `clearEntityManagementLocalState()`
- `clearPayrollLocalState()`
- `clearAllTeamGestLocalData()`

These were already solid local-first primitives and should be preserved.

## 2. Storage and persistence

### Where localStorage is accessed

Direct runtime access is already centralized inside infrastructure:

- `src/infrastructure/storage/localStorageAdapter.ts`
- repository files that call `readJson()` / `writeJson()`
- `src/infrastructure/audit/auditRepository.ts`

The audit found no direct `localStorage` API usage inside `src/app`, `src/components` or `src/modules`.

### Are settings stored through a safe abstraction?

Partially.

- The namespace already existed.
- Reads and writes already flowed through infrastructure storage helpers.
- But the stored payload was not typed or validated as a business settings model.

### Are backup/import/reset covering settings?

Yes, structurally.

- `storageBackup.ts` already exported `settings` in the recognized payload.
- `restoreTeamGestBackup()` already restored `settings`.
- `clearAllTeamGestLocalData()` already removed `SETTINGS_KEY`.

However, before Block 13:

- settings schema was not validated
- invalid settings could be restored as arbitrary records
- no dedicated settings reset action existed

### Are settings namespaced?

Yes.

- Existing key: `teamgest:settings`

### Is there versioning or migration support?

- Storage-level versioning existed through `StorageMetadata.schemaVersion`.
- Storage migrations existed in `storageMigrations.ts`.
- Settings-level versioning did not exist yet.

### Are invalid settings safely handled?

Not fully.

- Generic JSON parsing was safe.
- But there was no typed `AppSettings` validation or fallback layer.
- Invalid inner settings values could survive in storage until consumed manually.

## 3. Operational needs for TeamGest

Given the app is now hours-first, the most useful real settings are:

### Business and company identity

- company name
- default city
- fixed currency `EUR`
- optional internal notes

### Hours and payroll behavior

- default hourly rate fallback
- minimum hours per entry
- rounding increment for schedule-derived hours
- require rate before payroll inclusion
- require confirmation before payroll inclusion
- allow or disallow future completed entries

### Quick Entry behavior

- default confirmed assignment state
- default past-date service status
- default future-date service status
- whether payroll impact messaging stays visible
- remembered worker/property flags for later use

### Hour review behavior

- whether unresolved review entries block monthly closure
- whether incident entries can still count in payroll
- whether excluded entries can be restored
- whether incident note is required
- whether exclusion reason is required

### Service defaults

- default service type
- default assignment confirmation
- keep locked-payroll edit blocking explicit

### Worker defaults

- worker default rate should still live on worker records
- app-level fallback hourly rate is still useful when worker data is incomplete

### UI/display preferences

- density
- technical id visibility
- date format preference
- time format preference

### Data safety

- backup reminder enabled
- backup reminder frequency
- show or hide the visible danger zone
- require typed confirmation for full reset

### Audit/privacy

- keep audit local-only
- avoid storing full settings payloads in audit events
- show technical ids only when explicitly enabled

## 4. What not to add yet

These settings do not make sense in the current runtime and should stay out:

- backend connection settings
- Supabase activation settings
- authentication providers
- Google Calendar integration
- Notion integration
- multi-user permissions
- invoicing settings
- complex tax or fiscal settings
- payment rails or bank configuration

## 5. Recommended settings architecture

Recommended and implemented direction:

- `src/domain/settings/appSettings.types.ts`
- `src/domain/settings/appSettingsDefaults.ts`
- `src/domain/settings/appSettingsValidation.ts`
- `src/infrastructure/repositories/appSettingsRepository.ts`
- `src/modules/settings/services/appSettingsService.ts`

Why this architecture fits:

- keeps settings typed and modular
- preserves local-first storage boundaries
- centralizes normalization and fallback defaults
- avoids direct storage calls from UI
- gives other modules a safe read path for low-risk runtime use

## 6. Low-risk fixes identified before implementation

Low-risk fixes that made sense:

- convert Settings from a storage-tools page into a real sectioned settings layer
- preserve backup/import/reset behavior while adding typed settings
- add safe fallback defaults around corrupted or missing settings
- separate danger-zone visibility from routine data-safety actions
- add audit events for settings updates and settings reset
- hide technical ids from the audit view unless explicitly enabled

## Summary

Before Block 13, TeamGest had strong local storage tooling but not a real product settings layer.

The right next step was:

1. keep storage, audit, backup, import and reset behavior intact
2. introduce a typed `AppSettings` model with defaults and validation
3. store it only through infrastructure abstractions
4. apply it first to Quick Entry, hour review and payroll
5. avoid speculative backend, auth, calendar or fiscal settings
