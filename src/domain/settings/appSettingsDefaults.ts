import type { AppSettings } from './appSettings.types'

export const APP_SETTINGS_VERSION = 1

export const appSettingsDefaults: AppSettings = {
  companySettings: {
    companyName: 'CostaFlow Ops',
    defaultCity: 'Barcelona',
    defaultCurrency: 'EUR',
    notes: '',
  },
  hoursSettings: {
    defaultHourlyRate: 12,
    minimumHoursPerEntry: 0.25,
    roundHoursToNearestMinutes: 15,
    requireRateForPayroll: true,
    requireConfirmedHoursForPayroll: true,
    allowFutureCompletedEntries: false,
  },
  quickEntrySettings: {
    defaultConfirmed: true,
    defaultServiceStatusForPastDate: 'completed',
    defaultServiceStatusForFutureDate: 'scheduled',
    rememberLastWorker: false,
    rememberLastProperty: false,
    showPayrollImpactMessage: true,
  },
  hourReviewSettings: {
    requireReviewBeforePayrollClose: true,
    allowIncidentEntriesInPayroll: false,
    allowExcludedEntriesRestore: true,
    requireNoteForIncident: true,
    requireReasonForExclusion: true,
  },
  serviceSettings: {
    defaultServiceType: 'basic_cleaning',
    defaultAssignmentConfirmed: true,
    blockServiceEditWhenPayrollLocked: true,
  },
  displaySettings: {
    density: 'comfortable',
    showTechnicalIds: false,
    preferredDateFormat: 'dd/MM/yyyy',
    preferredTimeFormat: '24h',
  },
  dataSafetySettings: {
    backupReminderEnabled: true,
    backupReminderFrequency: 'weekly',
    showDangerZone: true,
    requireTypedConfirmation: true,
  },
  systemSettings: {
    appMode: 'local',
    dataRealStatus: 'planning_only',
    settingsVersion: APP_SETTINGS_VERSION,
  },
}
