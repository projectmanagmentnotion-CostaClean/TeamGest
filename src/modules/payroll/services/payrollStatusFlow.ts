import type { PayrollStatus } from '../../../domain/shared/status.types'

export const PAYROLL_STATUS_FLOW: PayrollStatus[] = ['pending', 'reviewed', 'paid', 'locked']

const payrollStatusLabels: Record<PayrollStatus, string> = {
  pending: 'Pendiente',
  reviewed: 'Revisado',
  paid: 'Pagado',
  locked: 'Bloqueado',
}

export function getPayrollStatusLabel(status: PayrollStatus) {
  return payrollStatusLabels[status]
}

export function isPayrollEditable(status: PayrollStatus) {
  return status === 'pending' || status === 'reviewed'
}

export function isPayrollLocked(status: PayrollStatus) {
  return status === 'locked'
}

export function canMarkReviewed(status: PayrollStatus) {
  return status === 'pending'
}

export function canMarkPaid(status: PayrollStatus) {
  return status === 'reviewed' || status === 'pending'
}

export function canLockPayroll(status: PayrollStatus) {
  return status === 'paid'
}

export function getNextPayrollStatuses(status: PayrollStatus) {
  if (status === 'pending') {
    return ['reviewed', 'paid'] as PayrollStatus[]
  }

  if (status === 'reviewed') {
    return ['paid'] as PayrollStatus[]
  }

  if (status === 'paid') {
    return ['locked'] as PayrollStatus[]
  }

  return [] as PayrollStatus[]
}
