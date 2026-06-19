import type { ServiceStatus } from '../domain/shared/status.types'

const spanishDateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const spanishMonthFormatter = new Intl.DateTimeFormat('es-ES', {
  month: 'long',
  year: 'numeric',
})

export function getMonthKey(dateValue: string) {
  const date = new Date(dateValue)
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
  return `${date.getUTCFullYear()}-${month}`
}

export function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number)
  return spanishMonthFormatter.format(new Date(Date.UTC(year, month - 1, 1)))
}

export function formatDate(dateValue: string) {
  return spanishDateFormatter.format(new Date(dateValue))
}

export function isSameMonthKey(dateValue: string, monthKey: string) {
  return getMonthKey(dateValue) === monthKey
}

export function isSameDay(left: string, right: string) {
  return new Date(left).toISOString().slice(0, 10) === new Date(right).toISOString().slice(0, 10)
}

export function isPayrollEligibleService(status: ServiceStatus) {
  return status === 'completed' || status === 'reviewed' || status === 'closed'
}
