import type { AppSettingsPatch, AppSettingsSectionId } from '../../../domain/settings/appSettings.types'
import { getAppSettingsRepository } from '../../../infrastructure/repositoryFactory'

export function getAppSettingsSnapshot() {
  const repository = getAppSettingsRepository()
  const result = repository.getSettings()
  const health = repository.getSettingsHealth()

  return {
    settings: result.settings,
    warnings: result.warnings,
    health,
  }
}

export function getAppSettings() {
  return getAppSettingsSnapshot().settings
}

export function updateAppSettings(patch: AppSettingsPatch) {
  return getAppSettingsRepository().updateSettings(patch)
}

export function resetAppSettings() {
  return getAppSettingsRepository().resetSettings()
}

export function getSettingsSectionWarnings(sectionId: AppSettingsSectionId, warnings: string[]) {
  const prefixMap: Record<AppSettingsSectionId, string> = {
    company: 'companySettings.',
    hours: 'hoursSettings.',
    'quick-entry': 'quickEntrySettings.',
    review: 'hourReviewSettings.',
    services: 'serviceSettings.',
    display: 'displaySettings.',
    'data-safety': 'dataSafetySettings.',
    audit: '',
    system: 'systemSettings.',
  }

  const prefix = prefixMap[sectionId]
  return prefix ? warnings.filter((warning) => warning.includes(prefix)) : warnings
}
