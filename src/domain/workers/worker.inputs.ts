import type { EntityStatus } from '../shared/entity.types'
import type { WorkerRole } from './worker.types'

export type WorkerInput = {
  name: string
  role: WorkerRole
  phone?: string
  email?: string
  defaultHourlyRate?: number
  status: EntityStatus
  notes?: string
}
