import type { ServiceStatus } from '../../../domain/shared/status.types'

export const SERVICE_STATUS_FLOW: ServiceStatus[] = [
  'draft',
  'scheduled',
  'in_progress',
  'completed',
  'reviewed',
  'closed',
]

const statusLabels: Record<ServiceStatus, string> = {
  draft: 'Borrador',
  scheduled: 'Programado',
  in_progress: 'En progreso',
  completed: 'Completado',
  reviewed: 'Revisado',
  closed: 'Cerrado',
  cancelled: 'Cancelado',
}

export function getServiceStatusStep(status: ServiceStatus) {
  return SERVICE_STATUS_FLOW.indexOf(status)
}

export function getServiceStatusLabel(status: ServiceStatus) {
  return statusLabels[status]
}

export function isServiceEditable(status: ServiceStatus) {
  return status === 'draft' || status === 'scheduled' || status === 'in_progress'
}

export function isServiceClosed(status: ServiceStatus) {
  return status === 'closed' || status === 'cancelled'
}

export function isServicePayable(status: ServiceStatus) {
  return status === 'completed' || status === 'reviewed' || status === 'closed'
}

export function getNextAllowedStatuses(status: ServiceStatus) {
  if (status === 'cancelled' || status === 'closed') {
    return [] as ServiceStatus[]
  }

  if (status === 'reviewed') {
    return ['closed']
  }

  if (status === 'completed') {
    return ['reviewed', 'closed']
  }

  if (status === 'in_progress') {
    return ['completed', 'cancelled']
  }

  if (status === 'scheduled') {
    return ['in_progress', 'completed', 'cancelled']
  }

  return ['scheduled', 'cancelled']
}
