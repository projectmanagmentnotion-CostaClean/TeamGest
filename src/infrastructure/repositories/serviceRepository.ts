import type { ServiceJob } from '../../domain/services/service.types'
import { recordAuditEvent } from '../audit/auditRepository'
import { mockServices } from '../mock/mockServices'
import { readJson, writeJson } from '../storage/localStorageAdapter'
import { LEGACY_SERVICES_CREATED_KEY, SERVICES_CREATED_KEY } from '../storage/storageKeys'

function readLocalServices() {
  const services = readJson<ServiceJob[]>(SERVICES_CREATED_KEY, [])
  if (services.length > 0) {
    return services
  }

  return readJson<ServiceJob[]>(LEGACY_SERVICES_CREATED_KEY, [])
}

function writeLocalServices(services: ServiceJob[]) {
  writeJson(SERVICES_CREATED_KEY, services)
}

function listAllServices() {
  const localServices = readLocalServices()
  const knownIds = new Set(mockServices.map((service) => service.id))
  const dedupedLocal = localServices.filter((service) => !knownIds.has(service.id))

  return [...dedupedLocal, ...mockServices].sort((left, right) => right.date.localeCompare(left.date))
}

export function createServiceRepository() {
  return {
    listServices: () => listAllServices(),
    getServiceById: (id: string) => listAllServices().find((service) => service.id === id),
    createService: (service: ServiceJob) => {
      const localServices = readLocalServices()
      writeLocalServices([service, ...localServices.filter((item) => item.id !== service.id)])
      recordAuditEvent({
        action: 'service.created',
        entityType: 'service',
        entityId: service.id,
        message: `Se guardó el servicio ${service.id} en almacenamiento local.`,
        metadata: {
          status: service.status,
          date: service.date,
        },
      })
      return service
    },
  }
}
