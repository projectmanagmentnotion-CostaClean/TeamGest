import { getStorageHealthReport } from '../../../infrastructure/storage/storageHealth'
import { getStorageMetadata } from '../../../infrastructure/storage/storageMetadata'
import { getAppSettings } from './appSettingsService'
import { getStorageOverview } from './settingsStorage'

export type DataSafetyChecklistItem = {
  id: string
  label: string
  description: string
  status: 'ok' | 'warning'
}

export function getBackupFreshnessStatus() {
  const metadata = getStorageMetadata()
  const settings = getAppSettings()
  if (!metadata.lastBackupAt) {
    return 'missing' as const
  }

  const elapsedMs = Date.now() - new Date(metadata.lastBackupAt).getTime()
  const maxAgeDays =
    settings.dataSafetySettings.backupReminderFrequency === 'monthly'
      ? 30
      : settings.dataSafetySettings.backupReminderFrequency === 'biweekly'
        ? 14
        : 7

  return elapsedMs <= maxAgeDays * 24 * 60 * 60 * 1000 ? 'fresh' as const : 'stale' as const
}

export function getLocalDataRiskLevel() {
  const health = getStorageHealthReport()
  const backupFreshness = getBackupFreshnessStatus()

  if (!health.storageAvailable || health.corruptedKeys.length > 0) {
    return 'high' as const
  }

  if (health.level === 'warning' || backupFreshness !== 'fresh') {
    return 'medium' as const
  }

  return 'low' as const
}

export function getDataSafetyChecklist(): DataSafetyChecklistItem[] {
  const health = getStorageHealthReport()
  const overview = getStorageOverview()
  const backupFreshness = getBackupFreshnessStatus()
  const settings = getAppSettings()

  return [
    {
      id: 'storage-available',
      label: 'localStorage disponible',
      description: health.storageAvailable
        ? 'El navegador permite persistencia local.'
        : 'No se puede garantizar persistencia local en este contexto.',
      status: health.storageAvailable ? 'ok' : 'warning',
    },
    {
      id: 'recent-backup',
      label: 'Backup reciente',
      description:
        !settings.dataSafetySettings.backupReminderEnabled
          ? 'El recordatorio de backup esta desactivado en ajustes.'
          : backupFreshness === 'fresh'
          ? 'Existe una copia reciente del estado local.'
          : 'Conviene exportar una copia antes de seguir operando.',
      status:
        !settings.dataSafetySettings.backupReminderEnabled || backupFreshness === 'fresh'
          ? 'ok'
          : 'warning',
    },
    {
      id: 'corrupted-keys',
      label: 'Sin claves corruptas',
      description:
        health.corruptedKeys.length === 0
          ? 'No se detectó JSON roto en TeamGest.'
          : `Se detectaron ${health.corruptedKeys.length} claves corruptas.`,
      status: health.corruptedKeys.length === 0 ? 'ok' : 'warning',
    },
    {
      id: 'locked-months',
      label: 'Cierres bloqueados visibles',
      description:
        overview.lockedMonthsCount > 0
          ? `Hay ${overview.lockedMonthsCount} meses bloqueados disponibles para consulta.`
          : 'Todavía no hay cierres bloqueados en local.',
      status: overview.lockedMonthsCount > 0 ? 'ok' : 'warning',
    },
    {
      id: 'services-persisted',
      label: 'Servicios locales contados',
      description: `Se detectaron ${overview.localServicesCount} servicios creados localmente.`,
      status: 'ok',
    },
    {
      id: 'protected-actions',
      label: 'Import y reset protegidos',
      description: 'La importación y el reset requieren confirmación explícita en pantalla.',
      status: 'ok',
    },
  ]
}
