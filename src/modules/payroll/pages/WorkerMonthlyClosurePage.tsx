import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageHeader } from '../../../components/ui/PageHeader'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { HourEntryCard } from '../../hours/components/HourEntryCard'
import { buildHourEntries } from '../../hours/services/hourEntryBuilder'
import { getAppSettings } from '../../settings/services/appSettingsService'
import { WorkerClosureCard } from '../components/WorkerClosureCard'
import { buildMonthlyClosureCards, buildWorkerMonthlyClosureDetail } from '../services/monthlyClosureBuilder'
import {
  markWorkerClosurePaid,
  markWorkerClosureReviewed,
  revertWorkerClosurePaid,
} from '../services/monthlyClosureActions'
import { getCurrentPayrollMonth, getPayrollMonthLabel, isValidPayrollMonth } from '../services/payrollCalculations'

export function WorkerMonthlyClosurePage() {
  const [, setRefreshKey] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const repositories = getRepositories()
  const settings = getAppSettings()
  const { month: routeMonth, workerId } = useParams()
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
    settings,
  })
  const detail = workerId
    ? buildWorkerMonthlyClosureDetail({
        workerId,
        cards,
        entries,
        month,
        monthState,
      })
    : null

  if (!detail) {
    return (
      <div className="page-stack">
        <PageHeader
          eyebrow="Cierres"
          title="Trabajador no disponible"
          description="No se encontro informacion de cierre para el trabajador solicitado."
          primaryAction={
            <Link className="button button--secondary" to={`/payroll/${month}`}>
              Volver al cierre mensual
            </Link>
          }
        />
        <EmptyState
          title="Sin detalle disponible"
          description="Revisa si el trabajador tiene actividad en este mes o vuelve al cierre mensual."
          icon="T"
        />
      </div>
    )
  }

  const refreshPage = (nextMessage: string) => {
    setMessage(nextMessage)
    setRefreshKey((value) => value + 1)
  }

  const handleWorkerReviewed = (targetWorkerId: string) => {
    const worker = workers.find((item) => item.id === targetWorkerId)
    if (!worker) {
      return
    }

    markWorkerClosureReviewed(repositories.payroll, month, targetWorkerId, worker.name)
    refreshPage(`${worker.name} quedo marcado como revisado.`)
  }

  const handleWorkerPaid = (targetWorkerId: string) => {
    const worker = workers.find((item) => item.id === targetWorkerId)
    if (!worker) {
      return
    }

    markWorkerClosurePaid(repositories.payroll, month, targetWorkerId, worker.name)
    refreshPage(`${worker.name} quedo marcado como pagado internamente.`)
  }

  const handleWorkerPaidRevert = (targetWorkerId: string) => {
    const worker = workers.find((item) => item.id === targetWorkerId)
    if (!worker) {
      return
    }

    revertWorkerClosurePaid(repositories.payroll, month, targetWorkerId, worker.name)
    refreshPage(`Se revirtio el estado pagado de ${worker.name}.`)
  }

  const renderGroup = (
    title: string,
    description: string,
    items: typeof detail.confirmedEntries,
  ) => {
    if (items.length === 0) {
      return null
    }

    return (
      <section className="page-stack">
        <div className="section-header__content">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="stack-list">
          {items.map((entry) => (
            <HourEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Cierres"
        title={`${detail.card.workerName} - ${getPayrollMonthLabel(month)}`}
        description="Detalle individual del cierre mensual para revisar horas, incidencias y pago interno."
        primaryAction={
          <Link className="button button--primary" to={`/hours/review?month=${month}&workerId=${detail.card.workerId}`}>
            Revisar horas
          </Link>
        }
        secondaryAction={
          <Link className="button button--secondary button--sm" to={`/payroll/${month}`}>
            Volver al cierre mensual
          </Link>
        }
      />

      {message ? (
        <WarningBanner title="Estado del trabajador" tone="info">
          {message}
        </WarningBanner>
      ) : null}

      {detail.card.locked ? (
        <WarningBanner title="Mes bloqueado" tone="blocked">
          Este detalle es informativo. El cierre mensual esta bloqueado y no admite cambios.
        </WarningBanner>
      ) : null}

      <WorkerClosureCard
        model={detail.card}
        month={month}
        onMarkReviewed={handleWorkerReviewed}
        onMarkPaid={handleWorkerPaid}
        onRevertPaid={handleWorkerPaidRevert}
      />

      {renderGroup(
        'Horas confirmadas',
        'Entradas que ya cuentan para el pago interno del mes.',
        detail.confirmedEntries,
      )}
      {renderGroup(
        'Horas pendientes',
        'Entradas que todavia necesitan revision antes de quedar listas.',
        detail.pendingEntries,
      )}
      {renderGroup(
        'Incidencias',
        'Entradas con problema operativo, tarifa o nota de incidencia.',
        detail.issueEntries,
      )}
      {renderGroup(
        'Excluidas',
        'Entradas visibles pero apartadas del calculo de pago.',
        detail.excludedEntries,
      )}
      {renderGroup(
        'Bloqueadas',
        'Entradas historicas dentro de un mes ya bloqueado.',
        detail.lockedEntries,
      )}
    </div>
  )
}
