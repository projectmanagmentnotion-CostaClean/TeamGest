import type { PayrollStatus } from '../shared/status.types'

export type PayrollSummary = {
  month: string
  workerId: string
  totalServices: number
  totalHours: number
  totalExtras: number
  totalDeductions: number
  totalPay: number
  status: PayrollStatus
}

export type PayrollWorkerStatusMap = Record<string, PayrollStatus>

export type PayrollLockedSnapshot = {
  month: string
  totalPay: number
  totalHours: number
  totalServices: number
  workerRows: Array<{
    workerId: string
    totalPay: number
    totalHours: number
    totalServices: number
    status: PayrollStatus
  }>
  warningsCount: number
  createdAt: string
}

export type PayrollMonthState = {
  month: string
  status: PayrollStatus
  workerStatuses: PayrollWorkerStatusMap
  lockedAt?: string
  lockedSnapshot?: PayrollLockedSnapshot
  updatedAt: string
}

export type PayrollAuditEntry = {
  id: string
  month: string
  action: string
  message: string
  createdAt: string
  metadata?: Record<string, string>
}
