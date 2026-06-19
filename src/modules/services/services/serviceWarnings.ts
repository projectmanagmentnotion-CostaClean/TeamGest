import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import type { WarningItem } from '../../../domain/shared/warning.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { formatServiceTypeLabel } from '../../../utils/labels'

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

  if (service.assignments.length === 0) {
    warnings.push({
      level: 'blocked',
      title: 'Servicio sin asignaciones',
      message: `${serviceLabel} no tiene trabajadores asignados.`,
      entityLabel: property?.name ?? serviceLabel,
    })
  }

  service.assignments.forEach((assignment) => {
    const worker = workers.find((item) => item.id === assignment.workerId)

    if (!worker) {
      warnings.push({
        level: 'danger',
        title: 'Asignación con trabajador inexistente',
        message: `${serviceLabel} incluye una asignación con trabajador no encontrado.`,
        entityLabel: property?.name ?? serviceLabel,
      })
    }

    if ((assignment.hourlyRate ?? 0) <= 0) {
      warnings.push({
        level: 'warning',
        title: 'Asignación sin tarifa horaria',
        message: `${worker?.name ?? 'Un trabajador'} no tiene tarifa horaria definida en este servicio.`,
        entityLabel: property?.name ?? serviceLabel,
      })
    }
  })

  return warnings
}
