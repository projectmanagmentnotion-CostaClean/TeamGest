import { listAuditEntries } from '../../../infrastructure/audit/auditRepository'
import {
  getStorageOverviewSnapshot,
  readLocalSettingsState,
  writeLocalSettingsState,
  type LocalSettingsState,
} from '../../../infrastructure/storage/storageAdmin'

export type SettingsStorageOverview = {
  storageMode: string
  schemaVersion: number
  localServicesCount: number
  localWorkersCount: number
  localClientsCount: number
  localPropertiesCount: number
  payrollMonthsCount: number
  auditEntriesCount: number
  estimatedStorageSize: number
  lastBackupAt?: string
  lastImportAt?: string
  lastResetAt?: string
  lockedMonthsCount: number
}

export function getStorageOverview(): SettingsStorageOverview {
  const overview = getStorageOverviewSnapshot()

  return {
    storageMode: 'Local del navegador',
    schemaVersion: overview.metadata.schemaVersion,
    localServicesCount: overview.localServicesCount,
    localWorkersCount: overview.localWorkersCount,
    localClientsCount: overview.localClientsCount,
    localPropertiesCount: overview.localPropertiesCount,
    payrollMonthsCount: Object.keys(overview.payrollMonths).length,
    auditEntriesCount: listAuditEntries().length + overview.payrollAuditEntriesCount,
    estimatedStorageSize: overview.estimatedStorageSize,
    lastBackupAt: overview.metadata.lastBackupAt,
    lastImportAt: overview.metadata.lastImportAt,
    lastResetAt: overview.metadata.lastResetAt,
    lockedMonthsCount: Object.values(overview.payrollMonths).filter((month) => month.status === 'locked').length,
  }
}

export function getLocalSettingsState() {
  return readLocalSettingsState()
}

export function saveLocalSettingsState(nextState: LocalSettingsState) {
  return writeLocalSettingsState(nextState)
}
