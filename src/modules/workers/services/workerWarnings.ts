import type { ServiceJob } from '../../../domain/services/service.types'
import type { WarningItem } from '../../../domain/shared/warning.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { getMonthKey, isPayrollEligibleService } from '../../../utils/dates'
import { formatMonthLabel } from '../../../utils/dates'
import { getWorkerServicesByMonth } from './workerCalculations'

export function getWorkerWarnings(worker: Worker) {
  const warnings: WarningItem[] = []

  if (worker.status === 'active' && (worker.defaultHourlyRate ?? 0) <= 0) {
    warnings.push({
      level: 'danger',
      title: 'Tarifa horaria pendiente',
      message: `${worker.name} está activo pero no tiene tarifa horaria base.`,
      entityLabel: worker.name,
    })
  }

  if (worker.status === 'active' && !worker.phone && !worker.email) {
    warnings.push({
      level: 'warning',
      title: 'Contacto incompleto',
      message: `${worker.name} no tiene teléfono ni correo operativo.`,
      entityLabel: worker.name,
    })
  }

  return warnings
}

export function getWorkerOperationalWarnings(worker: Worker, services: ServiceJob[]) {
  const warnings = [...getWorkerWarnings(worker)]
  const currentMonth = getMonthKey(new Date().toISOString())
  const currentMonthLabel = formatMonthLabel(currentMonth)
  const workerServices = services.filter((service) =>
    service.assignments.some((assignment) => assignment.workerId === worker.id),
  )

  workerServices.forEach((service) => {
    service.assignments
      .filter((assignment) => assignment.workerId === worker.id)
      .forEach((assignment) => {
        if ((assignment.hourlyRate ?? 0) <= 0) {
          warnings.push({
            level: 'warning',
            title: 'Asignación sin tarifa',
            message: `${worker.name} tiene una asignación sin tarifa en un servicio de ${service.date}.`,
            entityLabel: worker.name,
          })
        }

        if (isPayrollEligibleService(service.status) && !assignment.confirmed) {
          warnings.push({
            level: 'warning',
            title: 'Asignación sin confirmar',
            message: `${worker.name} tiene horas pendientes de confirmar en un servicio ya cerrado operativamente.`,
            entityLabel: worker.name,
          })
        }
      })
  })

  if (worker.status !== 'active' && workerServices.length > 0) {
    warnings.push({
      level: 'warning',
      title: 'Trabajador inactivo con servicios',
      message: `${worker.name} sigue asignado a servicios pese a estar inactivo.`,
      entityLabel: worker.name,
    })
  }

  if (getWorkerServicesByMonth(worker.id, services, currentMonth).length === 0) {
    warnings.push({
      level: 'info',
      title: 'Sin servicios este mes',
      message: `${worker.name} no tiene servicios registrados en ${currentMonthLabel}.`,
      entityLabel: worker.name,
    })
  }

  return warnings
}

export function getWorkersWithWarnings(workers: Worker[], services: ServiceJob[]) {
  return workers.filter((worker) => getWorkerOperationalWarnings(worker, services).length > 0)
}
