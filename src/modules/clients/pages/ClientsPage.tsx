import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/ui/EmptyState'
import { StatCard } from '../../../components/ui/StatCard'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { formatMonthLabel, getMonthKey } from '../../../utils/dates'
import { ClientCard } from '../components/ClientCard'
import { getClientsSummary } from '../services/clientCalculations'
import { getClientOperationalWarnings, getClientsWithWarnings } from '../services/clientWarnings'

export function ClientsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'with_warnings'>('all')
  const repositories = getRepositories()
  const clients = repositories.clients.listClients()
  const properties = repositories.properties.listProperties()
  const services = repositories.services.listServices()
  const month = getMonthKey(new Date().toISOString())
  const monthLabel = formatMonthLabel(month)
  const summary = getClientsSummary(clients, properties, services, month)
  const clientsWithWarnings = getClientsWithWarnings(clients, properties, services)
  const visibleClients = summary.filter(({ client }) => {
    if (filter === 'active') {
      return client.status === 'active'
    }
    if (filter === 'inactive') {
      return client.status === 'inactive'
    }
    if (filter === 'with_warnings') {
      return getClientOperationalWarnings(client, properties, services).length > 0
    }
    return true
  })

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Clientes</p>
          <h1>Clientes</h1>
          <p className="page-description">
            Vista comercial read-only con inmuebles asociados, servicios del mes y coste laboral
            estimado para {monthLabel}.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          hint="Clientes actualmente operativos."
          label="Clientes activos"
          tone="success"
          value={clients.filter((client) => client.status === 'active').length.toString()}
        />
        <StatCard
          hint="Inventario vinculado a la cartera comercial."
          label="Total inmuebles asociados"
          tone="info"
          value={properties.length.toString()}
        />
        <StatCard
          hint={`Servicios registrados en ${monthLabel}.`}
          label="Servicios este mes"
          tone="info"
          value={services.filter((service) => service.date.startsWith(month)).length.toString()}
        />
        <StatCard
          hint="Clientes con alertas comerciales u operativas."
          label="Clientes con incidencias"
          tone="warning"
          value={clientsWithWarnings.length.toString()}
        />
      </section>

      <section className="filter-row">
        {[
          ['all', 'Todos'],
          ['active', 'Activos'],
          ['inactive', 'Inactivos'],
          ['with_warnings', 'Con incidencias'],
        ].map(([value, label]) => (
          <Button
            key={value}
            size="sm"
            variant={filter === value ? 'primary' : 'secondary'}
            onClick={() => setFilter(value as 'all' | 'active' | 'inactive' | 'with_warnings')}
          >
            {label}
          </Button>
        ))}
      </section>

      {visibleClients.length === 0 ? (
        <EmptyState
          title="Sin resultados para este filtro"
          description="Prueba con otro filtro para revisar el resto de la cartera."
        />
      ) : (
        <section className="cards-grid">
          {visibleClients.map((item) => (
            <ClientCard
              key={item.client.id}
              client={item.client}
              laborCostThisMonth={item.laborCostThisMonth}
              propertyCount={item.propertyCount}
              servicesThisMonth={item.servicesThisMonth}
              warningCount={getClientOperationalWarnings(item.client, properties, services).length}
            />
          ))}
        </section>
      )}
    </div>
  )
}
