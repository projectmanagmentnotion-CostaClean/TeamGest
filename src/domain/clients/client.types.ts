import type { BaseEntity, EntityStatus } from '../shared/entity.types'

export type Client = BaseEntity & {
  name: string
  phone?: string
  email?: string
  billingName?: string
  billingTaxId?: string
  billingAddress?: string
  status: EntityStatus
}
