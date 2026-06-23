import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { HourEntryFilters } from '../../../domain/hours/hourEntry.types'
import { PageHeader } from '../../../components/ui/PageHeader'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { getMonthKey } from '../../../utils/dates'
import { HourEntryCard } from '../components/HourEntryCard'
import { HourEntryFilters as HourFiltersCard } from '../components/HourEntryFilters'
import { HoursEmptyState } from '../components/HoursEmptyState'
import { HourSummaryCards } from '../components/HourSummaryCards'
import { HourWarningsPanel } from '../components/HourWarningsPanel'
import { calculateHourEntrySummary } from '../services/hourCalculations'
import { buildHourEntries } from '../services/hourEntryBuilder'
import { filterHourEntries } from '../services/hourFilters'
import { getHoursModuleWarnings } from '../services/hourWarnings'

function buildMonthStateMap(
  months: string[],
  getPayrollMonthState: ReturnType<typeof getRepositories>['payroll']['getPayrollMonthState'],
) {
  return Object.fromEntries(months.map((month) => [month, getPayrollMonthState(month)]))
}

export function HoursPage() {
  const repositories = getRepositories()
  const workers = repositories.workers.listWorkers()
  const clients = repositories.clients.listClients()
  const properties = repositories.properties.listProperties()
  const services = repositories.services.listServices()
  const months = [...new Set(services.map((service) => service.date.slice(0, 7)))]
  const payrollStates = buildMonthStateMap(months, repositories.payroll.getPayrollMonthState)
  const entries = buildHourEntries(services, workers, clients, properties, payrollStates)
  const [filters, setFilters] = useState<HourEntryFilters>({
    month: getMonthKey(new Date().toISOString()),
    workerId: '',
    propertyId: '',
    clientId: '',
    status: 'all',
    confirmation: 'all',
  })
  const visibleEntries = filterHourEntries(entries, filters)
  const summary = calculateHourEntrySummary(visibleEntries)
  const warnings = getHoursModuleWarnings(visibleEntries)

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Horas"
        title="Control de horas"
        description="Revisa horas trabajadas, importes por trabajador y lo que entra al cierre mensual."
        primaryAction={
          <Link className="button button--primary" to="/quick-entry">
            Registrar horas
          </Link>
        }
        secondaryAction={
          <Link className="button button--secondary button--sm" to="/hours/review">
            Revisar pendientes
          </Link>
        }
      />

      <WarningBanner title="Modelo derivado" tone="info">
        Este control se deriva de servicios y asignaciones existentes. No crea una entidad persistida nueva para horas en este bloque.
      </WarningBanner>

      <HourSummaryCards summary={summary} />

      <section className="dashboard-grid">
        <HourFiltersCard
          filters={filters}
          onChange={setFilters}
          workers={workers.map((worker) => ({ label: worker.name, value: worker.id }))}
          properties={properties.map((property) => ({ label: property.name, value: property.id }))}
          clients={clients.map((client) => ({ label: client.name, value: client.id }))}
        />
        <HourWarningsPanel warnings={warnings} />
      </section>

      {visibleEntries.length === 0 ? (
        <HoursEmptyState
          title="Sin horas para este filtro"
          description="Prueba otro mes, estado o responsable para revisar mas actividad."
          action={
            <Link className="button button--primary" to="/quick-entry">
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
