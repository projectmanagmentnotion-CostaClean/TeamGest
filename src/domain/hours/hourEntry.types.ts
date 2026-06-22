import type { ServiceStatus } from '../shared/status.types'

export type HourEntryStatus =
  | 'draft'
  | 'pending_review'
  | 'confirmed'
  | 'issue'
  | 'excluded'
  | 'paid'
  | 'locked'

export type HourEntry = {
  id: string
  serviceId: string
  assignmentId: string
  workerId: string
  workerName: string
  propertyId: string
  propertyName: string
  clientId: string
  clientName: string
  serviceType: string
  date: string
  startTime?: string
  endTime?: string
  hoursWorked: number
  hourlyRate: number
  extraAmount: number
  deductions: number
  totalPay: number
  confirmed: boolean
  serviceStatus: ServiceStatus
  hourStatus: HourEntryStatus
  payrollMonth: string
  isLocked: boolean
  warnings: string[]
}

export type HourEntryFilters = {
  month: string
  workerId: string
  propertyId: string
  clientId: string
  status: HourEntryStatus | 'all'
  confirmation: 'all' | 'confirmed' | 'pending'
}

export type HourEntrySummary = {
  totalEntries: number
  totalHours: number
  totalPay: number
  pendingReviewCount: number
  confirmedCount: number
  issueCount: number
  lockedCount: number
}

export type HourReviewAction = 'confirm'
