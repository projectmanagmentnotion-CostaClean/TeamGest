import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import type { WarningItem } from '../../../domain/shared/warning.types'
import type { Worker } from '../../../domain/workers/worker.types'
import type { AppAuditEntry } from '../../../infrastructure/audit/audit.types'
import { formatDate, formatMonthLabel, getMonthKey, isSameDay, isSameMonthKey } from '../../../utils/dates'
import { formatServiceTypeLabel } from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'
import { getPayrollWarnings } from '../../payroll/services/payrollWarnings'
import { calculateMonthlyPayrollSummary } from '../../payroll/services/payrollCalculations'
import { getPropertyWarnings } from '../../properties/services/propertyWarnings'
import { getServiceWarnings } from '../../services/services/serviceWarnings'
import { getWorkerOperationalWarnings, getWorkersWithWarnings } from '../../workers/services/workerWarnings'

const warningPriority = {
  danger: 1,
  blocked: 2,
  warning: 3,
  info: 4,
  success: 5,
} satisfies Record<WarningItem['level'], number>

export function getCurrentMonthKey() {
  return getMonthKey(new Date().toISOString())
}

export function getCurrentMonthLabel() {
  return formatMonthLabel(getCurrentMonthKey())
}

export function getTodayServices(services: ServiceJob[]) {
  const today = new Date().toISOString()
  return services.filter((service) => isSameDay(service.date, today))
}

export function getCompletedServicesThisMonth(services: ServiceJob[]) {
  const month = getCurrentMonthKey()
  return services.filter(
    (service) => service.status === 'completed' && isSameMonthKey(service.date, month),
  )
}

export function getReviewedServicesThisMonth(services: ServiceJob[]) {
  const month = getCurrentMonthKey()
  return services.filter(
    (service) => service.status === 'reviewed' && isSameMonthKey(service.date, month),
  )
}

export function getClosedServicesThisMonth(services: ServiceJob[]) {
  const month = getCurrentMonthKey()
  return services.filter(
    (service) => service.status === 'closed' && isSameMonthKey(service.date, month),
  )
}

export function getDashboardWarnings(
  workers: Worker[],
  clients: Client[],
  properties: Property[],
  services: ServiceJob[],
  month: string,
) {
  const warnings = [
    ...services.flatMap((service) => getServiceWarnings(service, workers, properties, clients)),
    ...workers.flatMap((worker) => getWorkerOperationalWarnings(worker, services)),
    ...properties.flatMap((property) => getPropertyWarnings(property, clients)),
    ...getPayrollWarnings(workers, services, month),
  ]

  return warnings.sort((left, right) => warningPriority[left.level] - warningPriority[right.level])
}

export function getRecentActivity(
  workers: Worker[],
  clients: Client[],
  properties: Property[],
  services: ServiceJob[],
) {
  return [...services]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 8)
    .flatMap((service) => {
      const client = clients.find((item) => item.id === service.clientId)
      const property = properties.find((item) => item.id === service.propertyId)
      const assignments = service.assignments.map((assignment) => {
        const worker = workers.find((item) => item.id === assignment.workerId)

        return {
          id: `${service.id}-${assignment.id}`,
          title: worker ? `Asignacion confirmada para ${worker.name}` : 'Asignacion registrada',
          text: `${formatServiceTypeLabel(service.serviceType)} en ${property?.name ?? 'inmueble'} con tarifa ${formatMoney(assignment.hourlyRate ?? 0)}.`,
          date: formatDate(service.updatedAt),
          entityLabel: client?.name ?? property?.name,
        }
      })

      const baseActivity = {
        id: service.id,
        title: `Servicio ${service.status === 'reviewed' ? 'revisado' : service.status === 'completed' ? 'completado' : service.status === 'scheduled' ? 'programado' : service.status === 'closed' ? 'cerrado' : 'actualizado'}`,
        text: `${formatServiceTypeLabel(service.serviceType)} en ${property?.name ?? 'inmueble'} para ${client?.name ?? 'cliente'}.`,
        date: formatDate(service.updatedAt),
        entityLabel: property?.name,
      }

      return [baseActivity, ...assignments.slice(0, 1)]
    })
    .slice(0, 8)
}

export function getOperationalFocus(
  workers: Worker[],
  clients: Client[],
  properties: Property[],
  services: ServiceJob[],
  month: string,
) {
  const warnings = getDashboardWarnings(workers, clients, properties, services, month)

  return [
    {
      label: 'Horas por revisar',
      value: getCompletedServicesThisMonth(services).length.toString(),
      hint: 'Servicios pagables que aun pueden esconder confirmaciones pendientes.',
    },
    {
      label: 'Servicios cerrados',
      value: getClosedServicesThisMonth(services).length.toString(),
      hint: 'Servicios cerrados dentro del mes activo.',
    },
    {
      label: 'Trabajadores con incidencias',
      value: getWorkersWithWarnings(workers, services).length.toString(),
      hint: `${warnings.filter((warning) => warning.level !== 'success').length} alertas activas en seguimiento.`,
    },
  ]
}

export function getRecentQuickEntryServices(services: ServiceJob[], auditEntries: AppAuditEntry[]) {
  const quickEntryIds = auditEntries
    .filter((entry) => entry.action === 'service.quick_entry_created' && entry.entityId)
    .map((entry) => entry.entityId as string)

  return quickEntryIds
    .map((id) => services.find((service) => service.id === id))
    .filter((service): service is ServiceJob => Boolean(service))
    .slice(0, 3)
}

export function calculateDashboardStats(
  workers: Worker[],
  clients: Client[],
  properties: Property[],
  services: ServiceJob[],
  month: string,
) {
  const payrollSummary = calculateMonthlyPayrollSummary(workers, services, month)
  const payrollTotal = payrollSummary.reduce((sum, item) => sum + item.totalPay, 0)
  const warnings = getDashboardWarnings(workers, clients, properties, services, month)

  return [
    {
      label: 'Servicios hoy',
      value: getTodayServices(services).length.toString(),
      hint: 'Operacion prevista o completada durante la jornada actual.',
      tone: 'info' as const,
    },
    {
      label: 'Trabajadores activos',
      value: workers.filter((worker) => worker.status === 'active').length.toString(),
      hint: 'Equipo disponible para operacion.',
      tone: 'success' as const,
    },
    {
      label: 'Inmuebles activos',
      value: properties.filter((property) => property.status === 'active').length.toString(),
      hint: `${clients.filter((client) => client.status === 'active').length} clientes activos en cartera.`,
      tone: 'neutral' as const,
    },
    {
      label: 'Pago interno estimado',
      value: formatMoney(payrollTotal),
      hint: `Estimacion de ${formatMonthLabel(month)} basada en horas confirmadas.`,
      tone: 'info' as const,
    },
    {
      label: 'Servicios completados este mes',
      value: getCompletedServicesThisMonth(services).length.toString(),
      hint: 'Servicios ya ejecutados y marcados como completados.',
      tone: 'success' as const,
    },
    {
      label: 'Alertas abiertas',
      value: warnings.filter((warning) => warning.level !== 'success').length.toString(),
      hint: 'Incidencias y bloqueos detectados en la operacion.',
      tone: 'warning' as const,
    },
  ]
}
