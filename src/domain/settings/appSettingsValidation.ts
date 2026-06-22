import type {
  AppSettings,
  BackupReminderFrequency,
  DisplayDensity,
  FutureQuickEntryStatus,
  HoursRoundingMinutes,
  PreferredDateFormat,
  PreferredTimeFormat,
  PastQuickEntryStatus,
} from './appSettings.types'
import { APP_SETTINGS_VERSION, appSettingsDefaults } from './appSettingsDefaults'

const roundingOptions: HoursRoundingMinutes[] = [0, 5, 10, 15, 30]
const backupFrequencies: BackupReminderFrequency[] = ['weekly', 'biweekly', 'monthly']
const displayDensities: DisplayDensity[] = ['comfortable', 'compact']
const dateFormats: PreferredDateFormat[] = ['dd/MM/yyyy', 'yyyy-MM-dd']
const timeFormats: PreferredTimeFormat[] = ['24h', '12h']
const pastStatuses: PastQuickEntryStatus[] = ['completed', 'reviewed']
const futureStatuses: FutureQuickEntryStatus[] = ['scheduled', 'draft']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback
}

function normalizeOptionalString(value: unknown) {
  return typeof value === 'string' ? value : undefined
}

function normalizeBoolean(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback
}

function normalizeNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function normalizeEnum<T extends string>(value: unknown, options: readonly T[], fallback: T) {
  return typeof value === 'string' && options.includes(value as T) ? (value as T) : fallback
}

function normalizeNumberEnum<T extends number>(value: unknown, options: readonly T[], fallback: T) {
  return typeof value === 'number' && options.includes(value as T) ? (value as T) : fallback
}

function roundToTwoDecimals(value: number) {
  return Number(value.toFixed(2))
}

