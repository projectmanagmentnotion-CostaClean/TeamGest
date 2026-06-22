import type { HourEntry, HourEntryFilters } from '../../../domain/hours/hourEntry.types'

export function filterByWorker(entries: HourEntry[], workerId: string) {
  return workerId ? entries.filter((entry) => entry.workerId === workerId) : entries
}

export function filterByProperty(entries: HourEntry[], propertyId: string) {
  return propertyId ? entries.filter((entry) => entry.propertyId === propertyId) : entries
}

export function filterByClient(entries: HourEntry[], clientId: string) {
  return clientId ? entries.filter((entry) => entry.clientId === clientId) : entries
}

export function filterByMonth(entries: HourEntry[], month: string) {
  return month ? entries.filter((entry) => entry.payrollMonth === month) : entries
}

export function filterByStatus(entries: HourEntry[], status: HourEntryFilters['status']) {
  return status === 'all' ? entries : entries.filter((entry) => entry.hourStatus === status)
}

export function filterByConfirmed(entries: HourEntry[], confirmation: HourEntryFilters['confirmation']) {
  if (confirmation === 'all') {
    return entries
  }

  return entries.filter((entry) => (confirmation === 'confirmed' ? entry.confirmed : !entry.confirmed))
}

export function filterHourEntries(entries: HourEntry[], filters: HourEntryFilters) {
  return filterByConfirmed(
    filterByStatus(
      filterByClient(
        filterByProperty(
          filterByWorker(filterByMonth(entries, filters.month), filters.workerId),
          filters.propertyId,
        ),
        filters.clientId,
      ),
      filters.status,
    ),
    filters.confirmation,
  )
}
