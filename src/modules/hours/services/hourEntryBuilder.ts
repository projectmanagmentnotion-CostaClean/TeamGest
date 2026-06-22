import type { Client } from '../../../domain/clients/client.types'
import type { HourEntry } from '../../../domain/hours/hourEntry.types'
import type { PayrollMonthState } from '../../../domain/payroll/payroll.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceAssignment, ServiceJob } from '../../../domain/services/service.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { getMonthKey } from '../../../utils/dates'
import { calculateHourEntryPay } from './hourCalculations'
import { deriveHourStatus } from './hourStatus'
import { getHourEntryWarnings } from './hourWarnings'

export function buildHourEntryFromAssignment(
  service: ServiceJob,
  assignment: ServiceAssignment,
  workers: Worker[],
  clients: Client[],
  properties: Property[],
  payrollStates?: Record<string, PayrollMonthState>,
): HourEntry {
  const worker = workers.find((item) => item.id === assignment.workerId)
  const property = properties.find((item) => item.id === service.propertyId)
  const client = clients.find((item) => item.id === service.clientId)
  const payrollMonth = getMonthKey(service.date)
  const hourlyRate = assignment.hourlyRate ?? 0
  const extraAmount = assignment.extraAmount ?? 0
  const deductions = assignment.deductions ?? 0
  const warnings = getHourEntryWarnings({
    workerName: worker?.name ?? '',
    propertyName: property?.name ?? '',
    serviceStatus: service.status,
    confirmed: assignment.confirmed,
    hoursWorked: assignment.hoursWorked,
    hourlyRate,
  })
  const hourStatus = deriveHourStatus(
    {
      confirmed: assignment.confirmed,
      serviceStatus: service.status,
      workerId: assignment.workerId,
      hoursWorked: assignment.hoursWorked,
      hourlyRate,
    },
    payrollStates?.[payrollMonth],
  )

  return {
    id: `${service.id}:${assignment.id}`,
    serviceId: service.id,
    assignmentId: assignment.id,
    workerId: assignment.workerId,
    workerName: worker?.name ?? 'Trabajador no disponible',
    propertyId: service.propertyId,
    propertyName: property?.name ?? 'Inmueble no disponible',
    clientId: service.clientId,
    clientName: client?.name ?? 'Cliente no disponible',
    serviceType: service.serviceType,
    date: service.date,
    startTime: service.startTime,
    endTime: service.endTime,
    hoursWorked: assignment.hoursWorked,
    hourlyRate,
    extraAmount,
    deductions,
    totalPay: calculateHourEntryPay({
      hoursWorked: assignment.hoursWorked,
      hourlyRate,
      extraAmount,
      deductions,
    }),
    confirmed: assignment.confirmed,
    serviceStatus: service.status,
    hourStatus,
    payrollMonth,
    isLocked: payrollStates?.[payrollMonth]?.status === 'locked',
    warnings,
  }
}

export function buildHourEntries(
  services: ServiceJob[],
  workers: Worker[],
  clients: Client[],
  properties: Property[],
  payrollStates?: Record<string, PayrollMonthState>,
) {
  return services
    .flatMap((service) =>
      service.assignments.map((assignment) =>
        buildHourEntryFromAssignment(service, assignment, workers, clients, properties, payrollStates),
      ),
    )
    .sort((left, right) => {
      const leftStamp = `${left.date}T${left.startTime ?? '00:00'}`
      const rightStamp = `${right.date}T${right.startTime ?? '00:00'}`
      return rightStamp.localeCompare(leftStamp)
    })
}
