import type { ServiceInput } from '../../../domain/services/service.inputs'
import type { ServiceJob } from '../../../domain/services/service.types'

export function createServiceFormDraft(service?: ServiceJob): ServiceInput {
  return {
    clientId: service?.clientId ?? '',
    propertyId: service?.propertyId ?? '',
    serviceType: service?.serviceType ?? 'basic_cleaning',
    date: service?.date ?? new Date().toISOString().slice(0, 10),
    startTime: service?.startTime ?? '',
    endTime: service?.endTime ?? '',
    status: service?.status ?? 'scheduled',
    assignments:
      service?.assignments.map((assignment) => ({
        assignmentId: assignment.id,
        workerId: assignment.workerId,
        hoursWorked: assignment.hoursWorked,
        hourlyRate: assignment.hourlyRate,
        extraAmount: assignment.extraAmount,
        deductions: assignment.deductions,
        confirmed: assignment.confirmed,
        hourStatusOverride: assignment.hourStatusOverride,
        reviewNote: assignment.reviewNote,
        incidentNote: assignment.incidentNote,
        excludeReason: assignment.excludeReason,
        reviewedAt: assignment.reviewedAt,
        reviewedBy: assignment.reviewedBy,
        excludedFromPayroll: assignment.excludedFromPayroll,
      })) ?? [],
    notes: service?.notes ?? '',
  }
}
