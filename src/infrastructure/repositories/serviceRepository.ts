import { mockServices } from '../mock/mockServices'

export function createServiceRepository() {
  return {
    listServices: () => mockServices,
    getServiceById: (id: string) => mockServices.find((service) => service.id === id),
  }
}
