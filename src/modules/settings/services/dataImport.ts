import { recordAuditEvent } from '../../../infrastructure/audit/auditRepository'
import { markLastImportAt } from '../../../infrastructure/storage/storageMetadata'
import {
  buildTeamGestBackup,
  getBackupSummary,
  parseTeamGestBackup,
  restoreTeamGestBackup,
} from '../../../infrastructure/storage/storageBackup'

export async function previewTeamGestBackupImport(source: string | File) {
  const payload = await parseTeamGestBackup(source)
  return {
    payload,
    summary: getBackupSummary(payload),
  }
}

export function importTeamGestBackupPayload(payload: Awaited<ReturnType<typeof parseTeamGestBackup>>) {
  const preImportBackup = buildTeamGestBackup()
  restoreTeamGestBackup(payload)
  const importedAt = new Date().toISOString()
  markLastImportAt(importedAt)
  recordAuditEvent({
    action: 'backup.imported',
    message: 'Se importo una copia local compatible de TeamGest.',
    metadata: {
      importedAt,
      previousSnapshotAt: preImportBackup.exportedAt,
    },
  })

  return {
    importedAt,
    summary: getBackupSummary(payload),
    preImportBackup,
  }
}
