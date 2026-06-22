import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { HourEntryFilters as HourEntryFiltersValue } from '../../../domain/hours/hourEntry.types'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageHeader } from '../../../components/ui/PageHeader'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { getMonthKey } from '../../../utils/dates'
import { HourEntryCard } from '../components/HourEntryCard'
import { HourEntryFilters } from '../components/HourEntryFilters'
import { WorkerHoursSummary } from '../components/WorkerHoursSummary'
import { calculateWorkerHourSummary } from '../services/hourCalculations'
import { buildHourEntries } from '../services/hourEntryBuilder'
import { filterHourEntries } from '../services/hourFilters'

function buildMonthStateMap(
  months: string[],
  getPayrollMonthState: ReturnType<typeof getRepositories>['payroll']['getPayrollMonthState'],
) {
  return Object.fromEntries(months.map((month) => [month, getPayrollMonthState(month)]))
}

export function WorkerHoursPage() {
  const { workerId } = useParams()
  const repositories = getRepositories()
  const workers = repositories.workers.listWorkers()
  const worker = workers.find((item) => item.id === workerId)
  const clients = repositories.clients.listClients()
  const properties = repositories.properties.listProperties()
  const services = repositories.services.listServices()
  const months = [...new Set(services.map((service) => service.date.slice(0, 7)))]
  const payrollStates = buildMonthStateMap(months, repositories.payroll.getPayrollMonthState)
  const entries = buildHourEntries(services, workers, clients, properties, payrollStates)
  const [filters, setFilters] = useState<HourEntryFiltersValue>({
    month: getMonthKey(new Date().toISOString()),
    workerId: workerId ?? '',
    propertyId: '',
    clientId: '',
    status: 'all',
    confirmation: 'all',
  })

  if (!worker) {
    return (
      <div className="page-stack">
        <EmptyState
          title="Trabajador no encontrado"
          description="No se pudo resolver el trabajador solicitado en el control de horas."
          action={
            <Link className="button button--secondary button--sm" to="/hours">
              Volver a horas
            </Link>
          }
        />
      </div>
    )
  }

  const visibleEntries = filterHourEntries(entries, filters)
  const summary = calculateWorkerHourSummary(worker.id, visibleEntries)

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Horas"
        title="Horas por trabajador"
        description="Resumen individual de horas, confirmaciones y pago estimado."
        primaryAction={
          <Link className="button button--primary" to={`/quick-entry?workerId=${worker.id}`}>
            Registrar horas para este trabajador
          </Link>
        }
        secondaryAction={
          <Link className="button button--secondary button--sm" to={`/workers/${worker.id}`}>
            Volver a ficha
          </Link>
        }
      />

      <section className="dashboard-grid">
        <WorkerHoursSummary worker={worker} summary={summary} />
        <HourEntryFilters
          filters={filters}
          onChange={setFilters}
          workers={workers.map((item) => ({ label: item.name, value: item.id }))}
          properties={properties.map((property) => ({ label: property.name, value: property.id }))}
          clients={clients.map((client) => ({ label: client.name, value: client.id }))}
        />
      </section>

      {visibleEntries.length === 0 ? (
        <EmptyState
          title="Sin horas para este trabajador"
          description="No hay entradas que coincidan con el filtro actual."
          action={
            <Link className="button button--primary" to={`/quick-entry?workerId=${worker.id}`}>
              Registrar horas
            </Link>
          }
        />
      ) : (
        <section className="stack-list">
          {visibleEntries.map((entry) => (
            <HourEntryCard key={entry.id} entry={entry} />
          ))}
        </section>
      )}
    </div>
  )
}
