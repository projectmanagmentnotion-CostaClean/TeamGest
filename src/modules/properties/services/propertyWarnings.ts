import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import type { WarningItem } from '../../../domain/shared/warning.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { formatMonthLabel, getMonthKey } from '../../../utils/dates'

export function getPropertyWarnings(property: Property, clients: Client[]) {
  const warnings: WarningItem[] = []
  const client = clients.find((item) => item.id === property.clientId)

  if (!client) {
    warnings.push({
      level: 'danger',
      title: 'Inmueble sin cliente válido',
      message: `${property.name} no tiene un cliente asociado válido.`,
      entityLabel: property.name,
    })
  }

  if (property.status !== 'active') {
    warnings.push({
      level: 'info',
      title: 'Inmueble no activo',
      message: `${property.name} está marcado como ${property.status}.`,
      entityLabel: property.name,
    })
  }

  return warnings
}

export function getPropertyOperationalWarnings(
  property: Property,
  clients: Client[],
  workers: Worker[],
  services: ServiceJob[],
) {
  const warnings = [...getPropertyWarnings(property, clients)]
  const month = getMonthKey(new Date().toISOString())
  const monthLabel = formatMonthLabel(month)
  const propertyServices = services.filter((service) => service.propertyId === property.id)

  if (property.status === 'active' && !property.city) {
    warnings.push({
      level: 'warning',
      title: 'Ciudad pendiente',
      message: `${property.name} está activo pero no tiene ciudad definida.`,
      entityLabel: property.name,
    })
  }

  if (property.status === 'active' && !property.address) {
    warnings.push({
      level: 'warning',
      title: 'Dirección pendiente',
      message: `${property.name} está activo pero no tiene dirección definida.`,
      entityLabel: property.name,
    })
  }

  if (
    property.status !== 'active' &&
    propertyServices.some(
      (service) => service.status === 'scheduled' || service.status === 'in_progress',
    )
  ) {
    warnings.push({
      level: 'danger',
      title: 'Inmueble inactivo con operación abierta',
      message: `${property.name} tiene servicios programados o en curso pese a estar inactivo.`,
      entityLabel: property.name,
    })
  }

  propertyServices.forEach((service) => {
    if (service.clientId !== property.clientId) {
      warnings.push({
        level: 'danger',
        title: 'Servicio con cliente cruzado',
        message: `${property.name} tiene un servicio cuyo cliente no coincide con el inmueble.`,
        entityLabel: property.name,
      })
    }

    if (service.assignments.length === 0) {
      warnings.push({
        level: 'blocked',
        title: 'Servicio sin trabajadores asignados',
        message: `${property.name} tiene un servicio sin asignaciones activas.`,
        entityLabel: property.name,
      })
    }

    service.assignments.forEach((assignment) => {
      const worker = workers.find((item) => item.id === assignment.workerId)
      if (!worker) {
        warnings.push({
          level: 'danger',
          title: 'Asignación con trabajador no encontrado',
          message: `${property.name} tiene una asignación sin trabajador válido.`,
          entityLabel: property.name,
        })
      }
    })
  })

  if (!propertyServices.some((service) => service.date.startsWith(month))) {
    warnings.push({
      level: 'info',
      title: 'Sin servicios este mes',
      message: `${property.name} no tiene servicios registrados en ${monthLabel}.`,
      entityLabel: property.name,
    })
  }

  return warnings
}

export function getPropertiesWithWarnings(
  properties: Property[],
  clients: Client[],
  workers: Worker[],
  services: ServiceJob[],
) {
  return properties.filter(
    (property) =>
      getPropertyOperationalWarnings(property, clients, workers, services).length > 0,
  )
}
