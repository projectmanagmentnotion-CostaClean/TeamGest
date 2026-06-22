import type { HourEntry } from '../../../domain/hours/hourEntry.types'
import type { PayrollMonthState } from '../../../domain/payroll/payroll.types'
import type { ServiceInput } from '../../../domain/services/service.inputs'
import { recordAuditEvent } from '../../../infrastructure/audit/auditRepository'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { getAppSettings } from '../../settings/services/appSettingsService'
import { validateExcludeReason, validateHourCorrectionPatch, validateIncidentNote, type HourCorrectionPatch } from './hourReviewValidation'

function parseHourEntryId(entryId: string) {
  const [serviceId, assignmentId] = entryId.split(':')
  return { serviceId, assignmentId }
}

function buildMissingEntryError() {
  return { success: false, error: 'La entrada de horas solicitada ya no existe.' as const }
}

function getServiceAssignmentContext(entryId: string) {
  const repositories = getRepositories()
  const { serviceId, assignmentId } = parseHourEntryId(entryId)
  const service = repositories.services.getServiceById(serviceId)
  const assignment = service?.assignments.find((item) => item.id === assignmentId)

  return {
    repositories,
    service,
    assignment,
    payrollState: service ? repositories.payroll.getPayrollMonthState(service.date.slice(0, 7)) : undefined,
  }
}

function buildAssignmentsPatch(
  currentAssignments: NonNullable<ReturnType<typeof getServiceAssignmentContext>['service']>['assignments'],
  assignmentId: string,
  patch: Partial<ServiceInput['assignments'][number]>,
): ServiceInput['assignments'] {
  return currentAssignments.map((assignment) => ({
    assignmentId: assignment.id,
    workerId: assignment.workerId,
    hoursWorked: assignment.id === assignmentId ? patch.hoursWorked ?? assignment.hoursWorked : assignment.hoursWorked,
    hourlyRate: assignment.id === assignmentId ? patch.hourlyRate ?? assignment.hourlyRate : assignment.hourlyRate,
    extraAmount: assignment.id === assignmentId ? patch.extraAmount ?? assignment.extraAmount : assignment.extraAmount,
    deductions: assignment.id === assignmentId ? patch.deductions ?? assignment.deductions : assignment.deductions,
    confirmed: assignment.id === assignmentId ? patch.confirmed ?? assignment.confirmed : assignment.confirmed,
    hourStatusOverride:
      assignment.id === assignmentId ? patch.hourStatusOverride ?? assignment.hourStatusOverride : assignment.hourStatusOverride,
    reviewNote: assignment.id === assignmentId ? patch.reviewNote ?? assignment.reviewNote : assignment.reviewNote,
    incidentNote: assignment.id === assignmentId ? patch.incidentNote ?? assignment.incidentNote : assignment.incidentNote,
    excludeReason: assignment.id === assignmentId ? patch.excludeReason ?? assignment.excludeReason : assignment.excludeReason,
    reviewedAt: assignment.id === assignmentId ? patch.reviewedAt ?? assignment.reviewedAt : assignment.reviewedAt,
    reviewedBy: assignment.id === assignmentId ? patch.reviewedBy ?? assignment.reviewedBy : assignment.reviewedBy,
    excludedFromPayroll:
      assignment.id === assignmentId
        ? patch.excludedFromPayroll ?? assignment.excludedFromPayroll
        : assignment.excludedFromPayroll,
  }))
}

function getLockedReason(payrollState?: PayrollMonthState) {
  return payrollState?.status === 'locked'
    ? 'El cierre mensual esta bloqueado y no admite cambios en estas horas.'
    : null
}

export function canEditHourEntry(entry: HourEntry, payrollState?: PayrollMonthState) {
  if (payrollState?.status === 'locked' || entry.isLocked) {
    return { allowed: false, reason: getLockedReason(payrollState) ?? 'La entrada esta bloqueada.' }
  }

  return { allowed: true as const }
}

export function canConfirmHourEntry(entry: HourEntry, payrollState?: PayrollMonthState) {
  const policy = canEditHourEntry(entry, payrollState)
  if (!policy.allowed) {
    return policy
  }

  if (entry.hourStatus === 'excluded') {
    return { allowed: false, reason: 'La entrada esta excluida y debe restaurarse antes de confirmar.' }
  }

  if (entry.hoursWorked <= 0 || entry.hourlyRate <= 0) {
    return { allowed: false, reason: 'Las horas y la tarifa deben ser validas antes de confirmar.' }
  }

  return { allowed: true as const }
}

export function canCorrectHourEntry(entry: HourEntry, payrollState?: PayrollMonthState) {
  return canEditHourEntry(entry, payrollState)
}

