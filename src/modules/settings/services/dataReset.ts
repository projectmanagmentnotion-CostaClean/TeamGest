import { recordAuditEvent } from '../../../infrastructure/audit/auditRepository'
import { clearNamespace, removeItem } from '../../../infrastructure/storage/localStorageAdapter'
import { markLastResetAt } from '../../../infrastructure/storage/storageMetadata'
import { migrateStorageIfNeeded } from '../../../infrastructure/storage/storageMigrations'
import {
  APP_AUDIT_KEY,
  BACKUP_HISTORY_KEY,
  CLIENTS_ARCHIVED_KEY,
  CLIENTS_CREATED_KEY,
  CLIENTS_OVERRIDES_KEY,
  LEGACY_SERVICES_CREATED_KEY,
  PAYROLL_AUDIT_KEY,
  PAYROLL_MONTHS_KEY,
  PROPERTIES_ARCHIVED_KEY,
  PROPERTIES_CREATED_KEY,
  PROPERTIES_OVERRIDES_KEY,
  SERVICES_ARCHIVED_KEY,
  SERVICES_CREATED_KEY,
  SERVICES_OVERRIDES_KEY,
  SETTINGS_KEY,
  STORAGE_METADATA_KEY,
  TEAMGEST_STORAGE_PREFIX,
  WORKERS_ARCHIVED_KEY,
  WORKERS_CREATED_KEY,
  WORKERS_OVERRIDES_KEY,
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
  removeItem(SERVICES_OVERRIDES_KEY)
  removeItem(SERVICES_ARCHIVED_KEY)
  removeItem(LEGACY_SERVICES_CREATED_KEY)
  return finalizeReset('services', 'Se reiniciaron los servicios creados localmente.')
}

export function resetEntityManagementLocalState() {
  removeItem(WORKERS_CREATED_KEY)
  removeItem(WORKERS_OVERRIDES_KEY)
  removeItem(WORKERS_ARCHIVED_KEY)
  removeItem(CLIENTS_CREATED_KEY)
  removeItem(CLIENTS_OVERRIDES_KEY)
  removeItem(CLIENTS_ARCHIVED_KEY)
  removeItem(PROPERTIES_CREATED_KEY)
  removeItem(PROPERTIES_OVERRIDES_KEY)
  removeItem(PROPERTIES_ARCHIVED_KEY)
  return finalizeReset(
    'entities',
    'Se reiniciaron altas y cambios locales de trabajadores, clientes e inmuebles.',
  )
}

export function resetPayrollLocalState() {
  removeItem(PAYROLL_MONTHS_KEY)
  removeItem(PAYROLL_AUDIT_KEY)
  return finalizeReset('payroll', 'Se reinicio el estado local de cierres y auditoria de nomina.')
}

export function resetAllTeamGestLocalData() {
  clearNamespace(TEAMGEST_STORAGE_PREFIX)
  removeItem(LEGACY_SERVICES_CREATED_KEY)
  removeItem(STORAGE_METADATA_KEY)
  removeItem(APP_AUDIT_KEY)
  removeItem(BACKUP_HISTORY_KEY)
  removeItem(SETTINGS_KEY)
  return finalizeReset('all', 'Se reinicio todo el espacio local de TeamGest en este navegador.')
}
