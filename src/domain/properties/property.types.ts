import type { BaseEntity, EntityStatus } from '../shared/entity.types'

export type PropertyType =
  | 'apartment'
  | 'house'
  | 'office'
  | 'gym'
  | 'commercial'
  | 'hotel'
  | 'tourist_apartment'
  | 'other'

export type Property = BaseEntity & {
  clientId: string
  name: string
  address: string
  city: string
  postalCode?: string
  propertyType: PropertyType
  rooms?: number
  bathrooms?: number
  status: EntityStatus
}