export function canMarkIncident(entry: HourEntry, payrollState?: PayrollMonthState) {
  return canEditHourEntry(entry, payrollState)
}

export function canExcludeHourEntry(entry: HourEntry, payrollState?: PayrollMonthState) {
  const policy = canEditHourEntry(entry, payrollState)
  if (!policy.allowed) {
    return policy
  }

  if (entry.hourStatus === 'excluded') {
    return { allowed: false, reason: 'La entrada ya esta excluida.' }
  }

  return { allowed: true as const }
}

export function canRestoreHourEntry(entry: HourEntry, payrollState?: PayrollMonthState) {
  const policy = canEditHourEntry(entry, payrollState)
  if (!policy.allowed) {
    return policy
  }

  if (!getAppSettings().hourReviewSettings.allowExcludedEntriesRestore) {
    return { allowed: false, reason: 'La restauracion de excluidas esta desactivada en ajustes.' }
  }

  if (entry.hourStatus !== 'excluded') {
    return { allowed: false, reason: 'La entrada no esta excluida.' }
  }

  return { allowed: true as const }
}

export function confirmHourEntry(entryId: string) {
  const { repositories, service, assignment, payrollState } = getServiceAssignmentContext(entryId)
  if (!service || !assignment) {
    return buildMissingEntryError()
  }

  const policy = canConfirmHourEntry(
    {
      id: entryId,
      serviceId: service.id,
      assignmentId: assignment.id,
      workerId: assignment.workerId,
      workerName: '',
      propertyId: service.propertyId,
      propertyName: '',
      clientId: service.clientId,
      clientName: '',
      serviceType: service.serviceType,
      date: service.date,
      startTime: service.startTime,
      endTime: service.endTime,
      hoursWorked: assignment.hoursWorked,
      hourlyRate: assignment.hourlyRate ?? 0,
      extraAmount: assignment.extraAmount ?? 0,
      deductions: assignment.deductions ?? 0,
      totalPay: 0,
      confirmed: assignment.confirmed,
      reviewNote: assignment.reviewNote,
      incidentNote: assignment.incidentNote,
      excludeReason: assignment.excludeReason,
      excludedFromPayroll: assignment.excludedFromPayroll ?? false,
      reviewedAt: assignment.reviewedAt,
      reviewedBy: assignment.reviewedBy,
      hourStatusOverride: assignment.hourStatusOverride,
      serviceStatus: service.status,
      hourStatus: 'pending_review',
      payrollMonth: service.date.slice(0, 7),
      isLocked: payrollState?.status === 'locked',
      warnings: [],
    },
    payrollState,
  )
  if (!policy.allowed) {
    return { success: false, error: policy.reason }
  }

  const result = repositories.services.updateService(service.id, {
    assignments: buildAssignmentsPatch(service.assignments, assignment.id, {
      confirmed: true,
      hourStatusOverride: 'confirmed',
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'local_manager',
      incidentNote: undefined,
      reviewNote: assignment.reviewNote,
      excludedFromPayroll: false,
      excludeReason: undefined,
    }),
  })

  if (!result.service) {
    return { success: false, error: result.error ?? 'No se pudieron confirmar las horas.' }
  }

  recordAuditEvent({
    action: 'hour.confirmed',
    entityType: 'hour-entry',
    entityId: entryId,
    message: `Se confirmaron las horas de la asignacion ${assignment.id}.`,
    metadata: {
      serviceId: service.id,
      assignmentId: assignment.id,
      workerId: assignment.workerId,
    },
  })

  return { success: true, error: null }
}

