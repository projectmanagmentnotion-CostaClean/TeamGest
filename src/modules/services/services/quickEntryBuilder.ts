import type { Property } from '../../../domain/properties/property.types'
import type { Worker } from '../../../domain/workers/worker.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import { createEntityId } from '../../../utils/ids'
import type { QuickEntryDraft } from './quickEntryDraft'

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
    serviceType: property.propertyType === 'gym' ? 'gym_cleaning' : 'basic_cleaning',
    date: draft.date,
    startTime: draft.startTime || undefined,
    endTime: draft.endTime || undefined,
    status: draft.date > today ? 'scheduled' : 'completed',
    notes: draft.notes || `Registro rapido para ${worker.name}.`,
    createdAt: timestamp,
    updatedAt: timestamp,
    assignments: [
      {
        id: createEntityId('assignment'),
        serviceJobId: '',
        workerId: worker.id,
        hoursWorked: draft.hoursWorked,
        hourlyRate: draft.hourlyRate ?? worker.defaultHourlyRate,
        extraAmount: draft.extraAmount,
        deductions: draft.deductions,
        confirmed: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
  }
}
