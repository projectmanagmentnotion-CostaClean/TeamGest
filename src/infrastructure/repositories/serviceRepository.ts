import type { ServiceJob } from '../../domain/services/service.types'
import { mockServices } from '../mock/mockServices'
import { readJson, writeJson } from '../storage/localStorageAdapter'

const LOCAL_SERVICES_KEY = 'costaflow.services.local'

function readLocalServices() {
  return readJson<ServiceJob[]>(LOCAL_SERVICES_KEY) ?? []
}

function writeLocalServices(services: ServiceJob[]) {
  writeJson(LOCAL_SERVICES_KEY, services)
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
      return service
    },
  }
}
