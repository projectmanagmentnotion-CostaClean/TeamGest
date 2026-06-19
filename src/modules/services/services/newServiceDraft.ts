import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceAssignment, ServiceJob, ServiceType } from '../../../domain/services/service.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { createEntityId } from '../../../utils/ids'

export type NewServiceDraftAssignment = {
  workerId: string
  hoursWorked: number
  hourlyRate?: number
  extraAmount?: number
  deductions?: number
  confirmed: boolean
}

export type NewServiceDraft = {
  clientId?: string
  propertyId?: string
  serviceType?: ServiceType
  date?: string
  startTime?: string
  endTime?: string
  workerIds: string[]
  assignments: NewServiceDraftAssignment[]
}

export function createInitialNewServiceDraft(): NewServiceDraft {
  return {
    workerIds: [],
    assignments: [],
  }
}

export function updateDraftClient(draft: NewServiceDraft, clientId?: string): NewServiceDraft {
  if (draft.clientId === clientId) {
    return draft
  }

  return {
    ...draft,
    clientId,
    propertyId: undefined,
  }
}

export function updateDraftProperty(draft: NewServiceDraft, propertyId?: string): NewServiceDraft {
  return {
    ...draft,
    propertyId,
  }
}

export function updateDraftServiceType(
  draft: NewServiceDraft,
  serviceType?: ServiceType,
): NewServiceDraft {
  return {
    ...draft,
    serviceType,
  }
}

export function updateDraftSchedule(
  draft: NewServiceDraft,
  values: Pick<NewServiceDraft, 'date' | 'startTime' | 'endTime'>,
): NewServiceDraft {
  return {
    ...draft,
    ...values,
  }
}

export function updateDraftWorkers(draft: NewServiceDraft, workers: Worker[]): NewServiceDraft {
  const workerIds = workers.map((worker) => worker.id)
  const nextAssignments = workerIds.map((workerId) => {
    const existing = draft.assignments.find((assignment) => assignment.workerId === workerId)
    const worker = workers.find((item) => item.id === workerId)

    return (
      existing ?? {
        workerId,
        hoursWorked: 0,
        hourlyRate: worker?.defaultHourlyRate,
        extraAmount: 0,
        deductions: 0,
        confirmed: true,
      }
    )
  })

  return {
    ...draft,
    workerIds,
    assignments: nextAssignments,
  }
}

export function updateDraftAssignment(
  draft: NewServiceDraft,
  workerId: string,
  assignment: Partial<NewServiceDraftAssignment>,
): NewServiceDraft {
  return {
    ...draft,
    assignments: draft.assignments.map((item) =>
      item.workerId === workerId ? { ...item, ...assignment } : item,
    ),
  }
}

export function validateNewServiceDraft(draft: NewServiceDraft) {
  return Boolean(
    draft.clientId &&
      draft.propertyId &&
      draft.serviceType &&
      draft.date &&
      draft.workerIds.length > 0 &&
      draft.assignments.every(
        (assignment) =>
          assignment.hoursWorked > 0 && typeof assignment.hourlyRate === 'number' && assignment.hourlyRate > 0,
      ),
  )
}

export function buildServicePreviewFromDraft(
  draft: NewServiceDraft,
  clients: Client[],
  properties: Property[],
): ServiceJob | null {
  if (!draft.clientId || !draft.propertyId || !draft.serviceType || !draft.date) {
    return null
  }

  const todayKey = new Date().toISOString().slice(0, 10)
  const status = draft.date >= todayKey ? 'scheduled' : 'draft'
  const timestamp = new Date().toISOString()
  const client = clients.find((item) => item.id === draft.clientId)
  const property = properties.find((item) => item.id === draft.propertyId)

  return {
    id: createEntityId('service'),
    clientId: client?.id ?? draft.clientId,
    propertyId: property?.id ?? draft.propertyId,
    serviceType: draft.serviceType,
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    status,
    assignments: draft.assignments.map(
      (assignment): ServiceAssignment => ({
        id: createEntityId('assignment'),
        serviceJobId: 'preview',
        workerId: assignment.workerId,
        hoursWorked: assignment.hoursWorked,
        hourlyRate: assignment.hourlyRate,
        extraAmount: assignment.extraAmount,
        deductions: assignment.deductions,
        confirmed: assignment.confirmed,
        createdAt: timestamp,
        updatedAt: timestamp,
      }),
    ),
    notes: 'Servicio preparado desde StepFlow local.',
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}
