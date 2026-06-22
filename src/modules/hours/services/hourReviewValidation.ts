export type HourCorrectionPatch = {
  startTime?: string
  endTime?: string
  hoursWorked: number
  hourlyRate: number
  extraAmount?: number
  deductions?: number
  reviewNote?: string
}

export function validateHourCorrectionPatch(patch: HourCorrectionPatch) {
  const errors: string[] = []

  if (patch.hoursWorked <= 0) {
    errors.push('Las horas deben ser mayores que cero.')
  }

  if (patch.hourlyRate <= 0) {
    errors.push('La tarifa horaria debe ser mayor que cero.')
  }

  if (patch.startTime && patch.endTime && patch.endTime <= patch.startTime) {
    errors.push('La hora de fin debe ser posterior a la hora de inicio.')
  }

  if ((patch.extraAmount ?? 0) < 0) {
    errors.push('El extra no puede ser negativo.')
  }

  if ((patch.deductions ?? 0) < 0) {
    errors.push('La deduccion no puede ser negativa.')
  }

  return errors
}

export function validateIncidentNote(note: string) {
  return note.trim().length > 0 ? [] : ['La nota de incidencia es obligatoria.']
}

export function validateExcludeReason(reason: string) {
  return reason.trim().length > 0 ? [] : ['El motivo de exclusion es obligatorio.']
}
