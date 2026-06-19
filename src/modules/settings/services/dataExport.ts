import { buildTeamGestBackup, downloadTeamGestBackup, getBackupSummary } from '../../../infrastructure/storage/storageBackup'

export function exportTeamGestBackup() {
  const payload = buildTeamGestBackup()
  const summary = getBackupSummary(payload)
  return {
    ...downloadTeamGestBackup(payload),
    summary,
  }
}
