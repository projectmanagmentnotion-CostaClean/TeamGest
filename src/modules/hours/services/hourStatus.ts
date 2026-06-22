import type { HourEntry, HourEntryStatus } from '../../../domain/hours/hourEntry.types'
import type { PayrollMonthState } from '../../../domain/payroll/payroll.types'
import type { BadgeTone } from '../../../components/ui/Badge'

type HourStatusSource = Pick<
  HourEntry,
  'confirmed' | 'serviceStatus' | 'workerId' | 'hoursWorked' | 'hourlyRate'
>

export function deriveHourStatus(entry: HourStatusSource, payrollState?: PayrollMonthState): HourEntryStatus {
  if (payrollState?.status === 'locked') {
    return 'locked'
  }

  if (entry.serviceStatus === 'cancelled') {
    return 'excluded'
  }

  if (!entry.workerId || entry.hoursWorked <= 0 || entry.hourlyRate <= 0) {
    return 'issue'
  }

  if (payrollState?.workerStatuses[entry.workerId] === 'paid' || payrollState?.status === 'paid') {
    return 'paid'
  }

  if (
    (entry.serviceStatus === 'completed' || entry.serviceStatus === 'reviewed' || entry.serviceStatus === 'closed') &&
    entry.confirmed
  ) {
    return 'confirmed'
  }

  if (
    (entry.serviceStatus === 'completed' || entry.serviceStatus === 'reviewed' || entry.serviceStatus === 'closed') &&
    !entry.confirmed
  ) {
    return 'pending_review'
  }

  return entry.confirmed ? 'confirmed' : 'draft'
}

export function getHourStatusLabel(status: HourEntryStatus) {
  const labels: Record<HourEntryStatus, string> = {
    draft: 'Borrador',
    pending_review: 'Pendiente de revisar',
    confirmed: 'Confirmada',
    issue: 'Incidencia',
    excluded: 'Excluida',
    paid: 'Pagada',
    locked: 'Bloqueada',
  }

  return labels[status]
}

export function getHourStatusTone(status: HourEntryStatus): BadgeTone {
  if (status === 'confirmed' || status === 'paid') {
    return 'success'
  }

  if (status === 'pending_review') {
    return 'warning'
  }

  if (status === 'issue') {
    return 'danger'
  }

  if (status === 'locked') {
    return 'blocked'
  }

  if (status === 'excluded') {
    return 'neutral'
  }

  return 'info'
}

export function isHourEntryLocked(entry: Pick<HourEntry, 'hourStatus' | 'isLocked'>) {
  return entry.isLocked || entry.hourStatus === 'locked'
}

export function isHourEntryPayable(entry: Pick<HourEntry, 'hourStatus'>) {
  return entry.hourStatus === 'confirmed' || entry.hourStatus === 'paid' || entry.hourStatus === 'locked'
}
