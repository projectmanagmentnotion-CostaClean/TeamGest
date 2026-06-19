import type { ServiceStatus } from '../shared/status.types'
import type { ServiceType } from './service.types'

export type ServiceAssignmentInput = {
  workerId: string
  hoursWorked: number
  hourlyRate?: number
  extraAmount?: number
  deductions?: number
  confirmed: boolean
}

export type ServiceInput = {
  clientId: string
  propertyId: string
  serviceType: ServiceType
  date: string
  startTime?: string
  endTime?: string
  status: ServiceStatus
  assignments: ServiceAssignmentInput[]
  notes?: string
}
