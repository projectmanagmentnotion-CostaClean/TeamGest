import type {
  PayrollAuditEntry,
  PayrollLockedSnapshot,
  PayrollMonthState,
} from '../../../domain/payroll/payroll.types'
import type { PayrollStatus } from '../../../domain/shared/status.types'
import { createEntityId } from '../../../utils/ids'

export function createInitialPayrollMonthState(month: string): PayrollMonthState {
  return {
    month,
    status: 'pending',
    workerStatuses: {},
    updatedAt: new Date().toISOString(),
  }
}

export function updateMonthStatus(
  state: PayrollMonthState | undefined,
  month: string,
  status: PayrollStatus,
) {
  const base = state ?? createInitialPayrollMonthState(month)
  return {
    ...base,
    month,
    status,
    updatedAt: new Date().toISOString(),
  }
}

export function updateWorkerStatus(
  state: PayrollMonthState | undefined,
  month: string,
  workerId: string,
  status: PayrollStatus,
) {
  const base = state ?? createInitialPayrollMonthState(month)
  return {
    ...base,
    month,
    workerStatuses: {
      ...base.workerStatuses,
      [workerId]: status,
    },
    updatedAt: new Date().toISOString(),
  }
}

export function lockMonthState(
  state: PayrollMonthState | undefined,
  month: string,
  snapshot: PayrollLockedSnapshot,
) {
  const lockedAt = new Date().toISOString()
  return {
    ...(state ?? createInitialPayrollMonthState(month)),
    month,
    status: 'locked' as const,
    lockedAt,
    lockedSnapshot: snapshot,
    updatedAt: lockedAt,
  }
}

export function createPayrollAuditEntry(
  month: string,
  action: string,
  message: string,
  metadata?: Record<string, string>,
): PayrollAuditEntry {
  return {
    id: createEntityId('payroll-audit'),
    month,
    action,
    message,
    createdAt: new Date().toISOString(),
    metadata,
  }
}
