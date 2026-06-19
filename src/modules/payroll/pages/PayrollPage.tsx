import { Link } from 'react-router-dom'
import { StatCard } from '../../../components/ui/StatCard'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import {
  calculatePayrollMonthSummary,
  calculatePayrollTotals,
  getCurrentPayrollMonth,
  getPayrollIncludedServices,
  getPayrollWarningsCount,
} from '../services/payrollCalculations'
import { getPayrollWarnings } from '../services/payrollWarnings'
import { PayrollMonthSelector } from '../components/PayrollMonthSelector'
import { PayrollSummaryCard } from '../components/PayrollSummaryCard'
import { PayrollWorkerRow } from '../components/PayrollWorkerRow'

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

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Cierres</p>
          <h1>Cierres</h1>
          <p className="page-description">
            Control mensual operativo de payroll basado en horas confirmadas y estados internos de revisión.
          </p>
        </div>
      </section>

      <PayrollMonthSelector selectedMonth={month} />

      <section className="stats-grid">
        <StatCard label="Total a pagar" value={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totals.totalPay)} hint="Estimación operativa del mes." tone="info" />
        <StatCard label="Total horas" value={`${totals.totalHours.toFixed(1)} h`} hint="Horas confirmadas incluidas en payroll." tone="info" />
        <StatCard label="Trabajadores con pago" value={totals.workersCount.toString()} hint="Trabajadores con actividad pagable." tone="success" />
        <StatCard label="Servicios incluidos" value={includedServices.length.toString()} hint="Servicios completados, revisados o cerrados." tone="info" />
        <StatCard label="Incidencias abiertas" value={getPayrollWarningsCount(warnings).toString()} hint="Alertas que requieren revisión antes del cierre." tone="warning" />
      </section>

      <WarningBanner title="Cálculo operativo" tone="info">
        Los importes son estimaciones operativas basadas en horas confirmadas. No ejecutan pagos reales.
      </WarningBanner>

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

      <Link className="button button--primary" to={`/payroll/${month}`}>
        Ver detalle del mes
      </Link>
    </div>
  )
}
