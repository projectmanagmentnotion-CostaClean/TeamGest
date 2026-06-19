import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceAssignment, ServiceJob } from '../../../domain/services/service.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { isPayrollEligibleService, isSameMonthKey } from '../../../utils/dates'
import { getServiceWarnings } from './serviceWarnings'

export function getServiceClient(service: ServiceJob, clients: Client[]) {
  return clients.find((client) => client.id === service.clientId)
}

export function getServiceProperty(service: ServiceJob, properties: Property[]) {
  return properties.find((property) => property.id === service.propertyId)
}

export function getServiceAssignments(service: ServiceJob) {
  return service.assignments
}

export function getServiceWorkers(service: ServiceJob, workers: Worker[]) {
  return service.assignments.map((assignment) =>
    workers.find((worker) => worker.id === assignment.workerId),
  )
}

export function getServiceConfirmedAssignments(service: ServiceJob) {
  return service.assignments.filter((assignment) => assignment.confirmed)
}

type PayableAssignment = Pick<
  ServiceAssignment,
  'hoursWorked' | 'hourlyRate' | 'extraAmount' | 'deductions'
>

export function calculateAssignmentPay(assignment: PayableAssignment) {
  const baseRate = assignment.hourlyRate ?? 0
  const baseAmount = assignment.hoursWorked * baseRate
  const extras = assignment.extraAmount ?? 0
  const deductions = assignment.deductions ?? 0

  return baseAmount + extras - deductions
}

export function getServiceTotalHours(service: ServiceJob) {
  return service.assignments.reduce((sum, assignment) => sum + assignment.hoursWorked, 0)
}

export function getServiceConfirmedHours(service: ServiceJob) {
  return getServiceConfirmedAssignments(service).reduce(
    (sum, assignment) => sum + assignment.hoursWorked,
    0,
  )
}

export function getServiceTotalExtras(service: ServiceJob) {
  return service.assignments.reduce((sum, assignment) => sum + (assignment.extraAmount ?? 0), 0)
}

export function getServiceTotalDeductions(service: ServiceJob) {
  return service.assignments.reduce((sum, assignment) => sum + (assignment.deductions ?? 0), 0)
}

export function calculateServiceLaborCost(service: ServiceJob) {
  return service.assignments.reduce((sum, assignment) => sum + calculateAssignmentPay(assignment), 0)
}

export function getAverageServiceHourlyCost(service: ServiceJob) {
  const totalHours = getServiceTotalHours(service)
  if (totalHours <= 0) {
    return 0
  }

  return calculateServiceLaborCost(service) / totalHours
}

export function getServicesByMonth(services: ServiceJob[], month: string) {
  return services.filter((service) => isSameMonthKey(service.date, month))
}

export function getCompletedServicesByMonth(services: ServiceJob[], month: string) {
  return getServicesByMonth(services, month).filter((service) => isPayrollEligibleService(service.status))
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

export function getServicesSummary(
  services: ServiceJob[],
  workers: Worker[],
  properties: Property[],
  clients: Client[],
  month: string,
) {
  return getServicesByMonth(services, month).map((service) => ({
    service,
    client: getServiceClient(service, clients),
    property: getServiceProperty(service, properties),
    workers: getServiceWorkers(service, workers),
    totalHours: getServiceTotalHours(service),
    confirmedHours: getServiceConfirmedHours(service),
    laborCost: calculateServiceLaborCost(service),
    warnings: getServiceWarnings(service, workers, properties, clients),
  }))
}
