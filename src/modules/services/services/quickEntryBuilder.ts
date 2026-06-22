import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob, ServiceType } from '../../../domain/services/service.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { formatMonthLabel } from '../../../utils/dates'
import { createEntityId } from '../../../utils/ids'
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
  const timestamp = new Date().toISOString()
  const today = new Date().toISOString().slice(0, 10)

  return {
    id: createEntityId('service'),
    clientId: property.clientId,
    propertyId: property.id,
    serviceType: resolveQuickEntryServiceType(property),
    date: draft.date,
    startTime: draft.startTime || undefined,
    endTime: draft.endTime || undefined,
    status: draft.date > today ? 'scheduled' : 'completed',
    notes: draft.notes || `Trabajo realizado por ${worker.name}.`,
    createdAt: timestamp,
    updatedAt: timestamp,
    assignments: [
      {
        id: createEntityId('assignment'),
        serviceJobId: '',
        workerId: worker.id,
        hoursWorked: draft.hoursWorked,
        hourlyRate: getQuickEntryEffectiveRate(draft, worker.defaultHourlyRate),
        extraAmount: draft.extraAmount,
        deductions: draft.deductions,
        confirmed: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
  }
}
