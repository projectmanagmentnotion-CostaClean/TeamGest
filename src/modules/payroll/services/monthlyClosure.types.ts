import type { HourEntry } from '../../../domain/hours/hourEntry.types'
import type { PayrollMonthState } from '../../../domain/payroll/payroll.types'
import type { PayrollStatus } from '../../../domain/shared/status.types'
import type { WorkerRole } from '../../../domain/workers/worker.types'
import type { EntityStatus } from '../../../domain/shared/entity.types'

export type WorkerClosureActionAvailability = {
  canMarkReviewed: boolean
  canMarkPaid: boolean
  canRevertPaid: boolean
  reason?: string
}

export type WorkerClosureCardModel = {
  workerId: string
  workerName: string
  workerRole: WorkerRole
  workerStatus: EntityStatus
  payrollStatus: PayrollStatus
  confirmedHours: number
  pendingHours: number
  issueCount: number
  excludedHours: number
  totalPay: number
  averageRate: number
  serviceCount: number
  entryCount: number
  reviewed: boolean
  paid: boolean
  locked: boolean
  readyToPay: boolean
  warnings: string[]
  statusLabel: string
  actionAvailability: WorkerClosureActionAvailability
}

export type MonthlyClosureSummary = {
  month: string
  workerCount: number
  readyWorkerCount: number
  pendingWorkerCount: number
  issueWorkerCount: number
  confirmedHours: number
  pendingHours: number
  excludedHours: number
  totalPay: number
  isLocked: boolean
  warnings: string[]
}

export type WorkerMonthlyClosureDetail = {
  card: WorkerClosureCardModel
  monthState: PayrollMonthState
  confirmedEntries: HourEntry[]
  pendingEntries: HourEntry[]
  issueEntries: HourEntry[]
  excludedEntries: HourEntry[]
  lockedEntries: HourEntry[]
}
