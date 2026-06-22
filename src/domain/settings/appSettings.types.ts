import type { ServiceType } from '../services/service.types'
import type { ServiceStatus } from '../shared/status.types'

export type AppSettingsSectionId =
  | 'company'
  | 'hours'
  | 'quick-entry'
  | 'review'
  | 'services'
  | 'display'
  | 'data-safety'
  | 'audit'
  | 'system'

export type BackupReminderFrequency = 'weekly' | 'biweekly' | 'monthly'

export type DisplayDensity = 'comfortable' | 'compact'

export type PreferredDateFormat = 'dd/MM/yyyy' | 'yyyy-MM-dd'

export type PreferredTimeFormat = '24h' | '12h'

export type HoursRoundingMinutes = 0 | 5 | 10 | 15 | 30

export type PastQuickEntryStatus = Extract<ServiceStatus, 'completed' | 'reviewed'>

export type FutureQuickEntryStatus = Extract<ServiceStatus, 'scheduled' | 'draft'>

export type CompanySettings = {
  companyName: string
  defaultCity: string
  defaultCurrency: 'EUR'
  notes?: string
}

export type HoursSettings = {
  defaultHourlyRate: number
  minimumHoursPerEntry: number
  roundHoursToNearestMinutes: HoursRoundingMinutes
  requireRateForPayroll: boolean
  requireConfirmedHoursForPayroll: boolean
  allowFutureCompletedEntries: boolean
}

export type QuickEntrySettings = {
  defaultConfirmed: boolean
  defaultServiceStatusForPastDate: PastQuickEntryStatus
  defaultServiceStatusForFutureDate: FutureQuickEntryStatus
  rememberLastWorker: boolean
  rememberLastProperty: boolean
  showPayrollImpactMessage: boolean
}

export type HourReviewSettings = {
  requireReviewBeforePayrollClose: boolean
  allowIncidentEntriesInPayroll: boolean
  allowExcludedEntriesRestore: boolean
  requireNoteForIncident: boolean
  requireReasonForExclusion: boolean
}

export type ServiceSettings = {
  defaultServiceType: ServiceType
  defaultAssignmentConfirmed: boolean
  blockServiceEditWhenPayrollLocked: boolean
}

export type DisplaySettings = {
  density: DisplayDensity
  showTechnicalIds: boolean
  preferredDateFormat: PreferredDateFormat
  preferredTimeFormat: PreferredTimeFormat
}

export type DataSafetySettings = {
  backupReminderEnabled: boolean
  backupReminderFrequency: BackupReminderFrequency
  showDangerZone: boolean
  requireTypedConfirmation: boolean
}

export type SystemSettings = {
  appMode: 'local'
  dataRealStatus: 'planning_only'
  settingsVersion: number
}

export type AppSettings = {
  companySettings: CompanySettings
  hoursSettings: HoursSettings
  quickEntrySettings: QuickEntrySettings
  hourReviewSettings: HourReviewSettings
  serviceSettings: ServiceSettings
  displaySettings: DisplaySettings
  dataSafetySettings: DataSafetySettings
  systemSettings: SystemSettings
}

export type AppSettingsPatch = Partial<{
  companySettings: Partial<CompanySettings>
  hoursSettings: Partial<HoursSettings>
  quickEntrySettings: Partial<QuickEntrySettings>
  hourReviewSettings: Partial<HourReviewSettings>
  serviceSettings: Partial<ServiceSettings>
  displaySettings: Partial<DisplaySettings>
  dataSafetySettings: Partial<DataSafetySettings>
  systemSettings: Partial<SystemSettings>
}>
