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
