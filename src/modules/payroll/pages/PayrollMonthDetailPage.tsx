import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../../../components/ui/PageHeader'
import { StatusPill } from '../../../components/ui/StatusPill'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { buildHourEntries } from '../../hours/services/hourEntryBuilder'
import { PayrollActions } from '../components/PayrollActions'
import { PayrollAuditTrail } from '../components/PayrollAuditTrail'
import { PayrollLockPanel } from '../components/PayrollLockPanel'
import { PayrollMonthHeader } from '../components/PayrollMonthHeader'
import { PayrollMonthSelector } from '../components/PayrollMonthSelector'
import { PayrollSummaryCard } from '../components/PayrollSummaryCard'
import { PayrollWarningsPanel } from '../components/PayrollWarningsPanel'
import { PayrollWorkerDetail } from '../components/PayrollWorkerDetail'
import {
  buildPayrollMonthSnapshot,
  calculatePayrollMonthSummary,
  calculatePayrollTotals,
  getCurrentPayrollMonth,
  getPayrollMonthLabel,
  getPayrollWorkerServiceBreakdown,
  isValidPayrollMonth,
} from '../services/payrollCalculations'
import { createPayrollAuditEntry } from '../services/payrollStorage'
import {
  getPayrollMonthBlockingWarnings,
  getPayrollWarnings,
  getPayrollWorkerWarnings,
} from '../services/payrollWarnings'

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
    monthState.lockedSnapshot &&
    (totals.totalServices !== monthState.lockedSnapshot.totalServices ||
      Number(totals.totalHours.toFixed(2)) !== Number(monthState.lockedSnapshot.totalHours.toFixed(2)) ||
      Number(totals.totalPay.toFixed(2)) !== Number(monthState.lockedSnapshot.totalPay.toFixed(2)))
      ? {
          level: 'warning' as const,
          title: 'Drift detectado tras el bloqueo',
          message:
            'Los totales actuales del mes ya no coinciden con la foto bloqueada del cierre. Revisa servicios, horas y pago antes de confiar en este mes.',
          entityLabel: month,
        }
      : null
  const allWarnings = lockDriftWarning ? [lockDriftWarning, ...warnings] : warnings
  const reviewEntries = buildHourEntries(services, workers, clients, properties, { [month]: monthState }).filter(
    (entry) =>
      entry.payrollMonth === month &&
      (entry.hourStatus === 'pending_review' || entry.hourStatus === 'issue' || entry.hourStatus === 'excluded'),
  )

  const addAudit = (action: string, message: string, metadata?: Record<string, string>) => {
    repositories.payroll.addPayrollAuditEntry(
      month,
      createPayrollAuditEntry(month, action, message, metadata),
    )
  }

  const handleMarkReviewed = () => {
    repositories.payroll.updatePayrollMonthStatus(month, 'reviewed')
    addAudit('Mes revisado', `El cierre de ${getPayrollMonthLabel(month)} se marco como revisado.`)
    setRefreshKey((value) => value + 1)
  }

  const handleMarkPaid = () => {
    repositories.payroll.updatePayrollMonthStatus(month, 'paid')
    payrollRows.forEach((row) => {
      repositories.payroll.updatePayrollWorkerStatus(month, row.workerId, 'paid')
    })
    addAudit('Mes pagado', `El cierre de ${getPayrollMonthLabel(month)} se marco como pagado internamente.`)
    setRefreshKey((value) => value + 1)
  }

  const handleLock = () => {
    const snapshot = buildPayrollMonthSnapshot(payrollRows, warnings, month)
    repositories.payroll.lockPayrollMonth(month, snapshot)
    addAudit('Cierre bloqueado', `El cierre de ${getPayrollMonthLabel(month)} quedo bloqueado en localStorage.`)
    setRefreshKey((value) => value + 1)
  }

  return (
    <div className="page-stack">
      {!isValidPayrollMonth(routeMonth) ? (
        <WarningBanner title="Mes ajustado" compact tone="warning">
          El parametro recibido no era valido. Se ha cargado {getPayrollMonthLabel(month)}.
        </WarningBanner>
      ) : null}

      <PageHeader
        eyebrow="Cierres"
        title={getPayrollMonthLabel(month)}
        description="Resumen mensual de seguimiento interno, estado de revision y control de bloqueo operativo."
        meta={<StatusPill tone="info">Seguimiento interno</StatusPill>}
        primaryAction={
          <Link className="button button--primary" to="/hours/review">
            Revisar horas
          </Link>
        }
      />

      <WarningBanner title="Fuente del cierre" tone="info">
        El cierre se alimenta de horas confirmadas en servicios completados, revisados o cerrados.
      </WarningBanner>

      {reviewEntries.length > 0 ? (
        <WarningBanner title="Entradas pendientes para este cierre" tone="warning">
          Hay {reviewEntries.length} entradas que siguen pendientes, con incidencia o excluidas. Conviene resolverlas en /hours/review antes de marcar este mes como pagado o bloquearlo.
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
