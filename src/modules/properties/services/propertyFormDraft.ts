import type { PropertyInput } from '../../../domain/properties/property.inputs'
import type { Property } from '../../../domain/properties/property.types'

export function createPropertyFormDraft(property?: Property): PropertyInput {
  return {
    clientId: property?.clientId ?? '',
    name: property?.name ?? '',
    address: property?.address ?? '',
    city: property?.city ?? '',
    postalCode: property?.postalCode ?? '',
    propertyType: property?.propertyType ?? 'apartment',
    rooms: property?.rooms,
    bathrooms: property?.bathrooms,
    status: property?.status ?? 'active',
    notes: property?.notes ?? '',
  }
}
