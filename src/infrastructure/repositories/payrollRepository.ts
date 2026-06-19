import type {
  PayrollAuditEntry,
  PayrollLockedSnapshot,
  PayrollMonthState,
} from '../../domain/payroll/payroll.types'
import type { PayrollStatus } from '../../domain/shared/status.types'
import { recordAuditEvent } from '../audit/auditRepository'
import { readJson, writeJson } from '../storage/localStorageAdapter'
import {
  createInitialPayrollMonthState,
  lockMonthState,
  updateMonthStatus,
  updateWorkerStatus,
} from '../../modules/payroll/services/payrollStorage'
import { calculatePayrollMonthSummary } from '../../modules/payroll/services/payrollCalculations'
import { PAYROLL_AUDIT_KEY, PAYROLL_MONTHS_KEY } from '../storage/storageKeys'

type PayrollDependencies = {
  listWorkers: () => ReturnType<ReturnType<typeof import('./workerRepository').createWorkerRepository>['listWorkers']>
  listServices: () => ReturnType<ReturnType<typeof import('./serviceRepository').createServiceRepository>['listServices']>
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
      const nextState = updateWorkerStatus(states[month], month, workerId, status)
      states[month] = nextState
      writeMonthStates(states)
      recordAuditEvent({
        action: 'payroll.status_updated',
        entityType: 'payroll-worker',
        entityId: `${month}:${workerId}`,
        message: `El trabajador ${workerId} quedó marcado como ${status} en ${month}.`,
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
        message: `El cierre de ${month} se actualizó a ${status}.`,
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
