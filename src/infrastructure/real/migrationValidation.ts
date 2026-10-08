import { validateTeamGestBackup, type TeamGestBackupPayload } from '../storage/storageBackup'

export type MigrationValidationIssue = {
  code: 'INVALID_BACKUP' | 'UNSUPPORTED_SCHEMA' | 'DUPLICATE_ID'
  message: string
}

export type MigrationValidationReport = {
  ready: boolean
  issues: MigrationValidationIssue[]
  summary?: ReturnType<typeof summarizeMigrationInput>
}

function summarizeMigrationInput(payload: TeamGestBackupPayload) {
  return {
    schemaVersion: payload.schemaVersion,
    exportedAt: payload.exportedAt,
    workers: payload.data.createdWorkers.length,
    clients: payload.data.createdClients.length,
    properties: payload.data.createdProperties.length,
    services: payload.data.createdServices.length,
    appAudit: payload.data.appAudit.length,
  }
}

function findDuplicateIds(items: unknown[]) {
  const ids = items.flatMap((item) => {
    if (typeof item !== 'object' || item === null || !('id' in item)) return []
    const id = item.id
    return typeof id === 'string' && id.length > 0 ? [id] : []
  })
  return [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))]
}

export function validateMigrationInput(input: unknown, supportedSchemaVersion = 1): MigrationValidationReport {
  if (!validateTeamGestBackup(input)) {
    return {
      ready: false,
      issues: [{ code: 'INVALID_BACKUP', message: 'El backup no cumple el contrato TeamGest.' }],
    }
  }

  const payload = input
  const issues: MigrationValidationIssue[] = []
  if (payload.schemaVersion > supportedSchemaVersion) {
    issues.push({
      code: 'UNSUPPORTED_SCHEMA',
      message: `El schema ${payload.schemaVersion} requiere soporte posterior a ${supportedSchemaVersion}.`,
    })
  }

  const collections = [
    payload.data.createdWorkers,
    payload.data.createdClients,
    payload.data.createdProperties,
    payload.data.createdServices,
  ]
  const duplicateIds = findDuplicateIds(collections.flat())
  if (duplicateIds.length > 0) {
    issues.push({
      code: 'DUPLICATE_ID',
      message: `Ids duplicados detectados: ${duplicateIds.join(', ')}.`,
    })
  }

  return {
    ready: issues.length === 0,
    issues,
    summary: summarizeMigrationInput(payload),
  }
}
