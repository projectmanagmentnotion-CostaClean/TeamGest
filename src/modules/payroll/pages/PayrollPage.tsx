import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../../components/ui/PageHeader'
import { StatusPill } from '../../../components/ui/StatusPill'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { buildHourEntries } from '../../hours/services/hourEntryBuilder'
import { getAppSettings } from '../../settings/services/appSettingsService'
import { MonthlyClosureSummaryCards } from '../components/MonthlyClosureSummaryCards'
import { PayrollMonthSelector } from '../components/PayrollMonthSelector'
import { WorkerClosureCardGrid } from '../components/WorkerClosureCardGrid'
import { buildMonthlyClosureCards, buildMonthlyClosureSummary } from '../services/monthlyClosureBuilder'
import {
  markWorkerClosurePaid,
  markWorkerClosureReviewed,
  revertWorkerClosurePaid,
} from '../services/monthlyClosureActions'
import { getCurrentPayrollMonth, getPayrollMonthLabel } from '../services/payrollCalculations'
import { formatPayrollStatusLabel } from '../../../utils/labels'

export function PayrollPage() {
  const [, setRefreshKey] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const settings = getAppSettings()
  const repositories = getRepositories()
  const month = getCurrentPayrollMonth()
  const workers = repositories.workers.listWorkers()
  const services = repositories.services.listServices()
  const clients = repositories.clients.listClients()
  const properties = repositories.properties.listProperties()
  const monthState = repositories.payroll.getPayrollMonthState(month)
  const entries = buildHourEntries(services, workers, clients, properties, { [month]: monthState })
  const cards = buildMonthlyClosureCards({
    month,
    workers,
    entries,
    monthState,
    settings,
  })
  const summary = buildMonthlyClosureSummary(month, cards)
  const attentionCards = cards.filter((card) => card.pendingHours > 0 || card.issueCount > 0).slice(0, 4)
  const readyCards = cards.filter((card) => card.readyToPay && !card.paid && !card.locked).slice(0, 4)

  const refreshPage = (nextMessage: string) => {
    setMessage(nextMessage)
    setRefreshKey((value) => value + 1)
  }

  const handleWorkerReviewed = (workerId: string) => {
    const worker = workers.find((item) => item.id === workerId)
    if (!worker) {
      return
    }

    markWorkerClosureReviewed(repositories.payroll, month, workerId, worker.name)
    refreshPage(`${worker.name} quedo marcado como revisado.`)
  }

  const handleWorkerPaid = (workerId: string) => {
    const worker = workers.find((item) => item.id === workerId)
    if (!worker) {
      return
    }

    markWorkerClosurePaid(repositories.payroll, month, workerId, worker.name)
    refreshPage(`${worker.name} quedo marcado como pagado internamente.`)
  }

  const handleWorkerPaidRevert = (workerId: string) => {
    const worker = workers.find((item) => item.id === workerId)
    if (!worker) {
      return
    }

    revertWorkerClosurePaid(repositories.payroll, month, workerId, worker.name)
    refreshPage(`Se revirtio el estado pagado de ${worker.name}.`)
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Cierres"
        title="Seguimiento mensual por trabajador"
        description={`Control del cierre de ${getPayrollMonthLabel(month)} para saber quien esta listo, quien necesita revision y cuanto queda por pagar internamente.`}
        meta={<StatusPill tone={monthState.status === 'locked' ? 'blocked' : 'info'}>{formatPayrollStatusLabel(monthState.status)}</StatusPill>}
        primaryAction={
          <Link className="button button--primary" to={`/payroll/${month}`}>
            Abrir cierre del mes
          </Link>
        }
        secondaryAction={
          <Link className="button button--secondary button--sm" to="/hours/review">
            Revisar horas
          </Link>
        }
      />

      {message ? (
        <WarningBanner title="Estado del cierre" tone="info">
          {message}
        </WarningBanner>
      ) : null}

      <PayrollMonthSelector selectedMonth={month} />

      <MonthlyClosureSummaryCards
        summary={summary}
        statusLabel={formatPayrollStatusLabel(monthState.status)}
      />

      <WarningBanner title="Pago interno" tone="info">
        Esta vista organiza el seguimiento interno por trabajador. No genera exportes ni ejecuta pagos reales.
      </WarningBanner>

      <WorkerClosureCardGrid
        title="Requieren atencion inmediata"
        description="Trabajadores con pendientes o incidencias visibles en el cierre actual."
        emptyTitle="Sin bloqueos visibles"
        emptyDescription="No hay trabajadores con pendientes o incidencias en el mes actual."
        cards={attentionCards}
        month={month}
        onMarkReviewed={handleWorkerReviewed}
        onMarkPaid={handleWorkerPaid}
        onRevertPaid={handleWorkerPaidRevert}
      />

      <WorkerClosureCardGrid
        title="Listos para pago interno"
        description="Vista rapida de quienes ya pueden pasar al siguiente paso del cierre."
        emptyTitle="Sin trabajadores listos"
        emptyDescription="Todavia no hay trabajadores completamente listos para pago interno en este mes."
        cards={readyCards}
        month={month}
        onMarkReviewed={handleWorkerReviewed}
        onMarkPaid={handleWorkerPaid}
        onRevertPaid={handleWorkerPaidRevert}
      />

      <div className="quick-actions">
        <Link className="button button--secondary" to={`/payroll/${month}`}>
          Ver cierre completo del mes
        </Link>
      </div>
    </div>
  )
}
