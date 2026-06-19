import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { WarningItem } from '../../../domain/shared/warning.types'
import type { Worker } from '../../../domain/workers/worker.types'
import type { NewServiceDraft } from './newServiceDraft'

function createWarning(level: WarningItem['level'], title: string, message: string): WarningItem {
  return { level, title, message }
}

export function validateClientStep(draft: NewServiceDraft, clients: Client[]) {
  const warnings: WarningItem[] = []
  const client = clients.find((item) => item.id === draft.clientId)

  if (!draft.clientId || !client) {
    warnings.push(createWarning('warning', 'Cliente pendiente', 'Selecciona un cliente para continuar.'))
  } else if (client.status !== 'active') {
    warnings.push(createWarning('warning', 'Cliente inactivo', 'El cliente seleccionado no está activo.'))
  }

  return warnings
}

export function validatePropertyStep(draft: NewServiceDraft, properties: Property[]) {
  const warnings: WarningItem[] = []
  const property = properties.find((item) => item.id === draft.propertyId)

  if (!draft.propertyId || !property) {
    warnings.push(createWarning('warning', 'Inmueble pendiente', 'Selecciona un inmueble válido para continuar.'))
  } else if (draft.clientId && property.clientId !== draft.clientId) {
    warnings.push(createWarning('danger', 'Inmueble fuera del cliente', 'El inmueble seleccionado no pertenece al cliente actual.'))
  } else if (property.status !== 'active') {
    warnings.push(createWarning('warning', 'Inmueble inactivo', 'El inmueble seleccionado no está activo.'))
  }

  return warnings
}

export function validateServiceTypeStep(draft: NewServiceDraft) {
  return draft.serviceType
    ? []
    : [createWarning('warning', 'Tipo de servicio pendiente', 'Selecciona un tipo de servicio para continuar.')]
}

export function validateScheduleStep(draft: NewServiceDraft) {
  const warnings: WarningItem[] = []

  if (!draft.date) {
    warnings.push(createWarning('warning', 'Fecha pendiente', 'La fecha del servicio es obligatoria.'))
  }

  if (draft.startTime && draft.endTime && draft.endTime <= draft.startTime) {
    warnings.push(createWarning('danger', 'Rango horario no válido', 'La hora de fin debe ser posterior a la de inicio.'))
  }

  return warnings
}

export function validateWorkersStep(draft: NewServiceDraft, workers: Worker[]) {
  const warnings: WarningItem[] = []

  if (draft.workerIds.length === 0) {
    warnings.push(createWarning('warning', 'Trabajadores pendientes', 'Selecciona al menos un trabajador.'))
  }

  draft.workerIds.forEach((workerId) => {
    const worker = workers.find((item) => item.id === workerId)
    if (!worker) {
      warnings.push(createWarning('danger', 'Trabajador no válido', 'Una de las selecciones de trabajador ya no es válida.'))
    } else if ((worker.defaultHourlyRate ?? 0) <= 0) {
      warnings.push(createWarning('warning', 'Tarifa base pendiente', `${worker.name} no tiene tarifa horaria por defecto.`))
    }
  })

  return warnings
}

export function validateAssignmentsStep(draft: NewServiceDraft) {
  const warnings: WarningItem[] = []

  if (draft.assignments.length === 0) {
    warnings.push(createWarning('warning', 'Asignaciones pendientes', 'Configura al menos una asignación válida.'))
  }

  draft.assignments.forEach((assignment) => {
    if (assignment.hoursWorked <= 0) {
      warnings.push(createWarning('warning', 'Horas no válidas', 'Cada asignación debe tener horas mayores que cero.'))
    }

    if ((assignment.hourlyRate ?? 0) <= 0) {
      warnings.push(createWarning('warning', 'Tarifa pendiente', 'Cada asignación debe tener una tarifa horaria válida.'))
    }
  })

  return warnings
}

export function validateReviewStep(
  draft: NewServiceDraft,
  clients: Client[],
  properties: Property[],
  workers: Worker[],
) {
  return [
    ...validateClientStep(draft, clients),
    ...validatePropertyStep(draft, properties),
    ...validateServiceTypeStep(draft),
    ...validateScheduleStep(draft),
    ...validateWorkersStep(draft, workers),
    ...validateAssignmentsStep(draft),
  ]
}

export function getNewServiceStepWarnings(
  step: number,
  draft: NewServiceDraft,
  clients: Client[],
  properties: Property[],
  workers: Worker[],
) {
  if (step === 0) return validateClientStep(draft, clients)
  if (step === 1) return validatePropertyStep(draft, properties)
  if (step === 2) return validateServiceTypeStep(draft)
  if (step === 3) return validateScheduleStep(draft)
  if (step === 4) return validateWorkersStep(draft, workers)
  if (step === 5) return validateAssignmentsStep(draft)
  return validateReviewStep(draft, clients, properties, workers)
}
