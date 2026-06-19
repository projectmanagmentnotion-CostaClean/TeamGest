import type {
  PayrollSummary,
  PayrollWorkerStatusMap,
} from '../../../domain/payroll/payroll.types'
import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import type { WarningItem } from '../../../domain/shared/warning.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { formatMonthLabel, getMonthKey, isPayrollEligibleService, isSameMonthKey } from '../../../utils/dates'
import { formatMoney } from '../../../utils/money'
import { calculateAssignmentPay } from '../../services/services/serviceCalculations'

export function getCurrentPayrollMonth() {
  return getMonthKey(new Date().toISOString())
}

export function isValidPayrollMonth(month?: string) {
  return Boolean(month && /^\d{4}-\d{2}$/.test(month))
}

export function getPayrollMonthLabel(month: string) {
  return formatMonthLabel(month)
}

export function getPayableServicesByMonth(services: ServiceJob[], month: string) {
  return services.filter(
    (service) => isPayrollEligibleService(service.status) && isSameMonthKey(service.date, month),
  )
}

export function getPayrollAssignmentsByWorker(
  workerId: string,
  services: ServiceJob[],
  month: string,
) {
  return getPayableServicesByMonth(services, month).flatMap((service) =>
    service.assignments
      .filter((assignment) => assignment.workerId === workerId && assignment.confirmed)
      .map((assignment) => ({ service, assignment })),
  )
}

export function calculatePayrollWorkerRow(
  worker: Worker,
  services: ServiceJob[],
  month: string,
  storedStatus?: PayrollSummary['status'],
): PayrollSummary {
  const assignmentEntries = getPayrollAssignmentsByWorker(worker.id, services, month)
  const totalHours = assignmentEntries.reduce((sum, entry) => sum + entry.assignment.hoursWorked, 0)
  const totalExtras = assignmentEntries.reduce(
    (sum, entry) => sum + (entry.assignment.extraAmount ?? 0),
    0,
  )
  const totalDeductions = assignmentEntries.reduce(
    (sum, entry) => sum + (entry.assignment.deductions ?? 0),
    0,
  )
  const totalPay = assignmentEntries.reduce(
    (sum, entry) => sum + calculateAssignmentPay(entry.assignment),
    0,
  )
  const totalServices = new Set(assignmentEntries.map((entry) => entry.service.id)).size

  return {
    month,
    workerId: worker.id,
    totalServices,
    totalHours,
    totalExtras,
    totalDeductions,
    totalPay,
    status: storedStatus ?? (totalPay > 0 ? 'pending' : 'pending'),
  }
}

export function calculatePayrollMonthSummary(
  workers: Worker[],
  services: ServiceJob[],
  month: string,
  storedStatuses?: PayrollWorkerStatusMap,
) {
  const payableServices = getPayableServicesByMonth(services, month)
  const activeWorkers = workers.filter((worker) => worker.status === 'active')
  const payableWorkerIds = new Set(
    payableServices.flatMap((service) =>
      service.assignments.filter((assignment) => assignment.confirmed).map((assignment) => assignment.workerId),
    ),
  )
  const visibleWorkers = workers.filter(
    (worker) => activeWorkers.some((activeWorker) => activeWorker.id === worker.id) || payableWorkerIds.has(worker.id),
  )

  return visibleWorkers.map((worker) =>
    calculatePayrollWorkerRow(worker, services, month, storedStatuses?.[worker.id]),
  )
}

export function calculatePayrollTotals(payrollRows: PayrollSummary[]) {
  return {
    totalPay: payrollRows.reduce((sum, row) => sum + row.totalPay, 0),
    totalHours: payrollRows.reduce((sum, row) => sum + row.totalHours, 0),
    totalServices: payrollRows.reduce((sum, row) => sum + row.totalServices, 0),
    totalExtras: payrollRows.reduce((sum, row) => sum + row.totalExtras, 0),
    totalDeductions: payrollRows.reduce((sum, row) => sum + row.totalDeductions, 0),
    workersCount: payrollRows.filter((row) => row.totalPay > 0).length,
  }
}

export function getPayrollIncludedServices(services: ServiceJob[], month: string) {
  return getPayableServicesByMonth(services, month)
}

export function getPayrollWorkerServiceBreakdown(
  workerId: string,
  services: ServiceJob[],
  clients: Client[],
  properties: Property[],
  month: string,
) {
  return getPayableServicesByMonth(services, month)
    .flatMap((service) =>
      service.assignments
        .filter((assignment) => assignment.workerId === workerId && assignment.confirmed)
        .map((assignment) => ({
          service,
          assignment,
          client: clients.find((client) => client.id === service.clientId),
          property: properties.find((property) => property.id === service.propertyId),
          assignmentPay: calculateAssignmentPay(assignment),
        })),
    )
    .sort((left, right) => right.service.date.localeCompare(left.service.date))
}

export function getWorkersWithPayableActivity(
  workers: Worker[],
  services: ServiceJob[],
  month: string,
) {
  const activeIds = new Set(
    getPayableServicesByMonth(services, month).flatMap((service) =>
      service.assignments.filter((assignment) => assignment.confirmed).map((assignment) => assignment.workerId),
    ),
  )

  return workers.filter((worker) => activeIds.has(worker.id))
}

export function getPayrollWarningsCount(warnings: WarningItem[]) {
  return warnings.filter((warning) => warning.level !== 'success').length
}

export function calculateMonthlyPayrollSummary(
  workers: Worker[],
  services: ServiceJob[],
  month: string,
): PayrollSummary[] {
  return calculatePayrollMonthSummary(workers, services, month)
}

export function calculateWorkerMonthlyHours(workerId: string, services: ServiceJob[], month: string) {
  return getPayrollAssignmentsByWorker(workerId, services, month).reduce(
    (sum, entry) => sum + entry.assignment.hoursWorked,
    0,
  )
}

export function calculateWorkerMonthlyPay(workerId: string, services: ServiceJob[], month: string) {
  return getPayrollAssignmentsByWorker(workerId, services, month).reduce(
    (sum, entry) => sum + calculateAssignmentPay(entry.assignment),
    0,
  )
}

export function buildPayrollMonthSnapshot(
  payrollRows: PayrollSummary[],
  warnings: WarningItem[],
  month: string,
) {
  const totals = calculatePayrollTotals(payrollRows)

  return {
    month,
    totalPay: totals.totalPay,
    totalHours: totals.totalHours,
    totalServices: totals.totalServices,
    workerRows: payrollRows.map((row) => ({
      workerId: row.workerId,
      totalPay: row.totalPay,
      totalHours: row.totalHours,
      totalServices: row.totalServices,
      status: row.status,
    })),
    warningsCount: getPayrollWarningsCount(warnings),
    createdAt: new Date().toISOString(),
  }
}

export function getPayrollRowSummaryText(row: PayrollSummary) {
  return `${row.totalServices} servicios · ${row.totalHours.toFixed(1)} h · ${formatMoney(row.totalPay)}`
}
