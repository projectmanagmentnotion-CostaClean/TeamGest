import type { HourEntry } from '../../../domain/hours/hourEntry.types'
import type { ServiceInput } from '../../../domain/services/service.inputs'
import { recordAuditEvent } from '../../../infrastructure/audit/auditRepository'
import { isHourEntryLocked } from './hourStatus'

type ServicesRepository = ReturnType<
  typeof import('../../../infrastructure/repositories/serviceRepository').createServiceRepository
>

export function confirmHourEntry(entry: HourEntry, servicesRepository: ServicesRepository) {
  if (isHourEntryLocked(entry)) {
    return { success: false, error: 'El cierre mensual esta bloqueado. No se pueden confirmar estas horas.' }
  }

  const service = servicesRepository.getServiceById(entry.serviceId)
  if (!service) {
    return { success: false, error: 'El servicio vinculado ya no existe.' }
  }

  const patchAssignments: ServiceInput['assignments'] = service.assignments.map((assignment) => ({
    workerId: assignment.workerId,
    hoursWorked: assignment.hoursWorked,
    hourlyRate: assignment.hourlyRate,
    extraAmount: assignment.extraAmount,
    deductions: assignment.deductions,
    confirmed: assignment.id === entry.assignmentId ? true : assignment.confirmed,
  }))

  const result = servicesRepository.updateService(entry.serviceId, {
    assignments: patchAssignments,
  })

  if (!result.service) {
    return { success: false, error: result.error ?? 'No se pudieron confirmar las horas.' }
  }

  recordAuditEvent({
    action: 'hour.confirmed',
    entityType: 'hour-entry',
    entityId: entry.id,
    message: `Se confirmaron las horas de ${entry.workerName} en ${entry.propertyName}.`,
    metadata: {
      serviceId: entry.serviceId,
      assignmentId: entry.assignmentId,
      workerId: entry.workerId,
      payrollMonth: entry.payrollMonth,
    },
  })

  return { success: true, error: null }
}
