import type { QuickEntryDraft } from './quickEntryDraft'
import { getAppSettings } from '../../settings/services/appSettingsService'

export function getQuickEntryEffectiveRate(draft: QuickEntryDraft, workerDefaultRate?: number) {
  return draft.hourlyRate ?? workerDefaultRate ?? 0
}

export function getQuickEntryTotalPay(draft: QuickEntryDraft, workerDefaultRate?: number) {
  const hourlyRate = getQuickEntryEffectiveRate(draft, workerDefaultRate)
  return hourlyRate * draft.hoursWorked + (draft.extraAmount ?? 0) - (draft.deductions ?? 0)
}

export function validateQuickEntryDraft(draft: QuickEntryDraft, workerDefaultRate?: number) {
  const settings = getAppSettings()
  const errors: string[] = []

  if (!draft.workerId || !draft.propertyId) {
    errors.push('Debes seleccionar trabajador e inmueble.')
  }

  if (!draft.date || draft.hoursWorked < settings.hoursSettings.minimumHoursPerEntry) {
    errors.push('La fecha y las horas trabajadas son obligatorias.')
  }

  if (draft.startTime && draft.endTime && draft.endTime <= draft.startTime) {
    errors.push('La hora de fin debe ser posterior a la hora de inicio.')
  }

  if (
    settings.hoursSettings.requireRateForPayroll &&
    getQuickEntryEffectiveRate(draft, workerDefaultRate) <= 0
  ) {
    errors.push('La tarifa por hora debe ser mayor que cero para confirmar la nomina interna.')
  }

  return errors
}
