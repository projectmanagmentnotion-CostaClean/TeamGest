import { mockProperties } from '../mock/mockProperties'

export function createPropertyRepository() {
  return {
    listProperties: () => mockProperties,
    getPropertyById: (id: string) => mockProperties.find((property) => property.id === id),
  }
}
