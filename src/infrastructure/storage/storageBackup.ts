import { recordAuditEvent } from '../audit/auditRepository'
import { readJson, writeJson } from './localStorageAdapter'
import { markLastBackupAt } from './storageMetadata'
import {
  APP_AUDIT_KEY,
  BACKUP_HISTORY_KEY,
  PAYROLL_AUDIT_KEY,
  PAYROLL_MONTHS_KEY,
  SERVICES_CREATED_KEY,
  SETTINGS_KEY,
  STORAGE_METADATA_KEY,
} from './storageKeys'

export type TeamGestBackupPayload = {
  appName: 'TeamGest'
  exportedAt: string
  schemaVersion: number
  data: {
    createdServices: unknown[]
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

function readBackupHistory() {
  return readJson<BackupHistoryEntry[]>(BACKUP_HISTORY_KEY, [])
}

function writeBackupHistory(entries: BackupHistoryEntry[]) {
  writeJson(BACKUP_HISTORY_KEY, entries)
}

export function buildTeamGestBackup(): TeamGestBackupPayload {
  const metadata = readJson<Record<string, unknown>>(STORAGE_METADATA_KEY, {})
  const schemaVersion =
    typeof metadata.schemaVersion === 'number' ? metadata.schemaVersion : 1
  const exportedAt = new Date().toISOString()

  return {
    appName: 'TeamGest',
    exportedAt,
    schemaVersion,
    data: {
      createdServices: readJson<unknown[]>(SERVICES_CREATED_KEY, []),
      payrollMonths: readJson<Record<string, unknown>>(PAYROLL_MONTHS_KEY, {}),
      payrollAudit: readJson<Record<string, unknown>>(PAYROLL_AUDIT_KEY, {}),
      appAudit: readJson<unknown[]>(APP_AUDIT_KEY, []),
      settings: readJson<Record<string, unknown>>(SETTINGS_KEY, {}),
      metadata,
    },
  }
}

export function validateTeamGestBackup(payload: unknown): payload is TeamGestBackupPayload {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }

  const candidate = payload as Partial<TeamGestBackupPayload>
  return (
    candidate.appName === 'TeamGest' &&
    typeof candidate.exportedAt === 'string' &&
    typeof candidate.schemaVersion === 'number' &&
    typeof candidate.data === 'object' &&
    candidate.data !== null
  )
}

export function getBackupSummary(payload: TeamGestBackupPayload) {
  return {
    appName: payload.appName,
    exportedAt: payload.exportedAt,
    schemaVersion: payload.schemaVersion,
    createdServicesCount: payload.data.createdServices.length,
    payrollMonthsCount: Object.keys(payload.data.payrollMonths).length,
    payrollAuditCount: Object.keys(payload.data.payrollAudit).length,
    appAuditCount: payload.data.appAudit.length,
  }
}

export async function parseTeamGestBackup(input: string | File) {
  const rawText = typeof input === 'string' ? input : await input.text()
  const parsed = JSON.parse(rawText) as unknown

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
    message: 'Se exportó una copia local de TeamGest en formato JSON.',
    metadata: {
      exportedAt,
      fileName,
    },
  })

  return { backupText, fileName, payload }
}

export function restoreTeamGestBackup(payload: TeamGestBackupPayload) {
  writeJson(SERVICES_CREATED_KEY, payload.data.createdServices)
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
