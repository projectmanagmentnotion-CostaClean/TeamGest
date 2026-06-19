import { listAuditEntries } from '../../../infrastructure/audit/auditRepository'
import { getStorageSizeEstimate, readJson, writeJson } from '../../../infrastructure/storage/localStorageAdapter'
import { getStorageMetadata } from '../../../infrastructure/storage/storageMetadata'
import {
  PAYROLL_AUDIT_KEY,
  PAYROLL_MONTHS_KEY,
  SERVICES_CREATED_KEY,
  SETTINGS_KEY,
  TEAMGEST_STORAGE_PREFIX,
} from '../../../infrastructure/storage/storageKeys'
import type { PayrollMonthState } from '../../../domain/payroll/payroll.types'
import type { ServiceJob } from '../../../domain/services/service.types'

export type SettingsStorageOverview = {
  storageMode: string
  schemaVersion: number
  localServicesCount: number
  payrollMonthsCount: number
  auditEntriesCount: number
  estimatedStorageSize: number
  lastBackupAt?: string
  lastImportAt?: string
  lastResetAt?: string
  lockedMonthsCount: number
}

export type LocalSettingsState = {
  importMode?: 'text' | 'file'
}

export function getStorageOverview(): SettingsStorageOverview {
  const metadata = getStorageMetadata()
  const localServices = readJson<ServiceJob[]>(SERVICES_CREATED_KEY, [])
  const payrollMonths = readJson<Record<string, PayrollMonthState>>(PAYROLL_MONTHS_KEY, {})
  const payrollAudit = readJson<Record<string, unknown[]>>(PAYROLL_AUDIT_KEY, {})
  const payrollAuditEntriesCount = Object.values(payrollAudit).reduce(
    (total, entries) => total + entries.length,
    0,
  )

  return {
    storageMode: 'Local del navegador',
    schemaVersion: metadata.schemaVersion,
    localServicesCount: localServices.length,
    payrollMonthsCount: Object.keys(payrollMonths).length,
    auditEntriesCount: listAuditEntries().length + payrollAuditEntriesCount,
    estimatedStorageSize: getStorageSizeEstimate(TEAMGEST_STORAGE_PREFIX),
    lastBackupAt: metadata.lastBackupAt,
    lastImportAt: metadata.lastImportAt,
    lastResetAt: metadata.lastResetAt,
    lockedMonthsCount: Object.values(payrollMonths).filter((month) => month.status === 'locked').length,
  }
}

export function getLocalSettingsState() {
  return readJson<LocalSettingsState>(SETTINGS_KEY, {})
}

export function saveLocalSettingsState(nextState: LocalSettingsState) {
  writeJson(SETTINGS_KEY, nextState)
  return nextState
}
