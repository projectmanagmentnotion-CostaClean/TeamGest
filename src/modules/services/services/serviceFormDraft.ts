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
        workerId: assignment.workerId,
        hoursWorked: assignment.hoursWorked,
        hourlyRate: assignment.hourlyRate,
        extraAmount: assignment.extraAmount,
        deductions: assignment.deductions,
        confirmed: assignment.confirmed,
      })) ?? [],
    notes: service?.notes ?? '',
  }
}
