import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EntityArchiveDialog } from '../../../components/forms/EntityArchiveDialog'
import { EntityDeleteDialog } from '../../../components/forms/EntityDeleteDialog'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageHeader } from '../../../components/ui/PageHeader'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { formatMonthLabel, getMonthKey } from '../../../utils/dates'
import { getPropertyOperationalWarnings } from '../../properties/services/propertyWarnings'
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

export function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const repositories = getRepositories()
  const client = repositories.clients.getClientById(id ?? '')
  const properties = repositories.properties.listProperties()
  const services = repositories.services.listServices()
  const workers = repositories.workers.listWorkers()
  const clients = repositories.clients.listClients()
  const [message, setMessage] = useState<string | null>(null)

  if (!client) {
    return (
      <div className="page-stack">
        <EmptyState
          title="Cliente no encontrado"
          description="La ficha solicitada no existe en los datos actuales o la ruta no es valida."
          action={
            <Link className="button button--secondary button--sm" to="/clients">
              Volver a clientes
            </Link>
          }
        />
      </div>
    )
  }

  const deletePolicy = repositories.clients.canDeleteClient(client.id)
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
      <PageHeader
        eyebrow="Cliente"
        title="Ficha comercial"
        description="Perfil del cliente, inmuebles asociados, historial de servicios y acciones locales de cartera."
        primaryAction={
          <Link className="button button--primary" to={`/clients/${client.id}/edit`}>
            Editar
          </Link>
        }
      />

      {message ? (
        <WarningBanner title="Operacion local" tone="info">
          {message}
        </WarningBanner>
      ) : null}

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
        <Card title="Notas operativas" description="Contexto util para coordinacion comercial.">
          <p className="page-description">{client.notes ?? 'Sin notas adicionales.'}</p>
          <p className="muted-caption">Referencia interna: {client.id}</p>
        </Card>
      </section>

      <ClientServiceHistory propertiesById={propertyById} services={clientServiceRows} />

      <EntityArchiveDialog
        title="Archivar cliente"
        description="Oculta este cliente de la cartera activa sin borrar trazabilidad local."
        onToggle={() => {
          repositories.clients.archiveClient(client.id)
          navigate('/clients')
        }}
      />

      <EntityDeleteDialog
        title="Eliminar cliente local"
        description="Solo se permite borrar altas locales sin inmuebles ni servicios asociados."
        blockedReason={deletePolicy.reason}
        onConfirm={() => {
          if (repositories.clients.deleteClient(client.id)) {
            navigate('/clients')
          } else {
            setMessage('No fue posible eliminar este cliente con las reglas locales actuales.')
          }
        }}
      />
    </div>
  )
}
