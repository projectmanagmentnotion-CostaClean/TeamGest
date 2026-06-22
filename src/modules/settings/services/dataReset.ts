import { recordAuditEvent } from '../../../infrastructure/audit/auditRepository'
import {
  clearAllTeamGestLocalData as clearAllTeamGestLocalDataStorage,
  clearEntityManagementLocalState as clearEntityManagementLocalStateStorage,
  clearPayrollLocalState as clearPayrollLocalStateStorage,
  clearServiceLocalState as clearServiceLocalStateStorage,
} from '../../../infrastructure/storage/storageAdmin'
import { markLastResetAt } from '../../../infrastructure/storage/storageMetadata'
import { migrateStorageIfNeeded } from '../../../infrastructure/storage/storageMigrations'

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
  clearServiceLocalStateStorage()
  return finalizeReset('services', 'Se reiniciaron los servicios creados localmente.')
}

export function resetEntityManagementLocalState() {
  clearEntityManagementLocalStateStorage()
  return finalizeReset(
    'entities',
    'Se reiniciaron altas y cambios locales de trabajadores, clientes e inmuebles.',
  )
}

export function resetPayrollLocalState() {
  clearPayrollLocalStateStorage()
  return finalizeReset('payroll', 'Se reinicio el estado local de cierres y auditoria de nomina.')
}

export function resetAllTeamGestLocalData() {
  clearAllTeamGestLocalDataStorage()
  return finalizeReset('all', 'Se reinicio todo el espacio local de TeamGest en este navegador.')
}
