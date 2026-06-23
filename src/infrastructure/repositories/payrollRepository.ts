import type {
  PayrollAuditEntry,
  PayrollLockedSnapshot,
  PayrollMonthState,
} from '../../domain/payroll/payroll.types'
import type { PayrollStatus } from '../../domain/shared/status.types'
import { calculatePayrollMonthSummary } from '../../modules/payroll/services/payrollCalculations'
import {
  createInitialPayrollMonthState,
  lockMonthState,
  updateMonthStatus,
  updateWorkerStatus,
} from '../../modules/payroll/services/payrollStorage'
import { recordAuditEvent } from '../audit/auditRepository'
import { readJson, writeJson } from '../storage/localStorageAdapter'
import { PAYROLL_AUDIT_KEY, PAYROLL_MONTHS_KEY } from '../storage/storageKeys'

type PayrollDependencies = {
  listWorkers: () => ReturnType<
    ReturnType<typeof import('./workerRepository').createWorkerRepository>['listWorkers']
  >
  listServices: () => ReturnType<
    ReturnType<typeof import('./serviceRepository').createServiceRepository>['listServices']
  >
}

function readMonthStates() {
  return readJson<Record<string, PayrollMonthState>>(PAYROLL_MONTHS_KEY, {})
}

function writeMonthStates(states: Record<string, PayrollMonthState>) {
  writeJson(PAYROLL_MONTHS_KEY, states)
}

function readAuditTrail() {
  return readJson<Record<string, PayrollAuditEntry[]>>(PAYROLL_AUDIT_KEY, {})
}

function writeAuditTrail(trail: Record<string, PayrollAuditEntry[]>) {
  writeJson(PAYROLL_AUDIT_KEY, trail)
}

function getWorkerAuditAction(previousStatus: PayrollStatus | undefined, nextStatus: PayrollStatus) {
  if (nextStatus === 'reviewed' && previousStatus === 'paid') {
    return 'payroll.worker_payment_reverted'
  }

  if (nextStatus === 'reviewed') {
    return 'payroll.worker_reviewed'
  }

  if (nextStatus === 'paid') {
    return 'payroll.worker_paid'
  }

  return 'payroll.status_updated'
}

export function createPayrollRepository(deps: PayrollDependencies) {
  return {
    getPayrollSummaryByMonth: (month: string) => {
      const monthState = readMonthStates()[month]
      return calculatePayrollMonthSummary(
        deps.listWorkers(),
        deps.listServices(),
        month,
        monthState?.workerStatuses,
      )
    },
    getPayrollMonthState: (month: string) => {
      return readMonthStates()[month] ?? createInitialPayrollMonthState(month)
    },
    updatePayrollWorkerStatus: (month: string, workerId: string, status: PayrollStatus) => {
      const states = readMonthStates()
      const previousStatus = states[month]?.workerStatuses[workerId]
      const nextState = updateWorkerStatus(states[month], month, workerId, status)
      states[month] = nextState
      writeMonthStates(states)
      recordAuditEvent({
        action: getWorkerAuditAction(previousStatus, status),
        entityType: 'payroll-worker',
        entityId: `${month}:${workerId}`,
        message: `El trabajador ${workerId} quedo marcado como ${status} en ${month}.`,
        metadata: {
          month,
          workerId,
          status,
        },
      })
      return nextState
    },
    updatePayrollMonthStatus: (month: string, status: PayrollStatus) => {
      const states = readMonthStates()
      const nextState = updateMonthStatus(states[month], month, status)
      states[month] = nextState
      writeMonthStates(states)
      recordAuditEvent({
        action: 'payroll.status_updated',
        entityType: 'payroll-month',
        entityId: month,
        message: `El cierre de ${month} se actualizo a ${status}.`,
        metadata: {
          month,
          status,
        },
      })
      return nextState
    },
    lockPayrollMonth: (month: string, snapshot: PayrollLockedSnapshot) => {
      const states = readMonthStates()
      const nextState = lockMonthState(states[month], month, snapshot)
      states[month] = nextState
      writeMonthStates(states)
      recordAuditEvent({
        action: 'payroll.locked',
        entityType: 'payroll-month',
        entityId: month,
        message: `El cierre de ${month} fue bloqueado en almacenamiento local.`,
        metadata: {
          month,
          totalServices: String(snapshot.totalServices),
          totalPay: String(snapshot.totalPay),
        },
      })
      return nextState
    },
    getPayrollAuditTrail: (month: string) => {
      return readAuditTrail()[month] ?? []
    },
    addPayrollAuditEntry: (month: string, entry: PayrollAuditEntry) => {
      const trail = readAuditTrail()
      trail[month] = [entry, ...(trail[month] ?? [])]
      writeAuditTrail(trail)
      return trail[month]
    },
  }
}
