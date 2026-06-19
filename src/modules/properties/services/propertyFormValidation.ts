import type { PropertyInput } from '../../../domain/properties/property.inputs'

export function validatePropertyForm(draft: PropertyInput) {
  const errors: string[] = []

  if (!draft.clientId) {
    errors.push('Debes vincular el inmueble a un cliente.')
  }

  if (!draft.name.trim() || !draft.address.trim() || !draft.city.trim()) {
    errors.push('Nombre, direccion y ciudad son obligatorios.')
  }

  return errors
}
