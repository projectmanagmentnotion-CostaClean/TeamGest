import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { createPayrollAuditEntry } from '../services/payrollStorage'
import {
  buildPayrollMonthSnapshot,
  calculatePayrollMonthSummary,
  calculatePayrollTotals,
  getCurrentPayrollMonth,
  getPayrollMonthLabel,
  getPayrollWorkerServiceBreakdown,
  isValidPayrollMonth,
} from '../services/payrollCalculations'
import {
  getPayrollMonthBlockingWarnings,
  getPayrollWarnings,
  getPayrollWorkerWarnings,
} from '../services/payrollWarnings'
import { PayrollActions } from '../components/PayrollActions'
import { PayrollAuditTrail } from '../components/PayrollAuditTrail'
import { PayrollLockPanel } from '../components/PayrollLockPanel'
import { PayrollMonthHeader } from '../components/PayrollMonthHeader'
import { PayrollMonthSelector } from '../components/PayrollMonthSelector'
import { PayrollSummaryCard } from '../components/PayrollSummaryCard'
import { PayrollWarningsPanel } from '../components/PayrollWarningsPanel'
import { PayrollWorkerDetail } from '../components/PayrollWorkerDetail'

export function PayrollMonthDetailPage() {
  const { month: routeMonth } = useParams()
  const [, setRefreshKey] = useState(0)
  const repositories = getRepositories()
  const month = isValidPayrollMonth(routeMonth) ? routeMonth! : getCurrentPayrollMonth()
  const workers = repositories.workers.listWorkers()
  const services = repositories.services.listServices()
  const clients = repositories.clients.listClients()
  const properties = repositories.properties.listProperties()
  const monthState = repositories.payroll.getPayrollMonthState(month)
  const payrollRows = calculatePayrollMonthSummary(
    workers,
    services,
    month,
    monthState.workerStatuses,
  )
  const totals = calculatePayrollTotals(payrollRows)
  const warnings = getPayrollWarnings(workers, services, month)
  const blockingWarnings = getPayrollMonthBlockingWarnings(workers, services, month)
  const auditTrail = repositories.payroll.getPayrollAuditTrail(month)
  const lockDriftWarning =
    monthState.lockedSnapshot && totals.totalServices > monthState.lockedSnapshot.totalServices
      ? {
          level: 'warning' as const,
          title: 'Servicios nuevos tras el bloqueo',
          message:
            'Hay servicios pagables en el mes actual que no estaban incluidos cuando se bloqueó el cierre.',
          entityLabel: month,
        }
      : null
  const allWarnings = lockDriftWarning ? [lockDriftWarning, ...warnings] : warnings

  const addAudit = (action: string, message: string, metadata?: Record<string, string>) => {
    repositories.payroll.addPayrollAuditEntry(
      month,
      createPayrollAuditEntry(month, action, message, metadata),
    )
  }

  const handleMarkReviewed = () => {
    repositories.payroll.updatePayrollMonthStatus(month, 'reviewed')
    addAudit('Mes revisado', `El cierre de ${getPayrollMonthLabel(month)} se marcó como revisado.`)
    setRefreshKey((value) => value + 1)
  }

  const handleMarkPaid = () => {
    repositories.payroll.updatePayrollMonthStatus(month, 'paid')
    payrollRows.forEach((row) => {
      repositories.payroll.updatePayrollWorkerStatus(month, row.workerId, 'paid')
    })
    addAudit('Mes pagado', `El cierre de ${getPayrollMonthLabel(month)} se marcó como pagado internamente.`)
    setRefreshKey((value) => value + 1)
  }

  const handleLock = () => {
    const snapshot = buildPayrollMonthSnapshot(payrollRows, warnings, month)
    repositories.payroll.lockPayrollMonth(month, snapshot)
    addAudit('Cierre bloqueado', `El cierre de ${getPayrollMonthLabel(month)} quedó bloqueado en localStorage.`)
    setRefreshKey((value) => value + 1)
  }

  return (
    <div className="page-stack">
      {!isValidPayrollMonth(routeMonth) ? (
        <WarningBanner title="Mes ajustado" tone="warning">
          El parámetro recibido no era válido. Se ha cargado {getPayrollMonthLabel(month)}.
        </WarningBanner>
      ) : null}

      <PayrollMonthHeader month={month} state={monthState} />
      <PayrollMonthSelector selectedMonth={month} />

      <PayrollSummaryCard
        totalPay={totals.totalPay}
        totalHours={totals.totalHours}
        totalServices={totals.totalServices}
        totalExtras={totals.totalExtras}
        totalDeductions={totals.totalDeductions}
        workersCount={totals.workersCount}
        warningsCount={allWarnings.filter((warning) => warning.level !== 'success').length}
      />

      <PayrollActions state={monthState} onMarkReviewed={handleMarkReviewed} onMarkPaid={handleMarkPaid} />

      <section className="dashboard-grid">
        <PayrollWarningsPanel warnings={allWarnings} />
        <PayrollLockPanel
          blockingWarningsCount={blockingWarnings.length}
          onLock={handleLock}
          snapshot={monthState.lockedSnapshot}
          state={monthState}
        />
      </section>

      <section className="stack-list">
        {payrollRows.map((row) => {
          const worker = workers.find((item) => item.id === row.workerId)
          return (
            <PayrollWorkerDetail
              key={row.workerId}
              breakdown={getPayrollWorkerServiceBreakdown(row.workerId, services, clients, properties, month)}
              row={row}
              warnings={worker ? getPayrollWorkerWarnings(worker, services, month) : []}
              worker={worker}
            />
          )
        })}
      </section>

      <PayrollAuditTrail entries={auditTrail} />
    </div>
  )
}
