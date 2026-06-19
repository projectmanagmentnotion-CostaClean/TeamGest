import { useState } from 'react'
import { ActionBar } from '../../../components/ui/ActionBar'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/ui/EmptyState'
import { MetricGrid } from '../../../components/ui/MetricGrid'
import { PageHeader } from '../../../components/ui/PageHeader'
import { StatCard } from '../../../components/ui/StatCard'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { formatMonthLabel, getMonthKey } from '../../../utils/dates'
import { formatMoney } from '../../../utils/money'
import { PropertyCard } from '../components/PropertyCard'
import { getPropertiesSummary } from '../services/propertyCalculations'
import { getPropertiesWithWarnings, getPropertyOperationalWarnings } from '../services/propertyWarnings'

export function PropertiesPage() {
  const [filter, setFilter] = useState<
    'all' | 'active' | 'tourist_apartments' | 'gyms' | 'with_warnings'
  >('all')
  const repositories = getRepositories()
  const properties = repositories.properties.listProperties()
  const clients = repositories.clients.listClients()
  const workers = repositories.workers.listWorkers()
  const services = repositories.services.listServices()
  const month = getMonthKey(new Date().toISOString())
  const monthLabel = formatMonthLabel(month)
  const summary = getPropertiesSummary(properties, clients, workers, services, month)
  const propertiesWithWarnings = getPropertiesWithWarnings(properties, clients, workers, services)
  const visibleProperties = summary.filter(({ property }) => {
    if (filter === 'active') {
      return property.status === 'active'
    }
    if (filter === 'tourist_apartments') {
      return property.propertyType === 'tourist_apartment'
    }
    if (filter === 'gyms') {
      return property.propertyType === 'gym'
    }
    if (filter === 'with_warnings') {
      return getPropertyOperationalWarnings(property, clients, workers, services).length > 0
    }
    return true
  })

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Inmuebles"
        title="Parque operativo"
        description={`Vista read-only del parque de propiedades, sus servicios y el coste laboral estimado para ${monthLabel}.`}
      />

      <MetricGrid>
        <StatCard
          hint="Inmuebles listos para operacion."
          label="Inmuebles activos"
          tone="success"
          value={properties.filter((property) => property.status === 'active').length.toString()}
        />
        <StatCard
          hint={`Servicios registrados en ${monthLabel}.`}
          label="Servicios este mes"
          tone="info"
          value={services.filter((service) => service.date.startsWith(month)).length.toString()}
        />
        <StatCard
          hint="Coste laboral agregado del mes."
          label="Coste laboral estimado del mes"
          tone="info"
          value={formatMoney(summary.reduce((sum, item) => sum + item.laborCostThisMonth, 0))}
        />
        <StatCard
          hint="Inmuebles con incidencias operativas activas."
          label="Inmuebles con incidencias"
          tone="warning"
          value={propertiesWithWarnings.length.toString()}
        />
      </MetricGrid>

      <ActionBar aside={<span className="muted-caption">{visibleProperties.length} visibles</span>}>
        {[
          ['all', 'Todos'],
          ['active', 'Activos'],
          ['tourist_apartments', 'Turisticos'],
          ['gyms', 'Gimnasios'],
          ['with_warnings', 'Con incidencias'],
        ].map(([value, label]) => (
          <Button
            key={value}
            size="sm"
            variant={filter === value ? 'primary' : 'secondary'}
            onClick={() =>
              setFilter(
                value as 'all' | 'active' | 'tourist_apartments' | 'gyms' | 'with_warnings',
              )
            }
          >
            {label}
          </Button>
        ))}
      </ActionBar>

      {visibleProperties.length === 0 ? (
        <EmptyState
          title="Sin resultados para este filtro"
          description="Prueba con otro filtro para revisar el resto del parque."
          icon="P"
        />
      ) : (
        <section className="cards-grid">
          {visibleProperties.map((item) => (
            <PropertyCard
              key={item.property.id}
              client={item.client}
              laborCostThisMonth={item.laborCostThisMonth}
              property={item.property}
              servicesThisMonth={item.servicesThisMonth}
              warningCount={getPropertyOperationalWarnings(item.property, clients, workers, services).length}
            />
          ))}
        </section>
      )}
    </div>
  )
}
