import { recordAuditEvent } from '../audit/auditRepository'
import { readJson, writeJson } from './localStorageAdapter'
import { markLastBackupAt } from './storageMetadata'
import {
  APP_AUDIT_KEY,
  BACKUP_HISTORY_KEY,
  CLIENTS_ARCHIVED_KEY,
  CLIENTS_CREATED_KEY,
  CLIENTS_OVERRIDES_KEY,
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
  WORKERS_ARCHIVED_KEY,
  WORKERS_CREATED_KEY,
  WORKERS_OVERRIDES_KEY,
} from './storageKeys'

export type TeamGestBackupPayload = {
  appName: 'TeamGest'
  exportedAt: string
  schemaVersion: number
  data: {
    createdServices: unknown[]
    serviceOverrides: Record<string, unknown>
    archivedServices: Record<string, unknown>
    createdWorkers: unknown[]
    workerOverrides: Record<string, unknown>
    archivedWorkers: Record<string, unknown>
    createdClients: unknown[]
    clientOverrides: Record<string, unknown>
    archivedClients: Record<string, unknown>
    createdProperties: unknown[]
    propertyOverrides: Record<string, unknown>
    archivedProperties: Record<string, unknown>
    payrollMonths: Record<string, unknown>
    payrollAudit: Record<string, unknown>
    appAudit: unknown[]
    settings: Record<string, unknown>
    metadata: Record<string, unknown>
  }
}

