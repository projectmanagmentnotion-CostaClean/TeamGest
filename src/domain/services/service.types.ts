import type { BaseEntity } from '../shared/entity.types'
import type { ServiceStatus } from '../shared/status.types'

export type ServiceType =
  | 'basic_cleaning'
  | 'deep_cleaning'
  | 'post_construction'
  | 'airbnb_turnover'
  | 'gym_cleaning'
  | 'office_cleaning'
  | 'windows'
  | 'extra'
  | 'other'

export type ServiceAssignment = BaseEntity & {
  serviceJobId: string
  workerId: string
  hoursWorked: number
  hourlyRate?: number
  extraAmount?: number
  deductions?: number
  confirmed: boolean
}

export type ServiceJob = BaseEntity & {
  clientId: string
  propertyId: string
  serviceType: ServiceType
  date: string
  startTime?: string
  endTime?: string
  status: ServiceStatus
  assignments: ServiceAssignment[]
}
