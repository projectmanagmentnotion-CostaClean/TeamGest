import type { ServiceInput } from '../../../domain/services/service.inputs'

export function validateServiceForm(draft: ServiceInput) {
  const errors: string[] = []

  if (!draft.clientId || !draft.propertyId) {
    errors.push('Cliente e inmueble son obligatorios.')
  }

  if (!draft.date) {
    errors.push('La fecha del servicio es obligatoria.')
  }

  if (draft.assignments.length === 0) {
    errors.push('Debes registrar al menos una asignacion.')
  }

  if (draft.assignments.some((assignment) => !assignment.workerId || assignment.hoursWorked <= 0)) {
    errors.push('Cada asignacion debe tener trabajador y horas mayores que cero.')
  }

  return errors
}