type BackupHistoryEntry = {
  exportedAt: string
  schemaVersion: number
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readBackupHistory() {
  return readJson<BackupHistoryEntry[]>(BACKUP_HISTORY_KEY, [])
}

function writeBackupHistory(entries: BackupHistoryEntry[]) {
  writeJson(BACKUP_HISTORY_KEY, entries)
}

export function buildTeamGestBackup(): TeamGestBackupPayload {
  const metadata = readJson<Record<string, unknown>>(STORAGE_METADATA_KEY, {})
  const schemaVersion = typeof metadata.schemaVersion === 'number' ? metadata.schemaVersion : 1
  const exportedAt = new Date().toISOString()

  return {
    appName: 'TeamGest',
    exportedAt,
    schemaVersion,
    data: {
      createdServices: readJson<unknown[]>(SERVICES_CREATED_KEY, []),
      serviceOverrides: readJson<Record<string, unknown>>(SERVICES_OVERRIDES_KEY, {}),
      archivedServices: readJson<Record<string, unknown>>(SERVICES_ARCHIVED_KEY, {}),
      createdWorkers: readJson<unknown[]>(WORKERS_CREATED_KEY, []),
      workerOverrides: readJson<Record<string, unknown>>(WORKERS_OVERRIDES_KEY, {}),
      archivedWorkers: readJson<Record<string, unknown>>(WORKERS_ARCHIVED_KEY, {}),
      createdClients: readJson<unknown[]>(CLIENTS_CREATED_KEY, []),
      clientOverrides: readJson<Record<string, unknown>>(CLIENTS_OVERRIDES_KEY, {}),
      archivedClients: readJson<Record<string, unknown>>(CLIENTS_ARCHIVED_KEY, {}),
      createdProperties: readJson<unknown[]>(PROPERTIES_CREATED_KEY, []),
      propertyOverrides: readJson<Record<string, unknown>>(PROPERTIES_OVERRIDES_KEY, {}),
      archivedProperties: readJson<Record<string, unknown>>(PROPERTIES_ARCHIVED_KEY, {}),
      payrollMonths: readJson<Record<string, unknown>>(PAYROLL_MONTHS_KEY, {}),
      payrollAudit: readJson<Record<string, unknown>>(PAYROLL_AUDIT_KEY, {}),
      appAudit: readJson<unknown[]>(APP_AUDIT_KEY, []),
      settings: readJson<Record<string, unknown>>(SETTINGS_KEY, {}),
      metadata,
    },
  }
}

export function validateTeamGestBackup(payload: unknown): payload is TeamGestBackupPayload {
  if (!isPlainRecord(payload)) {
    return false
  }

  const candidate = payload as Partial<TeamGestBackupPayload>
  return (
    candidate.appName === 'TeamGest' &&
    typeof candidate.exportedAt === 'string' &&
    typeof candidate.schemaVersion === 'number' &&
    isPlainRecord(candidate.data) &&
    Array.isArray(candidate.data.createdServices) &&
    isPlainRecord(candidate.data.serviceOverrides) &&
    isPlainRecord(candidate.data.archivedServices) &&
    Array.isArray(candidate.data.createdWorkers) &&
    isPlainRecord(candidate.data.workerOverrides) &&
    isPlainRecord(candidate.data.archivedWorkers) &&
    Array.isArray(candidate.data.createdClients) &&
    isPlainRecord(candidate.data.clientOverrides) &&
    isPlainRecord(candidate.data.archivedClients) &&
    Array.isArray(candidate.data.createdProperties) &&
    isPlainRecord(candidate.data.propertyOverrides) &&
    isPlainRecord(candidate.data.archivedProperties) &&
    isPlainRecord(candidate.data.payrollMonths) &&
    isPlainRecord(candidate.data.payrollAudit) &&
    Array.isArray(candidate.data.appAudit) &&
    isPlainRecord(candidate.data.settings) &&
    isPlainRecord(candidate.data.metadata)
  )
}

export function getBackupSummary(payload: TeamGestBackupPayload) {
  return {
    appName: payload.appName,
    exportedAt: payload.exportedAt,
    schemaVersion: payload.schemaVersion,
    createdServicesCount: payload.data.createdServices.length,
    createdWorkersCount: payload.data.createdWorkers.length,
    createdClientsCount: payload.data.createdClients.length,
    createdPropertiesCount: payload.data.createdProperties.length,
    payrollMonthsCount: Object.keys(payload.data.payrollMonths).length,
    payrollAuditCount: Object.keys(payload.data.payrollAudit).length,
    appAuditCount: payload.data.appAudit.length,
  }
}

export async function parseTeamGestBackup(input: string | File) {
  const rawText = typeof input === 'string' ? input : await input.text()
  let parsed: unknown

  try {
    parsed = JSON.parse(rawText) as unknown
  } catch {
    throw new Error('El contenido no es un JSON valido de TeamGest.')
  }

  if (!validateTeamGestBackup(parsed)) {
    throw new Error('El archivo no coincide con el formato de copia de TeamGest.')
  }

  return parsed
}

export function downloadTeamGestBackup(payload = buildTeamGestBackup()) {
  const backupText = JSON.stringify(payload, null, 2)
  const exportedAt = payload.exportedAt
  const fileName = `teamgest-backup-${exportedAt.slice(0, 10)}.json`

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const blob = new Blob([backupText], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  markLastBackupAt(exportedAt)
  const history = readBackupHistory()
  writeBackupHistory([{ exportedAt, schemaVersion: payload.schemaVersion }, ...history].slice(0, 10))
  recordAuditEvent({
    action: 'backup.exported',
    message: 'Se exporto una copia local de TeamGest en formato JSON.',
    metadata: {
      exportedAt,
      fileName,
    },
  })

  return { backupText, fileName, payload }
}

export function restoreTeamGestBackup(payload: TeamGestBackupPayload) {
  if (!validateTeamGestBackup(payload)) {
    throw new Error('La copia no supero la validacion antes de restaurarse.')
  }

  writeJson(SERVICES_CREATED_KEY, payload.data.createdServices)
  writeJson(SERVICES_OVERRIDES_KEY, payload.data.serviceOverrides)
  writeJson(SERVICES_ARCHIVED_KEY, payload.data.archivedServices)
  writeJson(WORKERS_CREATED_KEY, payload.data.createdWorkers)
  writeJson(WORKERS_OVERRIDES_KEY, payload.data.workerOverrides)
  writeJson(WORKERS_ARCHIVED_KEY, payload.data.archivedWorkers)
  writeJson(CLIENTS_CREATED_KEY, payload.data.createdClients)
  writeJson(CLIENTS_OVERRIDES_KEY, payload.data.clientOverrides)
  writeJson(CLIENTS_ARCHIVED_KEY, payload.data.archivedClients)
  writeJson(PROPERTIES_CREATED_KEY, payload.data.createdProperties)
  writeJson(PROPERTIES_OVERRIDES_KEY, payload.data.propertyOverrides)
  writeJson(PROPERTIES_ARCHIVED_KEY, payload.data.archivedProperties)
  writeJson(PAYROLL_MONTHS_KEY, payload.data.payrollMonths)
  writeJson(PAYROLL_AUDIT_KEY, payload.data.payrollAudit)
  writeJson(APP_AUDIT_KEY, payload.data.appAudit)
  writeJson(SETTINGS_KEY, payload.data.settings)
  writeJson(STORAGE_METADATA_KEY, {
    ...payload.data.metadata,
    schemaVersion: payload.schemaVersion,
    updatedAt: new Date().toISOString(),
  })
}
