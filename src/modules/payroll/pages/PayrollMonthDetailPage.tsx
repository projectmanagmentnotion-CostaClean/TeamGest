import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../../../components/ui/PageHeader'
import { StatusPill } from '../../../components/ui/StatusPill'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { buildHourEntries } from '../../hours/services/hourEntryBuilder'
import { getAppSettings } from '../../settings/services/appSettingsService'
import { MonthlyClosureSummaryCards } from '../components/MonthlyClosureSummaryCards'
import { PayrollActions } from '../components/PayrollActions'
import { PayrollAuditTrail } from '../components/PayrollAuditTrail'
import { PayrollLockPanel } from '../components/PayrollLockPanel'
import { PayrollMonthSelector } from '../components/PayrollMonthSelector'
import { PayrollWarningsPanel } from '../components/PayrollWarningsPanel'
import { WorkerClosureCardGrid } from '../components/WorkerClosureCardGrid'
import { buildMonthlyClosureCards, buildMonthlyClosureSummary } from '../services/monthlyClosureBuilder'
import {
  markWorkerClosurePaid,
  markWorkerClosureReviewed,
  revertWorkerClosurePaid,
} from '../services/monthlyClosureActions'
import {
  buildPayrollMonthSnapshot,
  getCurrentPayrollMonth,
  getPayrollMonthLabel,
  isValidPayrollMonth,
} from '../services/payrollCalculations'
import { createPayrollAuditEntry } from '../services/payrollStorage'
import { getPayrollMonthBlockingWarnings, getPayrollWarnings } from '../services/payrollWarnings'
import { formatPayrollStatusLabel } from '../../../utils/labels'

