export type AppAuditAction =
  | 'worker.created'
  | 'worker.updated'
  | 'worker.archived'
  | 'worker.restored'
  | 'worker.deleted'
  | 'client.created'
  | 'client.updated'
  | 'client.archived'
  | 'client.restored'
  | 'client.deleted'
  | 'property.created'
  | 'property.updated'
  | 'property.archived'
  | 'property.restored'
  | 'property.deleted'
  | 'service.created'
  | 'service.quick_entry_created'
  | 'service.updated'
  | 'service.cancelled'
  | 'service.restored'
  | 'service.deleted'
  | 'hour.confirmed'
  | 'hour.corrected'
  | 'hour.incident_marked'
  | 'hour.excluded'
  | 'hour.restored'
  | 'payroll.status_updated'
  | 'payroll.locked'
  | 'backup.exported'
  | 'backup.imported'
  | 'settings.updated'
  | 'settings.reset'
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
