import {
  appSettingsDefaults,
  APP_SETTINGS_VERSION,
} from '../../domain/settings/appSettingsDefaults'
import { validateAndNormalizeAppSettings } from '../../domain/settings/appSettingsValidation'
import type { AppSettings, AppSettingsPatch } from '../../domain/settings/appSettings.types'
import { recordAuditEvent } from '../audit/auditRepository'
import {
  readStoredAppSettingsValue,
  writeStoredAppSettingsValue,
} from '../storage/storageAdmin'

type AppSettingsHealth = {
  isValid: boolean
  warnings: string[]
  customizedSections: string[]
  settingsVersion: number
}

function mergeSettings(current: AppSettings, patch: AppSettingsPatch): AppSettings {
  return {
    ...current,
    companySettings: { ...current.companySettings, ...patch.companySettings },
    hoursSettings: { ...current.hoursSettings, ...patch.hoursSettings },
    quickEntrySettings: { ...current.quickEntrySettings, ...patch.quickEntrySettings },
    hourReviewSettings: { ...current.hourReviewSettings, ...patch.hourReviewSettings },
    serviceSettings: { ...current.serviceSettings, ...patch.serviceSettings },
    displaySettings: { ...current.displaySettings, ...patch.displaySettings },
    dataSafetySettings: { ...current.dataSafetySettings, ...patch.dataSafetySettings },
    systemSettings: {
      ...current.systemSettings,
      ...patch.systemSettings,
      appMode: 'local',
      dataRealStatus: 'planning_only',
      settingsVersion: APP_SETTINGS_VERSION,
    },
  }
}

function getChangedKeys(patch: AppSettingsPatch) {
  return Object.entries(patch).flatMap(([section, value]) =>
    Object.keys(value ?? {}).map((key) => `${section}.${key}`),
  )
}

function getCustomizedSections(settings: AppSettings) {
  return (Object.keys(appSettingsDefaults) as Array<keyof AppSettings>).filter(
    (section) =>
      JSON.stringify(settings[section]) !== JSON.stringify(appSettingsDefaults[section]),
  )
}

export function createAppSettingsRepository() {
  return {
    getSettings: () => {
      const result = validateAndNormalizeAppSettings(readStoredAppSettingsValue())
      return result
    },
    updateSettings: (patch: AppSettingsPatch) => {
      const current = validateAndNormalizeAppSettings(readStoredAppSettingsValue()).settings
      const merged = mergeSettings(current, patch)
      const result = validateAndNormalizeAppSettings(merged)
      writeStoredAppSettingsValue(result.settings)

      recordAuditEvent({
        action: 'settings.updated',
        entityType: 'app-settings',
        entityId: 'app',
        message: 'Se actualizaron ajustes locales de TeamGest.',
        metadata: {
          sections: Object.keys(patch).join(', '),
          changedKeys: getChangedKeys(patch).join(', '),
        },
      })

      return result
    },
    resetSettings: () => {
      writeStoredAppSettingsValue(appSettingsDefaults)
      recordAuditEvent({
        action: 'settings.reset',
        entityType: 'app-settings',
        entityId: 'app',
        message: 'Se restauraron los ajustes locales por defecto.',
        metadata: {
          settingsVersion: String(APP_SETTINGS_VERSION),
        },
      })

      return {
        settings: appSettingsDefaults,
        warnings: [] as string[],
      }
    },
    getSettingsHealth: (): AppSettingsHealth => {
      const result = validateAndNormalizeAppSettings(readStoredAppSettingsValue())
      return {
        isValid: result.warnings.length === 0,
        warnings: result.warnings,
        customizedSections: getCustomizedSections(result.settings),
        settingsVersion: result.settings.systemSettings.settingsVersion,
      }
    },
  }
}
