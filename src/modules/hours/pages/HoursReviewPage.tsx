import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { PageHeader } from '../../../components/ui/PageHeader'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { HourEntryCard } from '../components/HourEntryCard'
import { HoursEmptyState } from '../components/HoursEmptyState'
import { buildHourEntries } from '../services/hourEntryBuilder'
import { confirmHourEntry } from '../services/hourMutations'

function buildMonthStateMap(
  months: string[],
  getPayrollMonthState: ReturnType<typeof getRepositories>['payroll']['getPayrollMonthState'],
) {
  return Object.fromEntries(months.map((month) => [month, getPayrollMonthState(month)]))
}

export function HoursReviewPage() {
  const [, setRefreshKey] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const repositories = getRepositories()
  const workers = repositories.workers.listWorkers()
  const clients = repositories.clients.listClients()
  const properties = repositories.properties.listProperties()
  const services = repositories.services.listServices()
  const months = [...new Set(services.map((service) => service.date.slice(0, 7)))]
  const payrollStates = buildMonthStateMap(months, repositories.payroll.getPayrollMonthState)
  const entries = buildHourEntries(services, workers, clients, properties, payrollStates)
  const reviewEntries = entries.filter(
    (entry) =>
      entry.hourStatus === 'pending_review' ||
      entry.hourStatus === 'issue' ||
      entry.hourStatus === 'excluded',
  )

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Horas"
        title="Revisión de horas"
        description="Concentra entradas pendientes, incidencias y exclusiones antes del cierre mensual."
        primaryAction={
          <Link className="button button--primary" to="/quick-entry">
            Registrar horas
          </Link>
        }
        secondaryAction={
          <Link className="button button--secondary button--sm" to="/hours">
            Volver al control
          </Link>
        }
      />

      {message ? (
        <WarningBanner title="Resultado de la revisión" tone="info">
          {message}
        </WarningBanner>
      ) : null}

      {reviewEntries.length === 0 ? (
        <HoursEmptyState
          title="Sin horas pendientes de revisión"
          description="No hay entradas con incidencias o confirmaciones pendientes en los datos actuales."
          action={
            <Link className="button button--secondary button--sm" to="/hours">
              Ver control completo
            </Link>
          }
        />
      ) : (
        <section className="stack-list">
          {reviewEntries.map((entry) => (
            <HourEntryCard
              key={entry.id}
              entry={entry}
              action={
                entry.hourStatus === 'pending_review' && !entry.isLocked ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      const result = confirmHourEntry(entry, repositories.services)
                      setMessage(result.error ?? 'Horas confirmadas para cierre mensual.')
                      if (result.success) {
                        setRefreshKey((value) => value + 1)
                      }
                    }}
                  >
                    Confirmar horas
                  </Button>
                ) : null
              }
            />
          ))}
        </section>
      )}
    </div>
  )
}
