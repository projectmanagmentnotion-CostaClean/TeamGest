import type { EntityStatus } from '../shared/entity.types'
import type { PropertyType } from './property.types'

export type PropertyInput = {
  clientId: string
  name: string
  address: string
  city: string
  postalCode?: string
  propertyType: PropertyType
  rooms?: number
  bathrooms?: number
  status: EntityStatus
  notes?: string
}
