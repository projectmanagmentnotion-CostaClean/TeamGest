import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { formatDate, isPayrollEligibleService, isSameMonthKey } from '../../../utils/dates'
import { calculateAssignmentPay, calculateServiceLaborCost } from '../../services/services/serviceCalculations'

export function getPropertyClient(property: Property, clients: Client[]) {
  return clients.find((client) => client.id === property.clientId)
}

export function getPropertyServices(propertyId: string, services: ServiceJob[]) {
  return services.filter((service) => service.propertyId === propertyId)
}

export function getPropertyServicesByMonth(propertyId: string, services: ServiceJob[], month: string) {
  return getPropertyServices(propertyId, services).filter((service) => isSameMonthKey(service.date, month))
}

export function getPropertyServiceCountByMonth(propertyId: string, services: ServiceJob[], month: string) {
  return getPropertyServicesByMonth(propertyId, services, month).length
}

export function getPropertyCompletedServiceCountByMonth(
  propertyId: string,
  services: ServiceJob[],
  month: string,
) {
  return getPropertyServicesByMonth(propertyId, services, month).filter((service) =>
    isPayrollEligibleService(service.status),
  ).length
}

export function getPropertyLaborCostByMonth(propertyId: string, services: ServiceJob[], month: string) {
  return getPropertyServicesByMonth(propertyId, services, month).reduce(
    (sum, service) => sum + calculateServiceLaborCost(service),
    0,
  )
}

export function getPropertyLastServiceDate(propertyId: string, services: ServiceJob[]) {
  const latestService = [...getPropertyServices(propertyId, services)].sort((left, right) =>
    right.date.localeCompare(left.date),
  )[0]

  return latestService ? formatDate(latestService.date) : null
}

export function getPropertyWorkerParticipations(
  propertyId: string,
  workers: Worker[],
  services: ServiceJob[],
  month: string,
) {
  const summaryByWorker = new Map<
    string,
    {
      worker?: Worker
      totalHours: number
      totalPay: number
      serviceCount: number
      missingAssignments: number
    }
  >()

  getPropertyServicesByMonth(propertyId, services, month).forEach((service) => {
    service.assignments.forEach((assignment) => {
      const current = summaryByWorker.get(assignment.workerId) ?? {
        worker: workers.find((worker) => worker.id === assignment.workerId),
        totalHours: 0,
        totalPay: 0,
        serviceCount: 0,
        missingAssignments: 0,
      }

      current.totalHours += assignment.hoursWorked
      current.totalPay += calculateAssignmentPay(assignment)
      current.serviceCount += 1

      if (!current.worker) {
        current.missingAssignments += 1
      }

      summaryByWorker.set(assignment.workerId, current)
    })
  })

  return [...summaryByWorker.entries()].map(([workerId, data]) => ({
    workerId,
    worker: data.worker,
    totalHours: data.totalHours,
    totalPay: data.totalPay,
    serviceCount: data.serviceCount,
    missingAssignments: data.missingAssignments,
  }))
}

export function getPropertiesSummary(
  properties: Property[],
  clients: Client[],
  workers: Worker[],
  services: ServiceJob[],
  month: string,
) {
  return properties.map((property) => ({
    property,
    client: getPropertyClient(property, clients),
    servicesThisMonth: getPropertyServiceCountByMonth(property.id, services, month),
    completedServicesThisMonth: getPropertyCompletedServiceCountByMonth(property.id, services, month),
    laborCostThisMonth: getPropertyLaborCostByMonth(property.id, services, month),
    lastServiceDate: getPropertyLastServiceDate(property.id, services),
    workerParticipations: getPropertyWorkerParticipations(property.id, workers, services, month),
  }))
}
