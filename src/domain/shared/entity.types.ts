export type EntityStatus = 'active' | 'inactive' | 'archived'

export type BaseEntity = {
  id: string
  notes?: string
  createdAt: string
  updatedAt: string
}
