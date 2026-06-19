import type { ClientInput } from '../../../domain/clients/client.inputs'
import type { Client } from '../../../domain/clients/client.types'

export function createClientFormDraft(client?: Client): ClientInput {
  return {
    name: client?.name ?? '',
    phone: client?.phone ?? '',
    email: client?.email ?? '',
    billingName: client?.billingName ?? '',
    billingTaxId: client?.billingTaxId ?? '',
    billingAddress: client?.billingAddress ?? '',
    status: client?.status ?? 'active',
    notes: client?.notes ?? '',
  }
}
