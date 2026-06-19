import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import type { WarningItem } from '../../../domain/shared/warning.types'
import { getMonthKey } from '../../../utils/dates'
import { formatMonthLabel } from '../../../utils/dates'
import { getClientProperties, getClientServicesByMonth } from './clientCalculations'

export function getClientWarnings(client: Client) {
  const warnings: WarningItem[] = []

  if (client.status === 'active' && !client.phone && !client.email) {
    warnings.push({
      level: 'warning',
      title: 'Contacto incompleto',
      message: `${client.name} no tiene teléfono ni correo operativo.`,
      entityLabel: client.name,
    })
  }

  return warnings
}

export function getClientOperationalWarnings(
  client: Client,
  properties: Property[],
  services: ServiceJob[],
) {
  const warnings = [...getClientWarnings(client)]
  const month = getMonthKey(new Date().toISOString())
  const monthLabel = formatMonthLabel(month)
  const clientProperties = getClientProperties(client.id, properties)
  const clientServicesThisMonth = getClientServicesByMonth(client.id, services, month)
  const activeProperties = clientProperties.filter((property) => property.status === 'active')

  if (clientProperties.length === 0) {
    warnings.push({
      level: 'warning',
      title: 'Cliente sin inmuebles',
      message: `${client.name} no tiene inmuebles asociados.`,
      entityLabel: client.name,
    })
  }

  if (client.status !== 'active' && activeProperties.length > 0) {
    warnings.push({
      level: 'warning',
      title: 'Cliente inactivo con inmuebles activos',
      message: `${client.name} está inactivo pero mantiene inmuebles activos asociados.`,
      entityLabel: client.name,
    })
  }

  if (
    client.status !== 'active' &&
    services.some(
      (service) =>
        service.clientId === client.id &&
        (service.status === 'scheduled' || service.status === 'in_progress'),
    )
  ) {
    warnings.push({
      level: 'danger',
      title: 'Cliente inactivo con operación abierta',
      message: `${client.name} tiene servicios programados o en curso pese a estar inactivo.`,
      entityLabel: client.name,
    })
  }

  services
    .filter((service) => service.clientId === client.id)
    .forEach((service) => {
      const relatedProperty = properties.find((property) => property.id === service.propertyId)
      if (relatedProperty && relatedProperty.clientId !== client.id) {
        warnings.push({
          level: 'danger',
          title: 'Servicio enlazado a inmueble de otro cliente',
          message: `${client.name} tiene un servicio vinculado a ${relatedProperty.name}, que pertenece a otro cliente.`,
          entityLabel: client.name,
        })
      }
    })

  if (clientServicesThisMonth.length === 0) {
    warnings.push({
      level: 'info',
      title: 'Sin servicios este mes',
      message: `${client.name} no tiene servicios registrados en ${monthLabel}.`,
      entityLabel: client.name,
    })
  }

  return warnings
}

export function getClientsWithWarnings(
  clients: Client[],
  properties: Property[],
  services: ServiceJob[],
) {
  return clients.filter(
    (client) => getClientOperationalWarnings(client, properties, services).length > 0,
  )
}