export function correctHourEntry(entryId: string, patch: HourCorrectionPatch) {
  const validationErrors = validateHourCorrectionPatch(patch)
  if (validationErrors.length > 0) {
    return { success: false, error: validationErrors[0] }
  }

  const { repositories, service, assignment, payrollState } = getServiceAssignmentContext(entryId)
  if (!service || !assignment) {
    return buildMissingEntryError()
  }

  const policy = canCorrectHourEntry(
    {
      id: entryId,
      serviceId: service.id,
      assignmentId: assignment.id,
      workerId: assignment.workerId,
      workerName: '',
      propertyId: service.propertyId,
      propertyName: '',
      clientId: service.clientId,
      clientName: '',
      serviceType: service.serviceType,
      date: service.date,
      startTime: service.startTime,
      endTime: service.endTime,
      hoursWorked: assignment.hoursWorked,
      hourlyRate: assignment.hourlyRate ?? 0,
      extraAmount: assignment.extraAmount ?? 0,
      deductions: assignment.deductions ?? 0,
      totalPay: 0,
      confirmed: assignment.confirmed,
      reviewNote: assignment.reviewNote,
      incidentNote: assignment.incidentNote,
      excludeReason: assignment.excludeReason,
      excludedFromPayroll: assignment.excludedFromPayroll ?? false,
      reviewedAt: assignment.reviewedAt,
      reviewedBy: assignment.reviewedBy,
      hourStatusOverride: assignment.hourStatusOverride,
      serviceStatus: service.status,
      hourStatus: 'pending_review',
      payrollMonth: service.date.slice(0, 7),
      isLocked: payrollState?.status === 'locked',
      warnings: [],
    },
    payrollState,
  )
  if (!policy.allowed) {
    return { success: false, error: policy.reason }
  }

  const result = repositories.services.updateService(service.id, {
    startTime: patch.startTime ?? service.startTime,
    endTime: patch.endTime ?? service.endTime,
    assignments: buildAssignmentsPatch(service.assignments, assignment.id, {
      hoursWorked: patch.hoursWorked,
      hourlyRate: patch.hourlyRate,
      extraAmount: patch.extraAmount,
      deductions: patch.deductions,
      reviewNote: patch.reviewNote,
      hourStatusOverride: assignment.confirmed ? 'confirmed' : 'pending_review',
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'local_manager',
      confirmed: assignment.confirmed,
      excludedFromPayroll: false,
      excludeReason: undefined,
      incidentNote: undefined,
    }),
  })

  if (!result.service) {
    return { success: false, error: result.error ?? 'No se pudo guardar la correccion.' }
  }

  recordAuditEvent({
    action: 'hour.corrected',
    entityType: 'hour-entry',
    entityId: entryId,
    message: `Se corrigieron las horas de la asignacion ${assignment.id}.`,
    metadata: {
      serviceId: service.id,
      assignmentId: assignment.id,
      workerId: assignment.workerId,
    },
  })

  return { success: true, error: null }
}

export function markHourEntryIncident(entryId: string, note: string) {
  const validationErrors = validateIncidentNote(note)
  if (validationErrors.length > 0) {
    return { success: false, error: validationErrors[0] }
  }

  const { repositories, service, assignment, payrollState } = getServiceAssignmentContext(entryId)
  if (!service || !assignment) {
    return buildMissingEntryError()
  }

  const policy = canMarkIncident(
    {
      id: entryId,
      serviceId: service.id,
      assignmentId: assignment.id,
      workerId: assignment.workerId,
      workerName: '',
      propertyId: service.propertyId,
      propertyName: '',
      clientId: service.clientId,
      clientName: '',
      serviceType: service.serviceType,
      date: service.date,
      startTime: service.startTime,
      endTime: service.endTime,
      hoursWorked: assignment.hoursWorked,
      hourlyRate: assignment.hourlyRate ?? 0,
      extraAmount: assignment.extraAmount ?? 0,
      deductions: assignment.deductions ?? 0,
      totalPay: 0,
      confirmed: assignment.confirmed,
      reviewNote: assignment.reviewNote,
      incidentNote: assignment.incidentNote,
      excludeReason: assignment.excludeReason,
      excludedFromPayroll: assignment.excludedFromPayroll ?? false,
      reviewedAt: assignment.reviewedAt,
      reviewedBy: assignment.reviewedBy,
      hourStatusOverride: assignment.hourStatusOverride,
      serviceStatus: service.status,
      hourStatus: 'issue',
      payrollMonth: service.date.slice(0, 7),
      isLocked: payrollState?.status === 'locked',
      warnings: [],
    },
    payrollState,
  )
  if (!policy.allowed) {
    return { success: false, error: policy.reason }
  }

  const result = repositories.services.updateService(service.id, {
    assignments: buildAssignmentsPatch(service.assignments, assignment.id, {
      confirmed: false,
      hourStatusOverride: 'issue',
      incidentNote: note.trim(),
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'local_manager',
    }),
  })

  if (!result.service) {
    return { success: false, error: result.error ?? 'No se pudo registrar la incidencia.' }
  }

  recordAuditEvent({
    action: 'hour.incident_marked',
    entityType: 'hour-entry',
    entityId: entryId,
    message: `Se marco incidencia en la asignacion ${assignment.id}.`,
    metadata: {
      serviceId: service.id,
      assignmentId: assignment.id,
      workerId: assignment.workerId,
    },
  })

  return { success: true, error: null }
}

