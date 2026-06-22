import type { HourEntry, HourEntrySummary } from '../../../domain/hours/hourEntry.types'
import { isSameMonthKey } from '../../../utils/dates'

export function calculateHourEntryPay(
  entry: Pick<HourEntry, 'hoursWorked' | 'hourlyRate' | 'extraAmount' | 'deductions'>,
) {
  return entry.hoursWorked * entry.hourlyRate + entry.extraAmount - entry.deductions
}

export function calculateHourEntrySummary(entries: HourEntry[]): HourEntrySummary {
  return {
    totalEntries: entries.length,
    totalHours: entries.reduce((sum, entry) => sum + entry.hoursWorked, 0),
    totalPay: entries.reduce((sum, entry) => sum + entry.totalPay, 0),
    pendingReviewCount: entries.filter((entry) => entry.hourStatus === 'pending_review').length,
    confirmedCount: entries.filter((entry) => ['confirmed', 'paid', 'locked'].includes(entry.hourStatus)).length,
    issueCount: entries.filter((entry) => entry.hourStatus === 'issue' || entry.warnings.length > 0).length,
    lockedCount: entries.filter((entry) => entry.hourStatus === 'locked').length,
  }
}

export function calculateWorkerHourSummary(workerId: string, entries: HourEntry[]) {
  return calculateHourEntrySummary(entries.filter((entry) => entry.workerId === workerId))
}

export function calculatePropertyHourSummary(propertyId: string, entries: HourEntry[]) {
  return calculateHourEntrySummary(entries.filter((entry) => entry.propertyId === propertyId))
}

export function calculateMonthHourSummary(entries: HourEntry[], month: string) {
  return calculateHourEntrySummary(entries.filter((entry) => isSameMonthKey(entry.date, month)))
}
