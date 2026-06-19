import type { BaseEntity, EntityStatus } from '../shared/entity.types'

export type WorkerRole = 'supervisor' | 'cleaner' | 'specialist' | 'driver'

export type Worker = BaseEntity & {
  name: string
  phone?: string
  email?: string
  role: WorkerRole
  defaultHourlyRate?: number
  status: EntityStatus
}