export function validateAndNormalizeAppSettings(input: unknown) {
  const warnings: string[] = []
  const root = isRecord(input) ? input : {}

  const companySettings = isRecord(root.companySettings) ? root.companySettings : {}
  const hoursSettings = isRecord(root.hoursSettings) ? root.hoursSettings : {}
  const quickEntrySettings = isRecord(root.quickEntrySettings) ? root.quickEntrySettings : {}
  const hourReviewSettings = isRecord(root.hourReviewSettings) ? root.hourReviewSettings : {}
  const serviceSettings = isRecord(root.serviceSettings) ? root.serviceSettings : {}
  const displaySettings = isRecord(root.displaySettings) ? root.displaySettings : {}
  const dataSafetySettings = isRecord(root.dataSafetySettings) ? root.dataSafetySettings : {}
  const systemSettings = isRecord(root.systemSettings) ? root.systemSettings : {}

  const normalized: AppSettings = {
    companySettings: {
      companyName: normalizeString(
        companySettings.companyName,
        appSettingsDefaults.companySettings.companyName,
      ),
      defaultCity: normalizeString(
        companySettings.defaultCity,
        appSettingsDefaults.companySettings.defaultCity,
      ),
      defaultCurrency: 'EUR',
      notes: normalizeOptionalString(companySettings.notes) ?? appSettingsDefaults.companySettings.notes,
    },
    hoursSettings: {
      defaultHourlyRate: roundToTwoDecimals(
        normalizeNumber(
          hoursSettings.defaultHourlyRate,
          appSettingsDefaults.hoursSettings.defaultHourlyRate,
        ),
      ),
      minimumHoursPerEntry: roundToTwoDecimals(
        normalizeNumber(
          hoursSettings.minimumHoursPerEntry,
          appSettingsDefaults.hoursSettings.minimumHoursPerEntry,
        ),
      ),
      roundHoursToNearestMinutes: normalizeNumberEnum(
        hoursSettings.roundHoursToNearestMinutes,
        roundingOptions,
        appSettingsDefaults.hoursSettings.roundHoursToNearestMinutes,
      ),
      requireRateForPayroll: normalizeBoolean(
        hoursSettings.requireRateForPayroll,
        appSettingsDefaults.hoursSettings.requireRateForPayroll,
      ),
      requireConfirmedHoursForPayroll: normalizeBoolean(
        hoursSettings.requireConfirmedHoursForPayroll,
        appSettingsDefaults.hoursSettings.requireConfirmedHoursForPayroll,
      ),
      allowFutureCompletedEntries: normalizeBoolean(
        hoursSettings.allowFutureCompletedEntries,
        appSettingsDefaults.hoursSettings.allowFutureCompletedEntries,
      ),
    },
    quickEntrySettings: {
      defaultConfirmed: normalizeBoolean(
        quickEntrySettings.defaultConfirmed,
        appSettingsDefaults.quickEntrySettings.defaultConfirmed,
      ),
      defaultServiceStatusForPastDate: normalizeEnum(
        quickEntrySettings.defaultServiceStatusForPastDate,
        pastStatuses,
        appSettingsDefaults.quickEntrySettings.defaultServiceStatusForPastDate,
      ),
      defaultServiceStatusForFutureDate: normalizeEnum(
        quickEntrySettings.defaultServiceStatusForFutureDate,
        futureStatuses,
        appSettingsDefaults.quickEntrySettings.defaultServiceStatusForFutureDate,
      ),
      rememberLastWorker: normalizeBoolean(
        quickEntrySettings.rememberLastWorker,
        appSettingsDefaults.quickEntrySettings.rememberLastWorker,
      ),
      rememberLastProperty: normalizeBoolean(
        quickEntrySettings.rememberLastProperty,
        appSettingsDefaults.quickEntrySettings.rememberLastProperty,
      ),
      showPayrollImpactMessage: normalizeBoolean(
        quickEntrySettings.showPayrollImpactMessage,
        appSettingsDefaults.quickEntrySettings.showPayrollImpactMessage,
      ),
    },
    hourReviewSettings: {
      requireReviewBeforePayrollClose: normalizeBoolean(
        hourReviewSettings.requireReviewBeforePayrollClose,
        appSettingsDefaults.hourReviewSettings.requireReviewBeforePayrollClose,
      ),
      allowIncidentEntriesInPayroll: normalizeBoolean(
        hourReviewSettings.allowIncidentEntriesInPayroll,
        appSettingsDefaults.hourReviewSettings.allowIncidentEntriesInPayroll,
      ),
      allowExcludedEntriesRestore: normalizeBoolean(
        hourReviewSettings.allowExcludedEntriesRestore,
        appSettingsDefaults.hourReviewSettings.allowExcludedEntriesRestore,
      ),
      requireNoteForIncident: normalizeBoolean(
        hourReviewSettings.requireNoteForIncident,
        appSettingsDefaults.hourReviewSettings.requireNoteForIncident,
      ),
      requireReasonForExclusion: normalizeBoolean(
        hourReviewSettings.requireReasonForExclusion,
        appSettingsDefaults.hourReviewSettings.requireReasonForExclusion,
      ),
    },
    serviceSettings: {
      defaultServiceType: normalizeEnum(
        serviceSettings.defaultServiceType,
        [
          'basic_cleaning',
          'deep_cleaning',
          'post_construction',
          'airbnb_turnover',
          'gym_cleaning',
          'office_cleaning',
          'windows',
          'extra',
          'other',
        ] as const,
        appSettingsDefaults.serviceSettings.defaultServiceType,
      ),
      defaultAssignmentConfirmed: normalizeBoolean(
        serviceSettings.defaultAssignmentConfirmed,
        appSettingsDefaults.serviceSettings.defaultAssignmentConfirmed,
      ),
      blockServiceEditWhenPayrollLocked: normalizeBoolean(
        serviceSettings.blockServiceEditWhenPayrollLocked,
        appSettingsDefaults.serviceSettings.blockServiceEditWhenPayrollLocked,
      ),
    },
    displaySettings: {
      density: normalizeEnum(
        displaySettings.density,
        displayDensities,
        appSettingsDefaults.displaySettings.density,
      ),
      showTechnicalIds: normalizeBoolean(
        displaySettings.showTechnicalIds,
        appSettingsDefaults.displaySettings.showTechnicalIds,
      ),
      preferredDateFormat: normalizeEnum(
        displaySettings.preferredDateFormat,
        dateFormats,
        appSettingsDefaults.displaySettings.preferredDateFormat,
      ),
      preferredTimeFormat: normalizeEnum(
        displaySettings.preferredTimeFormat,
        timeFormats,
        appSettingsDefaults.displaySettings.preferredTimeFormat,
      ),
    },
    dataSafetySettings: {
      backupReminderEnabled: normalizeBoolean(
        dataSafetySettings.backupReminderEnabled,
        appSettingsDefaults.dataSafetySettings.backupReminderEnabled,
      ),
      backupReminderFrequency: normalizeEnum(
        dataSafetySettings.backupReminderFrequency,
        backupFrequencies,
        appSettingsDefaults.dataSafetySettings.backupReminderFrequency,
      ),
      showDangerZone: normalizeBoolean(
        dataSafetySettings.showDangerZone,
        appSettingsDefaults.dataSafetySettings.showDangerZone,
      ),
      requireTypedConfirmation: normalizeBoolean(
        dataSafetySettings.requireTypedConfirmation,
        appSettingsDefaults.dataSafetySettings.requireTypedConfirmation,
      ),
    },
    systemSettings: {
      appMode: 'local',
      dataRealStatus: 'planning_only',
      settingsVersion: APP_SETTINGS_VERSION,
    },
  }

  if (!isRecord(input)) {
    warnings.push('No se detectaron ajustes validos. Se aplicaron los valores por defecto.')
  }

  if (normalized.hoursSettings.defaultHourlyRate < 0) {
    warnings.push('hoursSettings.defaultHourlyRate debe ser mayor o igual que 0.')
    normalized.hoursSettings.defaultHourlyRate = appSettingsDefaults.hoursSettings.defaultHourlyRate
  }

  if (normalized.hoursSettings.minimumHoursPerEntry < 0) {
    warnings.push('hoursSettings.minimumHoursPerEntry debe ser mayor o igual que 0.')
    normalized.hoursSettings.minimumHoursPerEntry = appSettingsDefaults.hoursSettings.minimumHoursPerEntry
  }

  if (!roundingOptions.includes(normalized.hoursSettings.roundHoursToNearestMinutes)) {
    warnings.push('hoursSettings.roundHoursToNearestMinutes no es valido.')
    normalized.hoursSettings.roundHoursToNearestMinutes =
      appSettingsDefaults.hoursSettings.roundHoursToNearestMinutes
  }

  if (normalized.quickEntrySettings.defaultServiceStatusForFutureDate === 'draft') {
    warnings.push(
      'quickEntrySettings.defaultServiceStatusForFutureDate queda limitado a estados seguros de planificacion.',
    )
  }

  if (
    systemSettings.appMode !== undefined &&
    systemSettings.appMode !== appSettingsDefaults.systemSettings.appMode
  ) {
    warnings.push('systemSettings.appMode permanece fijado en local.')
  }

  if (
    systemSettings.dataRealStatus !== undefined &&
    systemSettings.dataRealStatus !== appSettingsDefaults.systemSettings.dataRealStatus
  ) {
    warnings.push('systemSettings.dataRealStatus permanece fijado en planning_only.')
  }

  return {
    settings: normalized,
    warnings,
  }
}