export function PayrollMonthDetailPage() {
  const appSettings = getAppSettings()
  const { month: routeMonth } = useParams()
  const [, setRefreshKey] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const repositories = getRepositories()
  const month = isValidPayrollMonth(routeMonth) ? routeMonth! : getCurrentPayrollMonth()
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
    settings: appSettings,
  })
  const summary = buildMonthlyClosureSummary(month, cards)
  const warnings = getPayrollWarnings(workers, services, month)
  const blockingWarnings = getPayrollMonthBlockingWarnings(workers, services, month)
  const auditTrail = repositories.payroll.getPayrollAuditTrail(month)
  const reviewEntries = entries.filter(
    (entry) =>
      entry.payrollMonth === month &&
      (entry.hourStatus === 'pending_review' || entry.hourStatus === 'issue' || entry.hourStatus === 'excluded'),
  )
  const reviewBlockingCount =
    appSettings.hourReviewSettings.requireReviewBeforePayrollClose && reviewEntries.length > 0
      ? reviewEntries.length
      : 0

  const refreshPage = (nextMessage?: string) => {
    setMessage(nextMessage ?? null)
    setRefreshKey((value) => value + 1)
  }

  const addAudit = (action: string, nextMessage: string, metadata?: Record<string, string>) => {
    repositories.payroll.addPayrollAuditEntry(
      month,
      createPayrollAuditEntry(month, action, nextMessage, metadata),
    )
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

  const handleMarkReviewed = () => {
    repositories.payroll.updatePayrollMonthStatus(month, 'reviewed')
    addAudit('Mes revisado', `El cierre de ${getPayrollMonthLabel(month)} se marco como revisado.`)
    refreshPage(`El cierre de ${getPayrollMonthLabel(month)} quedo marcado como revisado.`)
  }

  const handleMarkPaid = () => {
    repositories.payroll.updatePayrollMonthStatus(month, 'paid')
    cards.forEach((card) => {
      repositories.payroll.updatePayrollWorkerStatus(month, card.workerId, 'paid')
    })
    addAudit('Mes pagado', `El cierre de ${getPayrollMonthLabel(month)} se marco como pagado internamente.`)
    refreshPage(`El cierre de ${getPayrollMonthLabel(month)} quedo marcado como pagado interno.`)
  }

  const handleLock = () => {
    const snapshot = buildPayrollMonthSnapshot(
      cards.map((card) => ({
        month,
        workerId: card.workerId,
        totalServices: card.serviceCount,
        totalHours: card.confirmedHours,
        totalExtras: 0,
        totalDeductions: 0,
        totalPay: card.totalPay,
        status: card.payrollStatus,
      })),
      warnings,
      month,
    )
    repositories.payroll.lockPayrollMonth(month, snapshot)
    addAudit(
      'Cierre bloqueado',
      `El cierre de ${getPayrollMonthLabel(month)} quedo bloqueado en el almacenamiento local del navegador.`,
    )
    refreshPage(`El cierre de ${getPayrollMonthLabel(month)} quedo bloqueado.`)
  }

  const readyCards = cards.filter((card) => card.readyToPay && !card.paid && !card.locked)
  const attentionCards = cards.filter((card) => card.pendingHours > 0 || card.issueCount > 0)
  const settledCards = cards.filter(
    (card) =>
      !readyCards.some((item) => item.workerId === card.workerId) &&
      !attentionCards.some((item) => item.workerId === card.workerId),
  )

  return (
    <div className="page-stack">
      {!isValidPayrollMonth(routeMonth) ? (
        <WarningBanner title="Mes ajustado" compact tone="warning">
          El parametro recibido no era valido. Se ha cargado {getPayrollMonthLabel(month)}.
        </WarningBanner>
      ) : null}

      <PageHeader
        eyebrow="Cierre mensual"
        title={getPayrollMonthLabel(month)}
        description="Vista individual por trabajador para revisar horas confirmadas, incidencias, pendientes y pago interno."
        meta={<StatusPill tone={monthState.status === 'locked' ? 'blocked' : 'info'}>{formatPayrollStatusLabel(monthState.status)}</StatusPill>}
        primaryAction={
          <Link className="button button--primary" to="/hours/review">
            Revisar horas
          </Link>
        }
        secondaryAction={
          <Link className="button button--secondary button--sm" to="/payroll">
            Volver a cierres
          </Link>
        }
      />

      {message ? (
        <WarningBanner title="Estado del cierre" tone="info">
          {message}
        </WarningBanner>
      ) : null}

      {summary.warnings.length > 0 ? (
        <WarningBanner title="Prioridades del cierre" tone="warning">
          {summary.warnings[0]}
        </WarningBanner>
      ) : null}

      {reviewBlockingCount > 0 ? (
        <WarningBanner title="Revision pendiente antes del cierre" tone="warning">
          Hay {reviewBlockingCount} entradas que siguen pendientes, con incidencia o excluidas en este mes.
          Conviene resolverlas desde /hours/review antes de dar pagos por listos.
        </WarningBanner>
      ) : null}

      <PayrollMonthSelector selectedMonth={month} />

      <MonthlyClosureSummaryCards
        summary={summary}
        statusLabel={formatPayrollStatusLabel(monthState.status)}
      />

      <PayrollActions state={monthState} onMarkReviewed={handleMarkReviewed} onMarkPaid={handleMarkPaid} />

      <WorkerClosureCardGrid
        title="Trabajadores listos para pagar"
        description="Sin pendientes ni incidencias activas en el mes."
        emptyTitle="Sin trabajadores listos"
        emptyDescription="Todavia no hay trabajadores completamente listos para pago interno."
        cards={readyCards}
        month={month}
        onMarkReviewed={handleWorkerReviewed}
        onMarkPaid={handleWorkerPaid}
        onRevertPaid={handleWorkerPaidRevert}
      />

      <WorkerClosureCardGrid
        title="Trabajadores con pendientes o incidencias"
        description="Necesitan revision antes de marcar el pago interno."
        emptyTitle="Sin incidencias activas"
        emptyDescription="No hay trabajadores con pendientes o incidencias en este cierre."
        cards={attentionCards}
        month={month}
        onMarkReviewed={handleWorkerReviewed}
        onMarkPaid={handleWorkerPaid}
        onRevertPaid={handleWorkerPaidRevert}
      />

      <WorkerClosureCardGrid
        title="Trabajadores revisados, pagados o sin actividad bloqueante"
        description="Seguimiento del estado interno final dentro del mes."
        emptyTitle="Sin trabajadores en esta seccion"
        emptyDescription="Todavia no hay trabajadores revisados o pagados para mostrar aqui."
        cards={settledCards}
        month={month}
        onMarkReviewed={handleWorkerReviewed}
        onMarkPaid={handleWorkerPaid}
        onRevertPaid={handleWorkerPaidRevert}
      />

      <section className="dashboard-grid">
        <PayrollWarningsPanel warnings={warnings} />
        <PayrollLockPanel
          blockingWarningsCount={blockingWarnings.length + reviewBlockingCount}
          onLock={handleLock}
          snapshot={monthState.lockedSnapshot}
          state={monthState}
        />
      </section>

      <section className="page-stack">
        <div className="section-header__content">
          <h3>Auditoria y cierre</h3>
          <p>Historial interno del seguimiento mensual y de los cambios de estado aplicados.</p>
        </div>
        <PayrollAuditTrail entries={auditTrail} />
      </section>
    </div>
  )
}
