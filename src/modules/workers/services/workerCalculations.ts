import type { ServiceJob } from '../../../domain/services/service.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { calculateAssignmentPay, isAssignmentIncludedInPayroll } from '../../services/services/serviceCalculations'
import { isPayrollEligibleService, isSameMonthKey } from '../../../utils/dates'

export function getWorkerServices(workerId: string, services: ServiceJob[]) {
  return services.filter((service) =>
    service.assignments.some((assignment) => assignment.workerId === workerId),
  )
}

export function getWorkerServicesByMonth(workerId: string, services: ServiceJob[], month: string) {
  return getWorkerServices(workerId, services).filter((service) => isSameMonthKey(service.date, month))
}

export function getWorkerMonthlyServiceCount(workerId: string, services: ServiceJob[], month: string) {
  return getWorkerServicesByMonth(workerId, services, month).filter((service) =>
    isPayrollEligibleService(service.status),
  ).length
}

export function getWorkerMonthlyHours(workerId: string, services: ServiceJob[], month: string) {
  return services.reduce((total, service) => {
    if (!isPayrollEligibleService(service.status) || !isSameMonthKey(service.date, month)) {
      return total
    }

    return (
      total +
      service.assignments
        .filter(
          (assignment) =>
            assignment.workerId === workerId && isAssignmentIncludedInPayroll(service, assignment),
        )
        .reduce((sum, assignment) => sum + assignment.hoursWorked, 0)
    )
  }, 0)
}

export function getWorkerMonthlyPay(workerId: string, services: ServiceJob[], month: string) {
  return services.reduce((total, service) => {
    if (!isPayrollEligibleService(service.status) || !isSameMonthKey(service.date, month)) {
      return total
    }

    return (
      total +
      service.assignments
        .filter(
          (assignment) =>
            assignment.workerId === workerId && isAssignmentIncludedInPayroll(service, assignment),
        )
        .reduce((sum, assignment) => sum + calculateAssignmentPay(assignment), 0)
    )
  }, 0)
}

export function getWorkerMonthlyExtras(workerId: string, services: ServiceJob[], month: string) {
  return services.reduce((total, service) => {
    if (!isPayrollEligibleService(service.status) || !isSameMonthKey(service.date, month)) {
      return total
    }

    return (
      total +
      service.assignments
        .filter(
          (assignment) =>
            assignment.workerId === workerId && isAssignmentIncludedInPayroll(service, assignment),
        )
        .reduce((sum, assignment) => sum + (assignment.extraAmount ?? 0), 0)
    )
  }, 0)
}

export function getWorkerMonthlyDeductions(workerId: string, services: ServiceJob[], month: string) {
  return services.reduce((total, service) => {
    if (!isPayrollEligibleService(service.status) || !isSameMonthKey(service.date, month)) {
      return total
    }

    return (
      total +
      service.assignments
        .filter(
          (assignment) =>
            assignment.workerId === workerId && isAssignmentIncludedInPayroll(service, assignment),
        )
        .reduce((sum, assignment) => sum + (assignment.deductions ?? 0), 0)
    )
  }, 0)
}

export function getWorkerAverageHoursPerService(workerId: string, services: ServiceJob[], month: string) {
  const serviceCount = getWorkerMonthlyServiceCount(workerId, services, month)
  if (serviceCount === 0) {
    return 0
  }

  return getWorkerMonthlyHours(workerId, services, month) / serviceCount
}

export function getWorkersSummary(workers: Worker[], services: ServiceJob[], month: string) {
  return workers.map((worker) => ({
    worker,
    monthlyHours: getWorkerMonthlyHours(worker.id, services, month),
    monthlyPay: getWorkerMonthlyPay(worker.id, services, month),
    monthlyServices: getWorkerMonthlyServiceCount(worker.id, services, month),
    extras: getWorkerMonthlyExtras(worker.id, services, month),
    deductions: getWorkerMonthlyDeductions(worker.id, services, month),
    averageHoursPerService: getWorkerAverageHoursPerService(worker.id, services, month),
  }))
}
