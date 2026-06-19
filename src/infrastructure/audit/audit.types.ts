export type AppAuditAction =
  | 'service.created'
  | 'payroll.status_updated'
  | 'payroll.locked'
  | 'backup.exported'
  | 'backup.imported'
  | 'data.reset'
  | 'storage.migration_run'

export type AppAuditEntry = {
  id: string
  action: AppAuditAction
  entityType?: string
  entityId?: string
  message: string
  createdAt: string
  metadata?: Record<string, string>
}
