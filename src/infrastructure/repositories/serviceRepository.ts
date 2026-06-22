import type { PayrollMonthState } from '../../domain/payroll/payroll.types'
import type { ServiceInput } from '../../domain/services/service.inputs'
import type { ServiceJob } from '../../domain/services/service.types'
import { createEntityId } from '../../utils/ids'
import { recordAuditEvent } from '../audit/auditRepository'
import { mockServices } from '../mock/mockServices'
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
import { readJson } from '../storage/localStorageAdapter'
import {
  LEGACY_SERVICES_CREATED_KEY,
  PAYROLL_MONTHS_KEY,
  SERVICES_ARCHIVED_KEY,
  SERVICES_CREATED_KEY,
  SERVICES_OVERRIDES_KEY,
} from '../storage/storageKeys'

type ServiceMutationPolicy = {
  allowed: boolean
  reason?: string
}

function readLocalCreatedServices() {
  const currentCreated = listLocalCreated<ServiceJob>(SERVICES_CREATED_KEY)
  if (currentCreated.length > 0) {
    return currentCreated
  }

  return readJson<ServiceJob[]>(LEGACY_SERVICES_CREATED_KEY, [])
}

function normalizeServiceForStorage(service: ServiceJob) {
  const timestamp = new Date().toISOString()

  return {
    ...service,
    updatedAt: timestamp,
    assignments: service.assignments.map((assignment) => ({
      ...assignment,
      serviceJobId: service.id,
      updatedAt: timestamp,
    })),
  }
}

export function listAllServicesSnapshot() {
  return mergeSeedWithLocal(
    mockServices,
    readLocalCreatedServices(),
    listLocalOverrides<ServiceJob>(SERVICES_OVERRIDES_KEY),
    [],
  ).sort((left, right) => right.date.localeCompare(left.date))
}

function readVisibleServices() {
  return listAllServicesSnapshot().filter((service) => {
    const archivedState = listArchivedEntities(SERVICES_ARCHIVED_KEY)[service.id]

    if (!archivedState) {
      return true
    }

    return service.status === 'cancelled'
  })
}

function readPayrollStates() {
  return readJson<Record<string, PayrollMonthState>>(PAYROLL_MONTHS_KEY, {})
}

function getLockedMonthReason(service: ServiceJob) {
  const month = service.date.slice(0, 7)
  const monthState = readPayrollStates()[month]

  if (monthState?.status === 'locked') {
    return `El mes ${month} esta bloqueado en payroll y no admite cambios en este servicio.`
  }

  return null
}

function getServiceMutationPolicy(service: ServiceJob): ServiceMutationPolicy {
  const lockedMonthReason = getLockedMonthReason(service)
  if (lockedMonthReason) {
    return {
      allowed: false,
      reason: lockedMonthReason,
    }
  }

  return { allowed: true }
}

function writeUpdatedLocalService(service: ServiceJob) {
  const localState = getEntityLocalState(
    {
      createdKey: SERVICES_CREATED_KEY,
      overridesKey: SERVICES_OVERRIDES_KEY,
      archivedKey: SERVICES_ARCHIVED_KEY,
    },
    service.id,
  )

  if (localState.isLocalCreated) {
    createLocalRecord(SERVICES_CREATED_KEY, service)
    return service
  }

  upsertLocalOverride<ServiceJob>(SERVICES_OVERRIDES_KEY, service.id, service)
  return service
}

function normalizeAssignmentsForUpdate(current: ServiceJob, assignments: ServiceInput['assignments']) {
  return assignments.map((assignment) => {
    const existingAssignment = current.assignments.find(
      (item) =>
        item.id === assignment.assignmentId ||
        (!assignment.assignmentId && item.workerId === assignment.workerId),
    )
    const timestamp = new Date().toISOString()

    return {
      ...existingAssignment,
      id: existingAssignment?.id ?? createEntityId('assignment'),
      serviceJobId: current.id,
      createdAt: existingAssignment?.createdAt ?? timestamp,
      updatedAt: timestamp,
      ...assignment,
    }
  })
}

