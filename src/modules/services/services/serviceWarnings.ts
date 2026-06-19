import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import type { WarningItem } from '../../../domain/shared/warning.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { formatServiceTypeLabel } from '../../../utils/labels'
import { isServiceClosed } from './serviceStatusFlow'

export function getServiceAssignmentWarnings(service: ServiceJob, workers: Worker[]) {
  const warnings: WarningItem[] = []

  service.assignments.forEach((assignment) => {
    const worker = workers.find((item) => item.id === assignment.workerId)

    if (!worker) {
      warnings.push({
        level: 'danger',
        title: 'Asignación con trabajador inexistente',
        message: `Una asignación del servicio no tiene un trabajador válido.`,
        entityLabel: service.id,
      })
    }

    if ((assignment.hourlyRate ?? 0) <= 0) {
      warnings.push({
        level: 'warning',
        title: 'Asignación sin tarifa horaria',
        message: `${worker?.name ?? 'Un trabajador'} no tiene tarifa horaria definida en este servicio.`,
        entityLabel: worker?.name ?? service.id,
      })
    }

    if (assignment.hoursWorked <= 0) {
      warnings.push({
        level: 'warning',
        title: 'Asignación con horas no válidas',
        message: `${worker?.name ?? 'Una asignación'} tiene horas iguales o menores que cero.`,
        entityLabel: worker?.name ?? service.id,
      })
    }
  })

  return warnings
}

export function getServiceWarnings(
  service: ServiceJob,
  workers: Worker[],
  properties: Property[],
  clients: Client[],
) {
  const warnings: WarningItem[] = []
  const serviceLabel = formatServiceTypeLabel(service.serviceType)
  const property = properties.find((item) => item.id === service.propertyId)
  const client = clients.find((item) => item.id === service.clientId)

  if (!property) {
    warnings.push({
      level: 'danger',
      title: 'Servicio sin inmueble válido',
      message: `${serviceLabel} no tiene un inmueble relacionado válido.`,
      entityLabel: serviceLabel,
    })
  }

  if (!client) {
    warnings.push({
      level: 'danger',
      title: 'Servicio sin cliente válido',
      message: `${serviceLabel} no tiene un cliente relacionado válido.`,
      entityLabel: serviceLabel,
    })
  }

  if (property && client && property.clientId !== client.id) {
    warnings.push({
      level: 'danger',
      title: 'Inmueble y cliente no coinciden',
      message: `${serviceLabel} está vinculado a un inmueble que no pertenece al cliente indicado.`,
      entityLabel: property.name,
    })
  }

  if (service.assignments.length === 0) {
    warnings.push({
      level: 'blocked',
      title: 'Servicio sin asignaciones',
      message: `${serviceLabel} no tiene trabajadores asignados.`,
      entityLabel: property?.name ?? serviceLabel,
    })
  }

  warnings.push(...getServiceAssignmentWarnings(service, workers))

  if (
    (service.status === 'completed' || service.status === 'reviewed' || service.status === 'closed') &&
    service.assignments.some((assignment) => !assignment.confirmed)
  ) {
    warnings.push({
      level: 'warning',
      title: 'Servicio con asignaciones sin confirmar',
      message: `${serviceLabel} ya está avanzado, pero mantiene asignaciones sin confirmar.`,
      entityLabel: property?.name ?? serviceLabel,
    })
  }

  if (service.status === 'closed') {
    warnings.push({
      level: 'blocked',
      title: 'Servicio cerrado',
      message: `${serviceLabel} está bloqueado para edición operativa.`,
      entityLabel: property?.name ?? serviceLabel,
    })
  }

  if (service.status === 'cancelled' || isServiceClosed(service.status)) {
    if (service.status === 'cancelled') {
      warnings.push({
        level: 'info',
        title: 'Servicio cancelado',
        message: `${serviceLabel} quedó cancelado y no forma parte del flujo operativo pagable.`,
        entityLabel: property?.name ?? serviceLabel,
      })
    }
  }

  return warnings
}

export function getServicesWithWarnings(
  services: ServiceJob[],
  workers: Worker[],
  properties: Property[],
  clients: Client[],
) {
  return services.filter(
    (service) => getServiceWarnings(service, workers, properties, clients).length > 0,
  )
}
