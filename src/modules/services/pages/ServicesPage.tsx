import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/ui/EmptyState'
import { StatCard } from '../../../components/ui/StatCard'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { formatMonthLabel, getMonthKey } from '../../../utils/dates'
import { formatMoney } from '../../../utils/money'
import { ServiceCard } from '../components/ServiceCard'
import {
  getServiceConfirmedHours,
  getServicesSummary,
  getServicesWithWarnings,
} from '../services/serviceCalculations'

export function ServicesPage() {
  const [filter, setFilter] = useState<
    'all' | 'draft' | 'scheduled' | 'completed' | 'reviewed' | 'closed' | 'with_warnings'
  >('all')
  const repositories = getRepositories()
  const services = repositories.services.listServices()
  const workers = repositories.workers.listWorkers()
  const properties = repositories.properties.listProperties()
  const clients = repositories.clients.listClients()
  const month = getMonthKey(new Date().toISOString())
  const monthLabel = formatMonthLabel(month)
  const summary = getServicesSummary(services, workers, properties, clients, month)
  const servicesWithWarnings = getServicesWithWarnings(services, workers, properties, clients)
  const visibleServices = summary.filter((item) => {
    if (filter === 'with_warnings') {
      return item.warnings.length > 0
    }
    if (filter === 'all') {
      return true
    }
    return item.service.status === filter
  })

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Servicios</p>
          <h1>Servicios</h1>
          <p className="page-description">
            Centro operativo del ciclo de servicio con asignaciones, coste laboral y estado para {monthLabel}.
          </p>
        </div>
        <Link className="button button--primary" to="/services/new">
          Nuevo servicio
        </Link>
      </section>

      <section className="stats-grid">
        <StatCard
          hint={`Servicios registrados en ${monthLabel}.`}
          label="Servicios este mes"
          tone="info"
          value={summary.length.toString()}
        />
        <StatCard
          hint="Servicios completados, revisados o cerrados."
          label="Servicios completados"
          tone="success"
          value={summary.filter((item) => ['completed', 'reviewed', 'closed'].includes(item.service.status)).length.toString()}
        />
        <StatCard
          hint="Coste laboral agregado del mes."
          label="Coste laboral estimado del mes"
          tone="info"
          value={formatMoney(summary.reduce((sum, item) => sum + item.laborCost, 0))}
        />
        <StatCard
          hint="Servicios con alertas operativas activas."
          label="Servicios con incidencias"
          tone="warning"
          value={servicesWithWarnings.length.toString()}
        />
      </section>

      <section className="filter-row">
        {[
          ['all', 'Todos'],
          ['draft', 'Borrador'],
          ['scheduled', 'Programados'],
          ['completed', 'Completados'],
          ['reviewed', 'Revisados'],
          ['closed', 'Cerrados'],
          ['with_warnings', 'Con incidencias'],
        ].map(([value, label]) => (
          <Button
            key={value}
            size="sm"
            variant={filter === value ? 'primary' : 'secondary'}
            onClick={() =>
              setFilter(
                value as 'all' | 'draft' | 'scheduled' | 'completed' | 'reviewed' | 'closed' | 'with_warnings',
              )
            }
          >
            {label}
          </Button>
        ))}
      </section>

      {visibleServices.length === 0 ? (
        <EmptyState
          title="Sin resultados para este filtro"
          description="Prueba con otro filtro para revisar el resto de servicios."
          action={
            <Link className="button button--secondary button--sm" to="/services/new">
              Nuevo servicio
            </Link>
          }
        />
      ) : (
        <section className="cards-grid">
          {visibleServices.map((item) => (
            <ServiceCard
              key={item.service.id}
              client={item.client}
              laborCost={item.laborCost}
              property={item.property}
              service={item.service}
              totalHours={getServiceConfirmedHours(item.service)}
              warningCount={item.warnings.length}
            />
          ))}
        </section>
      )}
    </div>
  )
}
