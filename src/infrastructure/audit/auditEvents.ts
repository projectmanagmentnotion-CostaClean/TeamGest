import type { AppAuditAction } from './audit.types'

const auditActionLabels: Record<AppAuditAction, string> = {
  'service.created': 'Servicio creado',
  'payroll.status_updated': 'Estado de nómina actualizado',
  'payroll.locked': 'Cierre bloqueado',
  'backup.exported': 'Copia exportada',
  'backup.imported': 'Copia importada',
  'data.reset': 'Datos locales reiniciados',
  'storage.migration_run': 'Migración ejecutada',
}

export function getAuditActionLabel(action: AppAuditAction) {
  return auditActionLabels[action]
}
