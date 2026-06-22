import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob, ServiceType } from '../../../domain/services/service.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { formatMonthLabel } from '../../../utils/dates'
import { createEntityId } from '../../../utils/ids'
import { getAppSettings } from '../../settings/services/appSettingsService'
import type { QuickEntryDraft } from './quickEntryDraft'
import { getQuickEntryEffectiveRate } from './quickEntryValidation'

function resolveQuickEntryServiceType(property: Property): ServiceType {
  if (property.propertyType === 'gym') {
    return 'gym_cleaning'
  }

  if (property.propertyType === 'office' || property.propertyType === 'commercial') {
    return 'office_cleaning'
  }

  if (
    property.propertyType === 'tourist_apartment' ||
    property.propertyType === 'apartment' ||
    property.propertyType === 'house' ||
    property.propertyType === 'hotel'
  ) {
    return 'airbnb_turnover'
  }

  return 'basic_cleaning'
}

export function getQuickEntryPayrollMonthLabel(date: string) {
  return formatMonthLabel(date.slice(0, 7))
}

export function getQuickEntryTimeLabel(startTime?: string, endTime?: string) {
  if (startTime && endTime) {
    return `${startTime} - ${endTime}`
  }

  if (startTime) {
    return `Inicio ${startTime}`
  }

  return 'Horario pendiente'
}

export function buildQuickEntryService(
  draft: QuickEntryDraft,
  property: Property,
  worker: Worker,
): ServiceJob {
  const settings = getAppSettings()
  const timestamp = new Date().toISOString()
  const today = new Date().toISOString().slice(0, 10)
  const status =
    draft.date > today
      ? settings.quickEntrySettings.defaultServiceStatusForFutureDate
      : settings.quickEntrySettings.defaultServiceStatusForPastDate

  return {
    id: createEntityId('service'),
    clientId: property.clientId,
    propertyId: property.id,
    serviceType: settings.serviceSettings.defaultServiceType || resolveQuickEntryServiceType(property),
    date: draft.date,
    startTime: draft.startTime || undefined,
    endTime: draft.endTime || undefined,
    status:
      !settings.hoursSettings.allowFutureCompletedEntries && draft.date > today && status === 'completed'
        ? 'scheduled'
        : status,
    notes: draft.notes || `Trabajo realizado por ${worker.name}.`,
    createdAt: timestamp,
    updatedAt: timestamp,
    assignments: [
      {
        id: createEntityId('assignment'),
        serviceJobId: '',
        workerId: worker.id,
        hoursWorked: draft.hoursWorked,
        hourlyRate: getQuickEntryEffectiveRate(
          draft,
          worker.defaultHourlyRate ?? settings.hoursSettings.defaultHourlyRate,
        ),
        extraAmount: draft.extraAmount,
        deductions: draft.deductions,
        confirmed: settings.quickEntrySettings.defaultConfirmed,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
  }
}