export function createServiceRepository() {
  return {
    listServices: () => readVisibleServices(),
    getServiceById: (id: string) => listAllServicesSnapshot().find((service) => service.id === id),
    canEditService: (id: string) => {
      const service = listAllServicesSnapshot().find((item) => item.id === id)
      if (!service) {
        return { allowed: false, reason: 'El servicio solicitado no existe.' }
      }

      return getServiceMutationPolicy(service)
    },
    createService: (service: ServiceJob, source: 'manual' | 'quick_entry' = 'manual') => {
      const normalizedService = normalizeServiceForStorage(service)
      createLocalRecord(SERVICES_CREATED_KEY, normalizedService)
      restoreEntity(SERVICES_ARCHIVED_KEY, normalizedService.id)
      recordAuditEvent({
        action: source === 'quick_entry' ? 'service.quick_entry_created' : 'service.created',
        entityType: 'service',
        entityId: normalizedService.id,
        message:
          source === 'quick_entry'
            ? `Se registraron horas rapidas para el servicio ${normalizedService.id}.`
            : `Se guardo el servicio ${normalizedService.id} en almacenamiento local.`,
        metadata: {
          status: normalizedService.status,
          date: normalizedService.date,
          source,
        },
      })
      return normalizedService
    },
    updateService: (id: string, patch: Partial<ServiceInput>) => {
      const current = listAllServicesSnapshot().find((service) => service.id === id)
      if (!current) {
        return { service: null, error: 'El servicio solicitado no existe.' }
      }

      const policy = getServiceMutationPolicy(current)
      if (!policy.allowed) {
        return { service: null, error: policy.reason ?? 'No se pudo actualizar el servicio.' }
      }

      const nextValue = normalizeServiceForStorage({
        ...current,
        ...patch,
        assignments: patch.assignments
          ? normalizeAssignmentsForUpdate(current, patch.assignments)
          : current.assignments,
      })

      writeUpdatedLocalService(nextValue)
      recordAuditEvent({
        action: 'service.updated',
        entityType: 'service',
        entityId: nextValue.id,
        message: `Se actualizo el servicio ${nextValue.id}.`,
        metadata: {
          status: nextValue.status,
          date: nextValue.date,
        },
      })

      return { service: nextValue, error: null }
    },
    archiveService: (id: string) => {
      const current = listAllServicesSnapshot().find((service) => service.id === id)
      if (!current) {
        return { success: false, error: 'El servicio solicitado no existe.' }
      }

      const policy = getServiceMutationPolicy(current)
      if (!policy.allowed) {
        return { success: false, error: policy.reason ?? 'No se puede cancelar este servicio.' }
      }

      const nextValue = normalizeServiceForStorage({
        ...current,
        status: 'cancelled',
      })

      writeUpdatedLocalService(nextValue)
      archiveEntity(SERVICES_ARCHIVED_KEY, id, { reason: 'cancelled' })
      recordAuditEvent({
        action: 'service.cancelled',
        entityType: 'service',
        entityId: id,
        message: `Se cancelo el servicio ${id} en almacenamiento local.`,
        metadata: {
          date: nextValue.date,
        },
      })
      return { success: true, error: null }
    },
    restoreService: (id: string) => {
      const service = listAllServicesSnapshot().find((item) => item.id === id)
      if (!service) {
        return { success: false, error: 'El servicio solicitado no existe.' }
      }

      if (service.status !== 'cancelled') {
        return { success: false, error: 'El servicio no esta cancelado.' }
      }

      const nextValue = normalizeServiceForStorage({
        ...service,
        status: service.date >= new Date().toISOString().slice(0, 10) ? 'scheduled' : 'completed',
      })

      writeUpdatedLocalService(nextValue)
      restoreEntity(SERVICES_ARCHIVED_KEY, id)
      recordAuditEvent({
        action: 'service.restored',
        entityType: 'service',
        entityId: id,
        message: `Se restauro el servicio ${id}.`,
      })
      return { success: true, error: null }
    },
    canDeleteService: (id: string) => {
      const service = listAllServicesSnapshot().find((item) => item.id === id)
      if (!service) {
        return { allowed: false, reason: 'El servicio solicitado no existe.' }
      }

      const localState = getEntityLocalState(
        {
          createdKey: SERVICES_CREATED_KEY,
          overridesKey: SERVICES_OVERRIDES_KEY,
          archivedKey: SERVICES_ARCHIVED_KEY,
        },
        id,
      )

      if (!localState.isLocalCreated) {
        return {
          allowed: false,
          reason: 'Los servicios de semilla solo pueden cancelarse. El borrado duro queda reservado a servicios locales.',
        }
      }

      return getServiceMutationPolicy(service)
    },
    deleteService: (id: string) => {
      const policy = createServiceRepository().canDeleteService(id)
      if (!policy.allowed) {
        return { success: false, error: policy.reason ?? 'No se pudo eliminar el servicio.' }
      }

      const deleted = deleteLocalRecord<ServiceJob>(SERVICES_CREATED_KEY, id)
      if (!deleted) {
        return { success: false, error: 'El servicio local ya no existe.' }
      }

      restoreEntity(SERVICES_ARCHIVED_KEY, id)
      recordAuditEvent({
        action: 'service.deleted',
        entityType: 'service',
        entityId: id,
        message: `Se elimino el servicio local ${id}.`,
      })
      return { success: true, error: null }
    },
  }
}
