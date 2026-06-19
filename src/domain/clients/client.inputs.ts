import type { EntityStatus } from '../shared/entity.types'

export type ClientInput = {
  name: string
  phone?: string
  email?: string
  billingName?: string
  billingTaxId?: string
  billingAddress?: string
  status: EntityStatus
  notes?: string
}
