import type { AppAuditAction } from './audit.types'

const auditActionLabels: Record<AppAuditAction, string> = {
  'worker.created': 'Trabajador creado',
  'worker.updated': 'Trabajador actualizado',
  'worker.archived': 'Trabajador archivado',
  'worker.restored': 'Trabajador restaurado',
  'worker.deleted': 'Trabajador eliminado',
  'client.created': 'Cliente creado',
  'client.updated': 'Cliente actualizado',
  'client.archived': 'Cliente archivado',
  'client.restored': 'Cliente restaurado',
  'client.deleted': 'Cliente eliminado',
  'property.created': 'Inmueble creado',
  'property.updated': 'Inmueble actualizado',
  'property.archived': 'Inmueble archivado',
  'property.restored': 'Inmueble restaurado',
  'property.deleted': 'Inmueble eliminado',
  'service.created': 'Servicio creado',
  'service.quick_entry_created': 'Horas registradas',
  'service.updated': 'Servicio actualizado',
  'service.cancelled': 'Servicio cancelado',
  'service.restored': 'Servicio restaurado',
  'service.deleted': 'Servicio eliminado',
  'hour.confirmed': 'Horas confirmadas',
  'hour.corrected': 'Horas corregidas',
  'hour.incident_marked': 'Incidencia en horas',
  'hour.excluded': 'Horas excluidas',
  'hour.restored': 'Horas restauradas',
  'payroll.status_updated': 'Estado de nómina actualizado',
  'payroll.locked': 'Cierre bloqueado',
  'backup.exported': 'Copia exportada',
  'backup.imported': 'Copia importada',
  'settings.updated': 'Ajustes actualizados',
  'settings.reset': 'Ajustes restaurados',
  'data.reset': 'Datos locales reiniciados',
  'storage.migration_run': 'Migración ejecutada',
}

export function getAuditActionLabel(action: AppAuditAction) {
  return auditActionLabels[action]
}
