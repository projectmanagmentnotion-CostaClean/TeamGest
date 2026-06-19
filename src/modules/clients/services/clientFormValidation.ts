import type { ClientInput } from '../../../domain/clients/client.inputs'

export function validateClientForm(draft: ClientInput) {
  const errors: string[] = []

  if (!draft.name.trim()) {
    errors.push('El nombre del cliente es obligatorio.')
  }

  return errors
}
