import type { WorkerInput } from '../../domain/workers/worker.inputs'
import type { Worker } from '../../domain/workers/worker.types'
import { createEntityId } from '../../utils/ids'
import { recordAuditEvent } from '../audit/auditRepository'
import { mockServices } from '../mock/mockServices'
import { mockWorkers } from '../mock/mockWorkers'
import {
  archiveEntity,
  createLocalRecord,
  deleteLocalRecord,
  getEntityLocalState,
  listArchivedEntities,
  listLocalCreated,
  listLocalOverrides,
  mergeSeedWithLocal,
  restoreEntity,
  upsertLocalOverride,
} from '../storage/entityLocalStore'
import {
  WORKERS_ARCHIVED_KEY,
  WORKERS_CREATED_KEY,
  WORKERS_OVERRIDES_KEY,
} from '../storage/storageKeys'

function readWorkers() {
  return mergeSeedWithLocal(
    mockWorkers,
    listLocalCreated<Worker>(WORKERS_CREATED_KEY),
    listLocalOverrides<Worker>(WORKERS_OVERRIDES_KEY),
    Object.keys(listArchivedEntities(WORKERS_ARCHIVED_KEY)),
  )
}

function hasAssignments(workerId: string) {
  return mockServices.some((service) =>
    service.assignments.some((assignment) => assignment.workerId === workerId),
  )
}

function buildWorker(input: WorkerInput): Worker {
  const timestamp = new Date().toISOString()
  return {
    id: createEntityId('worker'),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...input,
  }
}

export function createWorkerRepository() {
  return {
    listWorkers: () => readWorkers(),
    getWorkerById: (id: string) => readWorkers().find((worker) => worker.id === id),
    createWorker: (input: WorkerInput) => {
      const worker = buildWorker(input)
      createLocalRecord(WORKERS_CREATED_KEY, worker)
      restoreEntity(WORKERS_ARCHIVED_KEY, worker.id)
      recordAuditEvent({
        action: 'worker.created',
        entityType: 'worker',
        entityId: worker.id,
        message: `Se creó el trabajador ${worker.name}.`,
      })
      return worker
    },
    updateWorker: (id: string, patch: Partial<WorkerInput>) => {
      const localState = getEntityLocalState(
        {
          createdKey: WORKERS_CREATED_KEY,
          overridesKey: WORKERS_OVERRIDES_KEY,
          archivedKey: WORKERS_ARCHIVED_KEY,
        },
        id,
      )
      const current = readWorkers().find((worker) => worker.id === id)
      if (!current) {
        return null
      }

      const nextValue = {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
      }

      if (localState.isLocalCreated) {
        const records = listLocalCreated<Worker>(WORKERS_CREATED_KEY).map((worker) =>
          worker.id === id ? nextValue : worker,
        )
        createLocalRecord(WORKERS_CREATED_KEY, nextValue)
        recordAuditEvent({
          action: 'worker.updated',
          entityType: 'worker',
          entityId: id,
          message: `Se actualizó el trabajador ${nextValue.name}.`,
        })
        return records.find((worker) => worker.id === id) ?? nextValue
      }

      upsertLocalOverride<Worker>(WORKERS_OVERRIDES_KEY, id, {
        ...patch,
        updatedAt: nextValue.updatedAt,
      } as Partial<Worker>)
      recordAuditEvent({
        action: 'worker.updated',
        entityType: 'worker',
        entityId: id,
        message: `Se actualizó el trabajador ${nextValue.name}.`,
      })
      return nextValue
    },
    archiveWorker: (id: string) => {
      const worker = readWorkers().find((item) => item.id === id)
      if (!worker) {
        return false
      }

      archiveEntity(WORKERS_ARCHIVED_KEY, id)
      recordAuditEvent({
        action: 'worker.archived',
        entityType: 'worker',
        entityId: id,
        message: `Se archivó el trabajador ${worker.name}.`,
      })
      return true
    },
    restoreWorker: (id: string) => {
      const worker = [...mockWorkers, ...listLocalCreated<Worker>(WORKERS_CREATED_KEY)].find(
        (item) => item.id === id,
      )
      if (!worker) {
        return false
      }

      const restored = restoreEntity(WORKERS_ARCHIVED_KEY, id)
      if (restored) {
        recordAuditEvent({
          action: 'worker.restored',
          entityType: 'worker',
          entityId: id,
          message: `Se restauró el trabajador ${worker.name}.`,
        })
      }
      return restored
    },
    canDeleteWorker: (id: string) => {
      const localState = getEntityLocalState(
        {
          createdKey: WORKERS_CREATED_KEY,
          overridesKey: WORKERS_OVERRIDES_KEY,
          archivedKey: WORKERS_ARCHIVED_KEY,
        },
        id,
      )
      if (!localState.isLocalCreated) {
        return {
          allowed: false,
          reason: 'Los trabajadores de semilla solo pueden archivarse en esta versión local.',
        }
      }

      if (hasAssignments(id)) {
        return {
          allowed: false,
          reason: 'Este trabajador ya tiene asignaciones. Archívalo en lugar de eliminarlo.',
        }
      }

      return { allowed: true }
    },
    deleteWorker: (id: string) => {
      const policy = createWorkerRepository().canDeleteWorker(id)
      const worker = readWorkers().find((item) => item.id === id)
      if (!policy.allowed || !worker) {
        return false
      }

      const deleted = deleteLocalRecord<Worker>(WORKERS_CREATED_KEY, id)
      if (deleted) {
        restoreEntity(WORKERS_ARCHIVED_KEY, id)
        recordAuditEvent({
          action: 'worker.deleted',
          entityType: 'worker',
          entityId: id,
          message: `Se eliminó el trabajador local ${worker.name}.`,
        })
      }
      return deleted
    },
  }
}
