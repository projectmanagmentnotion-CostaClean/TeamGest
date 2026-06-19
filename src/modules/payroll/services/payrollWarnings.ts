import type { ServiceJob } from '../../../domain/services/service.types'
import type { WarningItem } from '../../../domain/shared/warning.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { isPayrollEligibleService, isSameMonthKey } from '../../../utils/dates'

export function getPayrollWarnings(workers: Worker[], services: ServiceJob[], month: string) {
  const warnings: WarningItem[] = []

  workers.forEach((worker) => {
    const relevantAssignments = services.flatMap((service) => {
      if (!isPayrollEligibleService(service.status) || !isSameMonthKey(service.date, month)) {
        return []
      }

      return service.assignments.filter((assignment) => assignment.workerId === worker.id)
    })

    if (worker.status === 'active' && relevantAssignments.some((assignment) => (assignment.hourlyRate ?? 0) <= 0)) {
      warnings.push({
        level: 'danger',
        title: 'Trabajador activo sin tarifa de payroll',
        message: `${worker.name} tiene asignaciones confirmables sin tarifa horaria válida.`,
        entityLabel: worker.name,
      })
    }

    if (relevantAssignments.some((assignment) => !assignment.confirmed)) {
      warnings.push({
        level: 'warning',
        title: 'Asignaciones pendientes de confirmar',
        message: `${worker.name} tiene servicios del mes todavía sin confirmar.`,
        entityLabel: worker.name,
      })
    }

    if (worker.status !== 'active' && relevantAssignments.length > 0) {
      warnings.push({
        level: 'warning',
        title: 'Trabajador inactivo con impacto en nómina',
        message: `${worker.name} aparece en servicios del mes pese a estar inactivo.`,
        entityLabel: worker.name,
      })
    }
  })

  return warnings
}
