import type { AppSettings } from '../../../domain/settings/appSettings.types'
import type { PayrollStatus } from '../../../domain/shared/status.types'
import type { WorkerClosureActionAvailability, WorkerClosureCardModel } from './monthlyClosure.types'

type StatusSource = {
  confirmedHours: number
  excludedHours: number
  issueCount: number
  locked: boolean
  paid: boolean
  pendingHours: number
  readyToPay: boolean
  reviewed: boolean
}

export function buildWorkerClosureWarnings(
  model: Omit<WorkerClosureCardModel, 'warnings' | 'statusLabel' | 'actionAvailability'>,
  settings: AppSettings,
) {
  const warnings: string[] = []

  if (model.locked) {
    warnings.push('El mes esta bloqueado. No se permiten cambios sobre el cierre ni sobre las horas asociadas.')
  }

  if (model.pendingHours > 0) {
    warnings.push('Hay horas pendientes de revisar antes de dar este trabajador por listo para pago.')
  }

  if (model.issueCount > 0) {
    warnings.push('Existen incidencias activas que requieren revision antes del cierre.')
  }

  if (model.excludedHours > 0) {
    warnings.push('Hay horas excluidas del cierre. Siguen visibles, pero no suman al pago interno.')
  }

  if (model.confirmedHours <= 0) {
    warnings.push('No hay horas confirmadas pagables para este trabajador en el mes seleccionado.')
  }

  if (
    settings.hourReviewSettings.requireReviewBeforePayrollClose &&
    model.pendingHours > 0
  ) {
    warnings.push('Ajustes exige resolver revision de horas antes de considerar este pago listo.')
  }

  return warnings
}

export function getWorkerClosureStatusLabel(source: StatusSource) {
  if (source.locked) {
    return 'Bloqueado'
  }

  if (source.paid) {
    return 'Pagado'
  }

  if (source.issueCount > 0) {
    return 'Con incidencias'
  }

  if (source.pendingHours > 0) {
    return 'Pendiente'
  }

  if (source.reviewed && source.readyToPay) {
    return 'Revisado'
  }

  if (source.readyToPay) {
    return 'Listo para pagar'
  }

  if (source.confirmedHours > 0 || source.excludedHours > 0) {
    return 'Pendiente'
  }

  return 'Sin actividad pagable'
}

export function getActionAvailability(source: {
  locked: boolean
  paid: boolean
  payrollStatus: PayrollStatus
  readyToPay: boolean
}): WorkerClosureActionAvailability {
  if (source.locked) {
    return {
      canMarkReviewed: false,
      canMarkPaid: false,
      canRevertPaid: false,
      reason: 'El mes esta bloqueado.',
    }
  }

  if (!source.readyToPay) {
    return {
      canMarkReviewed: false,
      canMarkPaid: false,
      canRevertPaid: source.paid,
      reason: 'Debe resolver pendientes o incidencias antes de marcar este pago.',
    }
  }

  return {
    canMarkReviewed: !source.paid && source.payrollStatus === 'pending',
    canMarkPaid: !source.paid,
    canRevertPaid: source.paid,
  }
}

export function getSummaryWarnings(source: {
  isLocked: boolean
  issueWorkerCount: number
  pendingWorkerCount: number
  readyWorkerCount: number
}) {
  const warnings: string[] = []

  if (source.isLocked) {
    warnings.push('El cierre mensual esta bloqueado. La vista es informativa y de trazabilidad.')
  }

  if (source.issueWorkerCount > 0) {
    warnings.push('Hay trabajadores con incidencias activas que deben revisarse antes del pago interno.')
  }

  if (source.pendingWorkerCount > 0) {
    warnings.push('Siguen existiendo trabajadores con horas pendientes de revisar.')
  }

  if (source.readyWorkerCount === 0 && !source.isLocked) {
    warnings.push('Todavia no hay trabajadores listos para pago en este mes.')
  }

  return warnings
}
