import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import { formatDate, isPayrollEligibleService, isSameMonthKey } from '../../../utils/dates'
import { calculateServiceLaborCost } from '../../services/services/serviceCalculations'

export function getClientProperties(clientId: string, properties: Property[]) {
  return properties.filter((property) => property.clientId === clientId)
}

export function getClientServices(clientId: string, services: ServiceJob[]) {
  return services.filter((service) => service.clientId === clientId)
}

export function getClientServicesByMonth(clientId: string, services: ServiceJob[], month: string) {
  return getClientServices(clientId, services).filter((service) => isSameMonthKey(service.date, month))
}

export function getClientServiceCountByMonth(clientId: string, services: ServiceJob[], month: string) {
  return getClientServicesByMonth(clientId, services, month).length
}

export function getClientCompletedServiceCountByMonth(
  clientId: string,
  services: ServiceJob[],
  month: string,
) {
  return getClientServicesByMonth(clientId, services, month).filter((service) =>
    isPayrollEligibleService(service.status),
  ).length
}

export function getClientLaborCostByMonth(clientId: string, services: ServiceJob[], month: string) {
  return getClientServicesByMonth(clientId, services, month).reduce(
    (sum, service) => sum + calculateServiceLaborCost(service),
    0,
  )
}

export function getClientLastServiceDate(clientId: string, services: ServiceJob[]) {
  const latestService = [...getClientServices(clientId, services)].sort((left, right) =>
    right.date.localeCompare(left.date),
  )[0]

  return latestService ? formatDate(latestService.date) : null
}

export function getClientActivePropertiesCount(clientId: string, properties: Property[]) {
  return getClientProperties(clientId, properties).filter((property) => property.status === 'active').length
}

export function getClientsSummary(
  clients: Client[],
  properties: Property[],
  services: ServiceJob[],
  month: string,
) {
  return clients.map((client) => ({
    client,
    propertyCount: getClientProperties(client.id, properties).length,
    activePropertyCount: getClientActivePropertiesCount(client.id, properties),
    servicesThisMonth: getClientServiceCountByMonth(client.id, services, month),
    completedServicesThisMonth: getClientCompletedServiceCountByMonth(client.id, services, month),
    laborCostThisMonth: getClientLaborCostByMonth(client.id, services, month),
    lastServiceDate: getClientLastServiceDate(client.id, services),
  }))
}
