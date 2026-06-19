import type { ServiceAssignment, ServiceJob } from '../../../domain/services/service.types'

export function calculateAssignmentPay(assignment: ServiceAssignment) {
  const baseRate = assignment.hourlyRate ?? 0
  const baseAmount = assignment.hoursWorked * baseRate
  const extras = assignment.extraAmount ?? 0
  const deductions = assignment.deductions ?? 0

  return baseAmount + extras - deductions
}

export function calculateServiceLaborCost(service: ServiceJob) {
  return service.assignments.reduce((sum, assignment) => sum + calculateAssignmentPay(assignment), 0)
}
