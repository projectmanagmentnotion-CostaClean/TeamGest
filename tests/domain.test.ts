import { describe, expect, it } from 'vitest'
import { validateAndNormalizeAppSettings } from '../src/domain/settings/appSettingsValidation'
import { getConfirmedHours, getPayableTotal } from '../src/modules/payroll/services/monthlyClosureCalculations'
import { calculateQuickEntryHoursFromSchedule } from '../src/modules/services/services/quickEntryDraft'
import { validateHourCorrectionPatch } from '../src/modules/hours/services/hourReviewValidation'
import { validateWorkerForm } from '../src/modules/workers/services/workerFormValidation'
import type { HourEntry } from '../src/domain/hours/hourEntry.types'

describe('TeamGest domain safeguards', () => {
  it('normalizes invalid settings to safe local defaults', () => {
    const result = validateAndNormalizeAppSettings({
      hoursSettings: { defaultHourlyRate: -4, roundHoursToNearestMinutes: 7 },
      systemSettings: { appMode: 'remote', dataRealStatus: 'live' },
    })

    expect(result.settings.systemSettings.appMode).toBe('local')
    expect(result.settings.systemSettings.dataRealStatus).toBe('planning_only')
    expect(result.settings.hoursSettings.defaultHourlyRate).toBe(12)
    expect(result.warnings.length).toBeGreaterThan(0)
  })

  it('calculates scheduled hours and rejects backwards intervals', () => {
    expect(calculateQuickEntryHoursFromSchedule('09:00', '12:30')).toBe(3.5)
    expect(calculateQuickEntryHoursFromSchedule('12:30', '09:00')).toBeNull()
  })

  it('keeps correction and worker validation fail-closed', () => {
    expect(validateWorkerForm({ name: ' ', role: 'cleaner', status: 'active' })).toContain(
      'El nombre del trabajador es obligatorio.',
    )
    expect(validateHourCorrectionPatch({ hoursWorked: 0, hourlyRate: 0 })).toEqual([
      'Las horas deben ser mayores que cero.',
      'La tarifa horaria debe ser mayor que cero.',
    ])
  })

  it('includes only payable confirmed entries in closure totals', () => {
    const entries = [
      { hourStatus: 'confirmed', confirmed: true, hoursWorked: 3, hourlyRate: 20, totalPay: 60, serviceId: 's1' },
      { hourStatus: 'pending_review', confirmed: false, hoursWorked: 2, hourlyRate: 20, totalPay: 40, serviceId: 's2' },
      { hourStatus: 'confirmed', confirmed: true, hoursWorked: 4, hourlyRate: 0, totalPay: 0, serviceId: 's3' },
    ] as HourEntry[]
    const settings = validateAndNormalizeAppSettings({}).settings

    expect(getConfirmedHours(entries, settings)).toBe(3)
    expect(getPayableTotal(entries, settings)).toBe(60)
  })
})
