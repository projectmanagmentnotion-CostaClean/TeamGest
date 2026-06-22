import type { WorkerInput } from '../../domain/workers/worker.inputs'
import type { Worker } from '../../domain/workers/worker.types'
import { createEntityId } from '../../utils/ids'
import { recordAuditEvent } from '../audit/auditRepository'
import { listAllServicesSnapshot } from './serviceRepository'
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
import { WORKERS_ARCHIVED_KEY, WORKERS_CREATED_KEY, WORKERS_OVERRIDES_KEY } from '../storage/storageKeys'

function readAllWorkers() {
  return mergeSeedWithLocal(
    mockWorkers,
    listLocalCreated<Worker>(WORKERS_CREATED_KEY),
    listLocalOverrides<Worker>(WORKERS_OVERRIDES_KEY),
    [],
  )
}

function readWorkers() {
  return readAllWorkers().filter(
    (worker) => !listArchivedEntities(WORKERS_ARCHIVED_KEY)[worker.id],
  )
}

function hasAssignments(workerId: string) {
  return listAllServicesSnapshot().some((service) =>
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
    getWorkerById: (id: string) => readAllWorkers().find((worker) => worker.id === id),
    createWorker: (input: WorkerInput) => {
      const worker = buildWorker(input)
      createLocalRecord(WORKERS_CREATED_KEY, worker)
      restoreEntity(WORKERS_ARCHIVED_KEY, worker.id)
      recordAuditEvent({
        action: 'worker.created',
        entityType: 'worker',
        entityId: worker.id,
        message: `Se creo el trabajador ${worker.name}.`,
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
      const current = readAllWorkers().find((worker) => worker.id === id)
      if (!current) {
        return null
      }

      const nextValue = {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
      }

      if (localState.isLocalCreated) {
        createLocalRecord(WORKERS_CREATED_KEY, nextValue)
      } else {
        upsertLocalOverride<Worker>(WORKERS_OVERRIDES_KEY, id, {
          ...patch,
          updatedAt: nextValue.updatedAt,
        } as Partial<Worker>)
      }

      recordAuditEvent({
        action: 'worker.updated',
        entityType: 'worker',
        entityId: id,
        message: `Se actualizo el trabajador ${nextValue.name}.`,
      })
      return nextValue
    },
    archiveWorker: (id: string) => {
      const worker = readAllWorkers().find((item) => item.id === id)
      if (!worker) {
        return false
      }

      archiveEntity(WORKERS_ARCHIVED_KEY, id, {
        reason: hasAssignments(id) ? 'assigned_services' : undefined,
      })
      recordAuditEvent({
        action: 'worker.archived',
        entityType: 'worker',
        entityId: id,
        message: `Se archivo el trabajador ${worker.name}.`,
      })
      return true
    },
    restoreWorker: (id: string) => {
      const worker = readAllWorkers().find((item) => item.id === id)
      if (!worker) {
        return false
      }

      const restored = restoreEntity(WORKERS_ARCHIVED_KEY, id)
      if (restored) {
        recordAuditEvent({
          action: 'worker.restored',
          entityType: 'worker',
          entityId: id,
          message: `Se restauro el trabajador ${worker.name}.`,
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
          reason: 'Los trabajadores de semilla solo pueden archivarse en esta version local.',
        }
      }

      if (hasAssignments(id)) {
        return {
          allowed: false,
          reason: 'Este trabajador ya tiene asignaciones en servicios. Archivarlo es seguro; eliminarlo no.',
        }
      }

      return { allowed: true }
    },
    deleteWorker: (id: string) => {
      const policy = createWorkerRepository().canDeleteWorker(id)
      const worker = readAllWorkers().find((item) => item.id === id)
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
          message: `Se elimino el trabajador local ${worker.name}.`,
        })
      }
      return deleted
    },
  }
}
