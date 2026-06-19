import type { PayrollSummary } from '../../../domain/payroll/payroll.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { calculateAssignmentPay } from '../../services/services/serviceCalculations'
import { isPayrollEligibleService, isSameMonthKey } from '../../../utils/dates'

export function calculateWorkerMonthlyHours(workerId: string, services: ServiceJob[], month: string) {
  return services.reduce((total, service) => {
    if (!isPayrollEligibleService(service.status) || !isSameMonthKey(service.date, month)) {
      return total
    }

    return (
      total +
      service.assignments
        .filter((assignment) => assignment.workerId === workerId && assignment.confirmed)
        .reduce((sum, assignment) => sum + assignment.hoursWorked, 0)
    )
  }, 0)
}

export function calculateWorkerMonthlyPay(workerId: string, services: ServiceJob[], month: string) {
  return services.reduce((total, service) => {
    if (!isPayrollEligibleService(service.status) || !isSameMonthKey(service.date, month)) {
      return total
    }

    return (
      total +
      service.assignments
        .filter((assignment) => assignment.workerId === workerId && assignment.confirmed)
        .reduce((sum, assignment) => sum + calculateAssignmentPay(assignment), 0)
    )
  }, 0)
}

export function calculateMonthlyPayrollSummary(
  workers: Worker[],
  services: ServiceJob[],
  month: string,
): PayrollSummary[] {
  return workers.map((worker) => {
    const assignments = services.flatMap((service) => {
      if (!isPayrollEligibleService(service.status) || !isSameMonthKey(service.date, month)) {
        return []
      }

      return service.assignments.filter(
        (assignment) => assignment.workerId === worker.id && assignment.confirmed,
      )
    })

    const totalHours = assignments.reduce((sum, assignment) => sum + assignment.hoursWorked, 0)
    const totalExtras = assignments.reduce((sum, assignment) => sum + (assignment.extraAmount ?? 0), 0)
    const totalDeductions = assignments.reduce(
      (sum, assignment) => sum + (assignment.deductions ?? 0),
      0,
    )
    const totalPay = assignments.reduce((sum, assignment) => sum + calculateAssignmentPay(assignment), 0)
    const relatedServices = services.filter(
      (service) =>
        isPayrollEligibleService(service.status) &&
        isSameMonthKey(service.date, month) &&
        service.assignments.some(
          (assignment) => assignment.workerId === worker.id && assignment.confirmed,
        ),
    )

    return {
      month,
      workerId: worker.id,
      totalServices: relatedServices.length,
      totalHours,
      totalExtras,
      totalDeductions,
      totalPay,
      status: totalPay > 0 ? 'reviewed' : 'pending',
    }
  })
}
