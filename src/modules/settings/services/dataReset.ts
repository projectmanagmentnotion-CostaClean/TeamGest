import { recordAuditEvent } from '../../../infrastructure/audit/auditRepository'
import { clearNamespace, removeItem } from '../../../infrastructure/storage/localStorageAdapter'
import { markLastResetAt } from '../../../infrastructure/storage/storageMetadata'
import { migrateStorageIfNeeded } from '../../../infrastructure/storage/storageMigrations'
import {
  APP_AUDIT_KEY,
  BACKUP_HISTORY_KEY,
  LEGACY_SERVICES_CREATED_KEY,
  PAYROLL_AUDIT_KEY,
  PAYROLL_MONTHS_KEY,
  SERVICES_CREATED_KEY,
  SETTINGS_KEY,
  STORAGE_METADATA_KEY,
  TEAMGEST_STORAGE_PREFIX,
} from '../../../infrastructure/storage/storageKeys'

function finalizeReset(scope: string, message: string) {
  const resetAt = new Date().toISOString()
  migrateStorageIfNeeded()
  markLastResetAt(resetAt)
  recordAuditEvent({
    action: 'data.reset',
    message,
    metadata: {
      scope,
      resetAt,
    },
  })
  return resetAt
}

export function resetLocalServices() {
  removeItem(SERVICES_CREATED_KEY)
  removeItem(LEGACY_SERVICES_CREATED_KEY)
  return finalizeReset('services', 'Se reiniciaron los servicios creados localmente.')
}

export function resetPayrollLocalState() {
  removeItem(PAYROLL_MONTHS_KEY)
  removeItem(PAYROLL_AUDIT_KEY)
  return finalizeReset('payroll', 'Se reinició el estado local de cierres y auditoría de nómina.')
}

export function resetAllTeamGestLocalData() {
  clearNamespace(TEAMGEST_STORAGE_PREFIX)
  removeItem(LEGACY_SERVICES_CREATED_KEY)
  removeItem(STORAGE_METADATA_KEY)
  removeItem(APP_AUDIT_KEY)
  removeItem(BACKUP_HISTORY_KEY)
  removeItem(SETTINGS_KEY)
  return finalizeReset('all', 'Se reinició todo el espacio local de TeamGest en este navegador.')
}
