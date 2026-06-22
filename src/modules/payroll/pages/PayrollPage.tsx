import { Link } from 'react-router-dom'
import { MetricGrid } from '../../../components/ui/MetricGrid'
import { PageHeader } from '../../../components/ui/PageHeader'
import { StatusPill } from '../../../components/ui/StatusPill'
import { StatCard } from '../../../components/ui/StatCard'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { buildHourEntries } from '../../hours/services/hourEntryBuilder'
import { PayrollMonthSelector } from '../components/PayrollMonthSelector'
import { PayrollSummaryCard } from '../components/PayrollSummaryCard'
import { PayrollWorkerRow } from '../components/PayrollWorkerRow'
import {
  calculatePayrollMonthSummary,
  calculatePayrollTotals,
  getCurrentPayrollMonth,
  getPayrollIncludedServices,
  getPayrollWarningsCount,
} from '../services/payrollCalculations'
import { getPayrollWarnings } from '../services/payrollWarnings'

export function PayrollPage() {
  const repositories = getRepositories()
  const month = getCurrentPayrollMonth()
  const workers = repositories.workers.listWorkers()
  const services = repositories.services.listServices()
  const monthState = repositories.payroll.getPayrollMonthState(month)
  const payrollRows = calculatePayrollMonthSummary(
    workers,
    services,
    month,
    monthState.workerStatuses,
  )
  const totals = calculatePayrollTotals(payrollRows)
  const warnings = getPayrollWarnings(workers, services, month)
  const includedServices = getPayrollIncludedServices(services, month)
  const reviewEntries = buildHourEntries(
    services,
    workers,
    repositories.clients.listClients(),
    repositories.properties.listProperties(),
    { [month]: monthState },
  ).filter(
    (entry) =>
      entry.payrollMonth === month &&
      (entry.hourStatus === 'pending_review' || entry.hourStatus === 'issue' || entry.hourStatus === 'excluded'),
  )

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Cierres"
        title="Seguimiento mensual"
        description="Control mensual operativo de payroll basado en horas confirmadas y estados internos de revision."
        meta={<StatusPill tone="info">Seguimiento interno</StatusPill>}
        primaryAction={
          <Link className="button button--primary" to="/hours/review">
            Revisar horas
          </Link>
        }
      />

      <PayrollMonthSelector selectedMonth={month} />

      <MetricGrid columns={5}>
        <StatCard label="Total a pagar" value={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totals.totalPay)} hint="Estimacion operativa del mes." tone="info" />
        <StatCard label="Total horas" value={`${totals.totalHours.toFixed(1)} h`} hint="Horas confirmadas incluidas en payroll." tone="info" />
        <StatCard label="Trabajadores con pago" value={totals.workersCount.toString()} hint="Trabajadores con actividad pagable." tone="success" />
        <StatCard label="Servicios incluidos" value={includedServices.length.toString()} hint="Servicios completados, revisados o cerrados." tone="info" />
        <StatCard label="Incidencias abiertas" value={getPayrollWarningsCount(warnings).toString()} hint="Alertas que requieren revision antes del cierre." tone="warning" />
      </MetricGrid>

      <WarningBanner title="Calculo operativo" tone="info">
        Los importes son estimaciones operativas basadas en horas confirmadas. No ejecutan pagos reales.
      </WarningBanner>

      <WarningBanner title="Fuente del cierre" tone="info">
        El cierre se alimenta de horas confirmadas en servicios completados, revisados o cerrados.
      </WarningBanner>

      {reviewEntries.length > 0 ? (
        <WarningBanner title="Revision pendiente antes del cierre" tone="warning">
          Hay {reviewEntries.length} entradas con incidencia, exclusion o confirmacion pendiente en este mes. Revisa /hours/review antes de cerrar.
        </WarningBanner>
      ) : null}

      <PayrollSummaryCard
        totalPay={totals.totalPay}
        totalHours={totals.totalHours}
        totalServices={totals.totalServices}
        totalExtras={totals.totalExtras}
        totalDeductions={totals.totalDeductions}
        workersCount={totals.workersCount}
        warningsCount={getPayrollWarningsCount(warnings)}
      />

      <section className="stack-list">
        {payrollRows.map((row) => (
          <PayrollWorkerRow
            key={row.workerId}
            row={row}
            worker={workers.find((worker) => worker.id === row.workerId)}
            warningCount={getPayrollWarnings(
              workers.filter((worker) => worker.id === row.workerId),
              services,
              month,
            ).length}
          />
        ))}
      </section>

      <Link className="button button--secondary" to={`/payroll/${month}`}>
        Ver detalle del mes
      </Link>
    </div>
  )
}
