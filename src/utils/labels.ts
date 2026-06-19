import type { BadgeTone } from '../components/ui/Badge'
import type { PayrollStatus, ServiceStatus, WarningLevel } from '../domain/shared/status.types'
import type { PropertyType } from '../domain/properties/property.types'
import type { ServiceType } from '../domain/services/service.types'
import type { WorkerRole } from '../domain/workers/worker.types'
import type { EntityStatus } from '../domain/shared/entity.types'

const serviceTypeLabels: Record<ServiceType, string> = {
  basic_cleaning: 'Limpieza básica',
  deep_cleaning: 'Limpieza profunda',
  post_construction: 'Final de obra',
  airbnb_turnover: 'Cambio turístico',
  gym_cleaning: 'Limpieza de gimnasio',
  office_cleaning: 'Limpieza de oficina',
  windows: 'Cristales',
  extra: 'Servicio extra',
  other: 'Otro servicio',
}

const propertyTypeLabels: Record<PropertyType, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  office: 'Oficina',
  gym: 'Gimnasio',
  commercial: 'Comercial',
  hotel: 'Hotel',
  tourist_apartment: 'Apartamento turístico',
  other: 'Otro',
}

const entityStatusLabels: Record<EntityStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  archived: 'Archivado',
}

const serviceStatusLabels: Record<ServiceStatus, string> = {
  draft: 'Borrador',
  scheduled: 'Programado',
  in_progress: 'En curso',
  completed: 'Completado',
  reviewed: 'Revisado',
  closed: 'Cerrado',
  cancelled: 'Cancelado',
}

const payrollStatusLabels: Record<PayrollStatus, string> = {
  pending: 'Pendiente',
  reviewed: 'Revisado',
  paid: 'Pagado',
  locked: 'Bloqueado',
}

const warningLevelLabels: Record<WarningLevel, string> = {
  danger: 'Crítico',
  blocked: 'Bloqueado',
  warning: 'Atención',
  info: 'Info',
  success: 'Correcto',
}

const workerRoleLabels: Record<WorkerRole, string> = {
  supervisor: 'Supervisión',
  cleaner: 'Limpieza',
  specialist: 'Especialista',
  driver: 'Logística',
}

export function formatServiceTypeLabel(value: ServiceType) {
  return serviceTypeLabels[value]
}

export function formatPropertyTypeLabel(value: PropertyType) {
  return propertyTypeLabels[value]
}

export function formatEntityStatusLabel(value: EntityStatus) {
  return entityStatusLabels[value]
}

export function formatServiceStatusLabel(value: ServiceStatus) {
  return serviceStatusLabels[value]
}

export function formatPayrollStatusLabel(value: PayrollStatus) {
  return payrollStatusLabels[value]
}

export function formatWarningLevelLabel(value: WarningLevel) {
  return warningLevelLabels[value]
}

export function formatWorkerRoleLabel(value: WorkerRole) {
  return workerRoleLabels[value]
}

export function getEntityStatusTone(value: EntityStatus): BadgeTone {
  if (value === 'active') {
    return 'success'
  }

  if (value === 'inactive') {
    return 'warning'
  }

  return 'neutral'
}

export function getServiceStatusTone(value: ServiceStatus): BadgeTone {
  if (value === 'completed' || value === 'reviewed' || value === 'closed') {
    return 'success'
  }

  if (value === 'cancelled') {
    return 'danger'
  }

  if (value === 'draft') {
    return 'neutral'
  }

  if (value === 'in_progress') {
    return 'info'
  }

  return 'warning'
}

export function getPayrollStatusTone(value: PayrollStatus): BadgeTone {
  if (value === 'paid') {
    return 'success'
  }

  if (value === 'locked') {
    return 'blocked'
  }

  if (value === 'reviewed') {
    return 'info'
  }

  return 'warning'
}

export function getWarningLevelTone(value: WarningLevel): BadgeTone {
  if (value === 'blocked') {
    return 'blocked'
  }

  return value
}
