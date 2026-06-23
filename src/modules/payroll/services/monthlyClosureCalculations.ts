import type { HourEntry } from '../../../domain/hours/hourEntry.types'
import type { AppSettings } from '../../../domain/settings/appSettings.types'

function hasValidPayableNumbers(entry: HourEntry, settings: AppSettings) {
  return (
    entry.hoursWorked > 0 &&
    (!settings.hoursSettings.requireRateForPayroll || entry.hourlyRate > 0)
  )
}

export function isEntryPending(entry: HourEntry) {
  return entry.hourStatus === 'pending_review'
}

export function isEntryIssue(entry: HourEntry) {
  return entry.hourStatus === 'issue'
}

export function isEntryExcluded(entry: HourEntry) {
  return entry.hourStatus === 'excluded'
}

export function isEntryLocked(entry: HourEntry) {
  return entry.hourStatus === 'locked' || entry.isLocked
}

export function isEntryConfirmed(entry: HourEntry, settings: AppSettings) {
  if (isEntryExcluded(entry)) {
    return false
  }

  if (entry.hourStatus === 'confirmed' || entry.hourStatus === 'paid' || entry.hourStatus === 'locked') {
    return hasValidPayableNumbers(entry, settings)
  }

  if (
    entry.hourStatus === 'issue' &&
    settings.hourReviewSettings.allowIncidentEntriesInPayroll &&
    entry.confirmed
  ) {
    return hasValidPayableNumbers(entry, settings)
  }

  return false
}

export function getConfirmedHours(entries: HourEntry[], settings: AppSettings) {
  return entries
    .filter((entry) => isEntryConfirmed(entry, settings))
    .reduce((sum, entry) => sum + entry.hoursWorked, 0)
}

export function getPendingHours(entries: HourEntry[]) {
  return entries
    .filter(isEntryPending)
    .reduce((sum, entry) => sum + entry.hoursWorked, 0)
}

export function getExcludedHours(entries: HourEntry[]) {
  return entries
    .filter(isEntryExcluded)
    .reduce((sum, entry) => sum + entry.hoursWorked, 0)
}

export function getIssueCount(entries: HourEntry[]) {
  return entries.filter(isEntryIssue).length
}

export function getPayableTotal(entries: HourEntry[], settings: AppSettings) {
  return entries
    .filter((entry) => isEntryConfirmed(entry, settings))
    .reduce((sum, entry) => sum + entry.totalPay, 0)
}

export function getAverageRate(entries: HourEntry[], settings: AppSettings) {
  const confirmedHours = getConfirmedHours(entries, settings)
  if (confirmedHours <= 0) {
    return 0
  }

  return getPayableTotal(entries, settings) / confirmedHours
}

export function getUniqueServiceCount(entries: HourEntry[]) {
  return new Set(entries.map((entry) => entry.serviceId)).size
}
