import type { ServiceJob } from '../../../domain/services/service.types'
import type { WarningItem } from '../../../domain/shared/warning.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { formatMonthLabel, isPayrollEligibleService, isSameMonthKey } from '../../../utils/dates'

export function getPayrollServiceWarnings(service: ServiceJob, workers: Worker[]) {
  const warnings: WarningItem[] = []

  if (isPayrollEligibleService(service.status) && service.assignments.length === 0) {
    warnings.push({
      level: 'blocked',
      title: 'Servicio pagable sin asignaciones',
      message: `El servicio ${service.id} no tiene asignaciones, pero entra en payroll.`,
      entityLabel: service.id,
    })
  }

  service.assignments.forEach((assignment) => {
    const worker = workers.find((item) => item.id === assignment.workerId)

    if (!worker) {
      warnings.push({
        level: 'danger',
        title: 'Asignación sin trabajador',
        message: `Existe una asignación sin trabajador válido en ${service.id}.`,
        entityLabel: service.id,
      })
    }

    if ((assignment.hourlyRate ?? 0) <= 0) {
      warnings.push({
        level: 'warning',
        title: 'Asignación sin tarifa horaria',
        message: `${worker?.name ?? 'Una asignación'} no tiene tarifa horaria válida.`,
        entityLabel: worker?.name ?? service.id,
      })
    }

    if (assignment.hoursWorked <= 0) {
      warnings.push({
        level: 'warning',
        title: 'Asignación con horas no válidas',
        message: `${worker?.name ?? 'Una asignación'} tiene horas iguales o menores que cero.`,
        entityLabel: worker?.name ?? service.id,
      })
    }
  })

  if (
    isPayrollEligibleService(service.status) &&
    service.assignments.some((assignment) => !assignment.confirmed)
  ) {
    warnings.push({
      level: 'warning',
      title: 'Servicio pagable con asignaciones pendientes',
      message: `${service.id} tiene asignaciones no confirmadas pese a estar en estado pagable.`,
      entityLabel: service.id,
    })
  }

  return warnings
}

export function getPayrollWorkerWarnings(
  worker: Worker,
  services: ServiceJob[],
  month: string,
) {
  const warnings: WarningItem[] = []
  const payableServices = services.filter(
    (service) => isPayrollEligibleService(service.status) && isSameMonthKey(service.date, month),
  )
  const assignments = payableServices.flatMap((service) =>
    service.assignments.filter((assignment) => assignment.workerId === worker.id),
  )

  if (worker.status === 'active' && assignments.some((assignment) => (assignment.hourlyRate ?? 0) <= 0)) {
    warnings.push({
      level: 'danger',
      title: 'Trabajador activo sin tarifa en payroll',
      message: `${worker.name} tiene asignaciones del mes sin tarifa horaria válida.`,
      entityLabel: worker.name,
    })
  }

  if (assignments.some((assignment) => !assignment.confirmed)) {
    warnings.push({
      level: 'warning',
      title: 'Asignaciones sin confirmar',
      message: `${worker.name} tiene asignaciones no confirmadas en servicios pagables.`,
      entityLabel: worker.name,
    })
  }

  if (worker.status !== 'active' && assignments.length > 0) {
    warnings.push({
      level: 'warning',
      title: 'Trabajador inactivo con impacto en nómina',
      message: `${worker.name} figura en payroll pese a no estar activo.`,
      entityLabel: worker.name,
    })
  }

  return warnings
}

export function getPayrollWarnings(workers: Worker[], services: ServiceJob[], month: string) {
  const warnings: WarningItem[] = []
  const monthLabel = formatMonthLabel(month)
  const payableServices = services.filter(
    (service) => isPayrollEligibleService(service.status) && isSameMonthKey(service.date, month),
  )

  workers.forEach((worker) => {
    warnings.push(...getPayrollWorkerWarnings(worker, services, month))
  })

  payableServices.forEach((service) => {
    warnings.push(...getPayrollServiceWarnings(service, workers))
  })

  if (payableServices.length === 0) {
    warnings.push({
      level: 'info',
      title: 'Sin servicios pagables',
      message: `No hay servicios completados, revisados o cerrados en ${monthLabel}.`,
      entityLabel: monthLabel,
    })
  }

  return warnings
}

export function getPayrollMonthBlockingWarnings(
  workers: Worker[],
  services: ServiceJob[],
  month: string,
) {
  return getPayrollWarnings(workers, services, month).filter(
    (warning) => warning.level === 'danger' || warning.level === 'blocked',
  )
}
