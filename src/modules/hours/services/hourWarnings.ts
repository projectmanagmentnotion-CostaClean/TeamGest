import type { HourEntry } from '../../../domain/hours/hourEntry.types'
import type { WarningItem } from '../../../domain/shared/warning.types'

export function getHourEntryWarnings(
  entry: Pick<
    HourEntry,
    'workerName' | 'propertyName' | 'serviceStatus' | 'confirmed' | 'hoursWorked' | 'hourlyRate'
  >,
) {
  const warnings: string[] = []

  if (!entry.workerName) {
    warnings.push('Trabajador no resuelto.')
  }

  if (!entry.propertyName) {
    warnings.push('Inmueble no resuelto.')
  }

  if (entry.hoursWorked <= 0) {
    warnings.push('Horas iguales o menores que cero.')
  }

  if (entry.hourlyRate <= 0) {
    warnings.push('Tarifa horaria no valida.')
  }

  if (
    (entry.serviceStatus === 'completed' || entry.serviceStatus === 'reviewed' || entry.serviceStatus === 'closed') &&
    !entry.confirmed
  ) {
    warnings.push('Servicio pagable con horas pendientes de confirmar.')
  }

  return warnings
}

export function getHoursModuleWarnings(entries: HourEntry[]): WarningItem[] {
  const moduleWarnings: WarningItem[] = []
  const pendingCount = entries.filter((entry) => entry.hourStatus === 'pending_review').length
  const issueCount = entries.filter((entry) => entry.hourStatus === 'issue').length
  const lockedCount = entries.filter((entry) => entry.hourStatus === 'locked').length

  if (pendingCount > 0) {
    moduleWarnings.push({
      level: 'warning',
      title: 'Horas pendientes de revisar',
      message: `Hay ${pendingCount} entradas listas para cierre pero todavia sin confirmar.`,
      entityLabel: 'Control de horas',
    })
  }

  if (issueCount > 0) {
    moduleWarnings.push({
      level: 'danger',
      title: 'Incidencias en horas',
      message: `Hay ${issueCount} entradas con horas, tarifa o relacion operativa no valida.`,
      entityLabel: 'Control de horas',
    })
  }

  if (lockedCount > 0) {
    moduleWarnings.push({
      level: 'info',
      title: 'Horas bloqueadas',
      message: `Hay ${lockedCount} entradas dentro de meses de cierre bloqueado.`,
      entityLabel: 'Control de horas',
    })
  }

  return moduleWarnings
}
