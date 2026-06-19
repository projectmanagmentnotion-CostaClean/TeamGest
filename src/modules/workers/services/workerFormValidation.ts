import type { WorkerInput } from '../../../domain/workers/worker.inputs'

export function validateWorkerForm(draft: WorkerInput) {
  const errors: string[] = []

  if (!draft.name.trim()) {
    errors.push('El nombre del trabajador es obligatorio.')
  }

  if (draft.defaultHourlyRate !== undefined && draft.defaultHourlyRate < 0) {
    errors.push('La tarifa horaria no puede ser negativa.')
  }

  return errors
}
