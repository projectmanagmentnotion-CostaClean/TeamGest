import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { WarningItem } from '../../../domain/shared/warning.types'

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
