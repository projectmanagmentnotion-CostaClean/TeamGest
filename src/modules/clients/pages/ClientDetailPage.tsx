import { Link, useParams } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { formatMonthLabel, getMonthKey } from '../../../utils/dates'
import { getServiceWarnings } from '../../services/services/serviceWarnings'
import { ClientOperationalSummary } from '../components/ClientOperationalSummary'
import { ClientProfileHeader } from '../components/ClientProfileHeader'
import { ClientPropertiesList } from '../components/ClientPropertiesList'
import { ClientServiceHistory } from '../components/ClientServiceHistory'
import { ClientWarningsPanel } from '../components/ClientWarningsPanel'
import {
  getClientActivePropertiesCount,
  getClientCompletedServiceCountByMonth,
  getClientLaborCostByMonth,
  getClientLastServiceDate,
  getClientProperties,
  getClientServiceCountByMonth,
  getClientServices,
  getClientServicesByMonth,
} from '../services/clientCalculations'
import { getClientOperationalWarnings } from '../services/clientWarnings'
import { getPropertyOperationalWarnings } from '../../properties/services/propertyWarnings'

export function ClientDetailPage() {
  const { id } = useParams()
  const repositories = getRepositories()
  const client = repositories.clients.getClientById(id ?? '')
  const properties = repositories.properties.listProperties()
  const services = repositories.services.listServices()
  const workers = repositories.workers.listWorkers()
  const clients = repositories.clients.listClients()

  if (!client) {
    return (
      <div className="page-stack">
        <EmptyState
          title="Cliente no encontrado"
          description="La ficha solicitada no existe en los datos actuales o la ruta no es válida."
          action={
            <Link className="button button--secondary button--sm" to="/clients">
              Volver a clientes
            </Link>
          }
        />
      </div>
    )
  }

  const month = getMonthKey(new Date().toISOString())
  const monthLabel = formatMonthLabel(month)
  const clientProperties = getClientProperties(client.id, properties)
  const clientServices = getClientServices(client.id, services)
  const clientWarnings = getClientOperationalWarnings(client, properties, services)
  const propertyRows = clientProperties.map((property) => ({
    property,
    servicesThisMonth: getClientServicesByMonth(client.id, services, month).filter(
      (service) => service.propertyId === property.id,
    ).length,
    warningCount: getPropertyOperationalWarnings(property, clients, workers, services).length,
  }))
  const propertyById = new Map(properties.map((property) => [property.id, property]))
  const clientServiceRows = clientServices.map((service) => ({
    service,
    warningCount: getServiceWarnings(service, workers, properties, clients).length,
  }))

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Cliente</p>
          <h1>Ficha comercial</h1>
          <p className="page-description">
            Perfil del cliente, inmuebles asociados, historial de servicios y visión operativa.
          </p>
        </div>
        <Link className="button button--secondary button--sm" to="/clients">
          Volver
        </Link>
      </section>

      <ClientProfileHeader
        client={client}
        summary={`${clientProperties.length} inmuebles asociados y ${clientWarnings.length} incidencias detectadas.`}
      />

      <section className="dashboard-grid">
        <ClientOperationalSummary
          activeProperties={getClientActivePropertiesCount(client.id, properties)}
          completedServicesThisMonth={getClientCompletedServiceCountByMonth(client.id, services, month)}
          laborCostThisMonth={getClientLaborCostByMonth(client.id, services, month)}
          lastServiceDate={getClientLastServiceDate(client.id, services)}
          monthLabel={monthLabel}
          servicesThisMonth={getClientServiceCountByMonth(client.id, services, month)}
          totalProperties={clientProperties.length}
        />
        <ClientWarningsPanel warnings={clientWarnings} />
      </section>

      <section className="dashboard-grid">
        <ClientPropertiesList properties={propertyRows} />
        <Card title="Notas operativas" description="Contexto útil para coordinación comercial.">
          <p className="page-description">
            {client.notes ??
              'Sin notas adicionales. Esta sección queda preparada para futuras observaciones comerciales read-only.'}
          </p>
          <p className="muted-caption">Referencia interna: {client.id}</p>
        </Card>
      </section>

      <ClientServiceHistory propertiesById={propertyById} services={clientServiceRows} />
    </div>
  )
}
