import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { HourEntryFilters as HourEntryFiltersValue } from '../../../domain/hours/hourEntry.types'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageHeader } from '../../../components/ui/PageHeader'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { getMonthKey } from '../../../utils/dates'
import { HourEntryCard } from '../components/HourEntryCard'
import { HourEntryFilters } from '../components/HourEntryFilters'
import { PropertyHoursSummary } from '../components/PropertyHoursSummary'
import { calculatePropertyHourSummary } from '../services/hourCalculations'
import { buildHourEntries } from '../services/hourEntryBuilder'
import { filterHourEntries } from '../services/hourFilters'

function buildMonthStateMap(
  months: string[],
  getPayrollMonthState: ReturnType<typeof getRepositories>['payroll']['getPayrollMonthState'],
) {
  return Object.fromEntries(months.map((month) => [month, getPayrollMonthState(month)]))
}

export function PropertyHoursPage() {
  const { propertyId } = useParams()
  const repositories = getRepositories()
  const workers = repositories.workers.listWorkers()
  const clients = repositories.clients.listClients()
  const properties = repositories.properties.listProperties()
  const property = properties.find((item) => item.id === propertyId)
  const services = repositories.services.listServices()
  const months = [...new Set(services.map((service) => service.date.slice(0, 7)))]
  const payrollStates = buildMonthStateMap(months, repositories.payroll.getPayrollMonthState)
  const entries = buildHourEntries(services, workers, clients, properties, payrollStates)
  const [filters, setFilters] = useState<HourEntryFiltersValue>({
    month: getMonthKey(new Date().toISOString()),
    workerId: '',
    propertyId: propertyId ?? '',
    clientId: '',
    status: 'all',
    confirmation: 'all',
  })

  if (!property) {
    return (
      <div className="page-stack">
        <EmptyState
          title="Inmueble no encontrado"
          description="No se pudo resolver el inmueble solicitado en el control de horas."
          action={
            <Link className="button button--secondary button--sm" to="/hours">
              Volver a horas
            </Link>
          }
        />
      </div>
    )
  }

  const client = clients.find((item) => item.id === property.clientId)
  const visibleEntries = filterHourEntries(entries, filters)
  const summary = calculatePropertyHourSummary(property.id, visibleEntries)
  const workersInvolved = new Set(visibleEntries.map((entry) => entry.workerId)).size

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Horas"
        title="Horas por inmueble"
        description="Actividad, responsables y coste horario vinculado al inmueble."
        primaryAction={
          <Link className="button button--primary" to={`/quick-entry?propertyId=${property.id}`}>
            Registrar horas en este inmueble
          </Link>
        }
        secondaryAction={
          <Link className="button button--secondary button--sm" to={`/properties/${property.id}`}>
            Volver a ficha
          </Link>
        }
      />

      <section className="dashboard-grid">
        <PropertyHoursSummary
          property={property}
          client={client}
          summary={summary}
          workersInvolved={workersInvolved}
        />
        <HourEntryFilters
          filters={filters}
          onChange={setFilters}
          workers={workers.map((item) => ({ label: item.name, value: item.id }))}
          properties={properties.map((item) => ({ label: item.name, value: item.id }))}
          clients={clients.map((item) => ({ label: item.name, value: item.id }))}
        />
      </section>

      {visibleEntries.length === 0 ? (
        <EmptyState
          title="Sin horas para este inmueble"
          description="No hay entradas que coincidan con el filtro actual."
          action={
            <Link className="button button--primary" to={`/quick-entry?propertyId=${property.id}`}>
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