export function excludeHourEntry(entryId: string, reason: string) {
  const validationErrors = validateExcludeReason(reason)
  if (validationErrors.length > 0) {
    return { success: false, error: validationErrors[0] }
  }

  const { repositories, service, assignment, payrollState } = getServiceAssignmentContext(entryId)
  if (!service || !assignment) {
    return buildMissingEntryError()
  }

  const policy = canExcludeHourEntry(
    {
      id: entryId,
      serviceId: service.id,
      assignmentId: assignment.id,
      workerId: assignment.workerId,
      workerName: '',
      propertyId: service.propertyId,
      propertyName: '',
      clientId: service.clientId,
      clientName: '',
      serviceType: service.serviceType,
      date: service.date,
      startTime: service.startTime,
      endTime: service.endTime,
      hoursWorked: assignment.hoursWorked,
      hourlyRate: assignment.hourlyRate ?? 0,
      extraAmount: assignment.extraAmount ?? 0,
      deductions: assignment.deductions ?? 0,
      totalPay: 0,
      confirmed: assignment.confirmed,
      reviewNote: assignment.reviewNote,
      incidentNote: assignment.incidentNote,
      excludeReason: assignment.excludeReason,
      excludedFromPayroll: assignment.excludedFromPayroll ?? false,
      reviewedAt: assignment.reviewedAt,
      reviewedBy: assignment.reviewedBy,
      hourStatusOverride: assignment.hourStatusOverride,
      serviceStatus: service.status,
      hourStatus: 'confirmed',
      payrollMonth: service.date.slice(0, 7),
      isLocked: payrollState?.status === 'locked',
      warnings: [],
    },
    payrollState,
  )
  if (!policy.allowed) {
    return { success: false, error: policy.reason }
  }

  const result = repositories.services.updateService(service.id, {
    assignments: buildAssignmentsPatch(service.assignments, assignment.id, {
      confirmed: false,
      hourStatusOverride: 'excluded',
      excludedFromPayroll: true,
      excludeReason: reason.trim(),
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'local_manager',
    }),
  })

  if (!result.service) {
    return { success: false, error: result.error ?? 'No se pudo excluir la entrada.' }
  }

  recordAuditEvent({
    action: 'hour.excluded',
    entityType: 'hour-entry',
    entityId: entryId,
    message: `Se excluyo la asignacion ${assignment.id} del payroll.`,
    metadata: {
      serviceId: service.id,
      assignmentId: assignment.id,
      workerId: assignment.workerId,
    },
  })

  return { success: true, error: null }
}

export function restoreHourEntry(entryId: string) {
  const { repositories, service, assignment, payrollState } = getServiceAssignmentContext(entryId)
  if (!service || !assignment) {
    return buildMissingEntryError()
  }

  const policy = canRestoreHourEntry(
    {
      id: entryId,
      serviceId: service.id,
      assignmentId: assignment.id,
      workerId: assignment.workerId,
      workerName: '',
      propertyId: service.propertyId,
      propertyName: '',
      clientId: service.clientId,
      clientName: '',
      serviceType: service.serviceType,
      date: service.date,
      startTime: service.startTime,
      endTime: service.endTime,
      hoursWorked: assignment.hoursWorked,
      hourlyRate: assignment.hourlyRate ?? 0,
      extraAmount: assignment.extraAmount ?? 0,
      deductions: assignment.deductions ?? 0,
      totalPay: 0,
      confirmed: assignment.confirmed,
      reviewNote: assignment.reviewNote,
      incidentNote: assignment.incidentNote,
      excludeReason: assignment.excludeReason,
      excludedFromPayroll: assignment.excludedFromPayroll ?? false,
      reviewedAt: assignment.reviewedAt,
      reviewedBy: assignment.reviewedBy,
      hourStatusOverride: assignment.hourStatusOverride,
      serviceStatus: service.status,
      hourStatus: 'excluded',
      payrollMonth: service.date.slice(0, 7),
      isLocked: payrollState?.status === 'locked',
      warnings: [],
    },
    payrollState,
  )
  if (!policy.allowed) {
    return { success: false, error: policy.reason }
  }

  const result = repositories.services.updateService(service.id, {
    assignments: buildAssignmentsPatch(service.assignments, assignment.id, {
      excludedFromPayroll: false,
      excludeReason: undefined,
      hourStatusOverride:
        service.status === 'completed' || service.status === 'reviewed' || service.status === 'closed'
          ? 'pending_review'
          : undefined,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'local_manager',
    }),
  })

  if (!result.service) {
    return { success: false, error: result.error ?? 'No se pudo restaurar la entrada.' }
  }

  recordAuditEvent({
    action: 'hour.restored',
    entityType: 'hour-entry',
    entityId: entryId,
    message: `Se restauro la asignacion ${assignment.id} para revision de payroll.`,
    metadata: {
      serviceId: service.id,
      assignmentId: assignment.id,
      workerId: assignment.workerId,
    },
  })

  return { success: true, error: null }
}
