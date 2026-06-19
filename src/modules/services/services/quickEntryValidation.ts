import type { QuickEntryDraft } from './quickEntryDraft'

export function validateQuickEntryDraft(draft: QuickEntryDraft) {
  const errors: string[] = []

  if (!draft.workerId || !draft.propertyId) {
    errors.push('Debes seleccionar trabajador e inmueble.')
  }

  if (!draft.date || draft.hoursWorked <= 0) {
    errors.push('La fecha y las horas registradas son obligatorias.')
  }

  return errors
}
