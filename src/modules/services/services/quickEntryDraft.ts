import type { Worker } from '../../../domain/workers/worker.types'
import { getAppSettings } from '../../settings/services/appSettingsService'

export type QuickEntryDraft = {
  workerId: string
  propertyId: string
  date: string
  startTime: string
  endTime: string
  hoursWorked: number
  hourlyRate?: number
  extraAmount?: number
  deductions?: number
  notes: string
  hoursManuallyEdited: boolean
}

export function createQuickEntryDraft(params?: Partial<QuickEntryDraft>): QuickEntryDraft {
  const settings = getAppSettings()

  return {
    workerId: params?.workerId ?? '',
    propertyId: params?.propertyId ?? '',
    date: params?.date ?? new Date().toISOString().slice(0, 10),
    startTime: params?.startTime ?? '',
    endTime: params?.endTime ?? '',
    hoursWorked: params?.hoursWorked ?? Math.max(settings.hoursSettings.minimumHoursPerEntry, 2),
    hourlyRate: params?.hourlyRate ?? settings.hoursSettings.defaultHourlyRate,
    extraAmount: params?.extraAmount,
    deductions: params?.deductions,
    notes: params?.notes ?? '',
    hoursManuallyEdited: params?.hoursManuallyEdited ?? false,
  }
}

export function resolveQuickEntryPrefill(searchParams: URLSearchParams) {
  const date = searchParams.get('date')

  return {
    workerId: searchParams.get('workerId') ?? '',
    propertyId: searchParams.get('propertyId') ?? '',
    date: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined,
  }
}

export function calculateQuickEntryHoursFromSchedule(startTime?: string, endTime?: string) {
  const roundingMinutes = getAppSettings().hoursSettings.roundHoursToNearestMinutes

  if (!startTime || !endTime) {
    return null
  }

  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  if (
    [startHour, startMinute, endHour, endMinute].some((value) => Number.isNaN(value))
  ) {
    return null
  }

  const startTotalMinutes = startHour * 60 + startMinute
  const endTotalMinutes = endHour * 60 + endMinute

  if (endTotalMinutes <= startTotalMinutes) {
    return null
  }

  const totalMinutes = endTotalMinutes - startTotalMinutes
  const roundedMinutes =
    roundingMinutes > 0 ? Math.round(totalMinutes / roundingMinutes) * roundingMinutes : totalMinutes

  return Number((roundedMinutes / 60).toFixed(2))
}

export function applyQuickEntrySchedulePatch(
  current: QuickEntryDraft,
  patch: Partial<Pick<QuickEntryDraft, 'date' | 'startTime' | 'endTime'>>,
) {
  const nextDraft = {
    ...current,
    ...patch,
  }
  const calculatedHours = calculateQuickEntryHoursFromSchedule(
    nextDraft.startTime,
    nextDraft.endTime,
  )

  if (calculatedHours !== null && !current.hoursManuallyEdited) {
    nextDraft.hoursWorked = calculatedHours
  }

  return nextDraft
}

export function applyQuickEntryManualHours(current: QuickEntryDraft, hoursWorked: number) {
  return {
    ...current,
    hoursWorked,
    hoursManuallyEdited: true,
  }
}

export function syncQuickEntryHoursWithSchedule(current: QuickEntryDraft) {
  const calculatedHours = calculateQuickEntryHoursFromSchedule(current.startTime, current.endTime)
  if (calculatedHours === null) {
    return current
  }

  return {
    ...current,
    hoursWorked: calculatedHours,
    hoursManuallyEdited: false,
  }
}

export function applyQuickEntryWorkerSelection(current: QuickEntryDraft, worker?: Worker) {
  const defaultRate = getAppSettings().hoursSettings.defaultHourlyRate

  if (!worker) {
    return {
      ...current,
      workerId: '',
    }
  }

  return {
    ...current,
    workerId: worker.id,
    hourlyRate: worker.defaultHourlyRate ?? current.hourlyRate ?? defaultRate,
  }
}
