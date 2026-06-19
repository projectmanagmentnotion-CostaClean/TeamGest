import { Link, useParams } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { formatMonthLabel, getMonthKey } from '../../../utils/dates'
import { getServiceWarnings } from '../../services/services/serviceWarnings'
import { PropertyOperationalSummary } from '../components/PropertyOperationalSummary'
import { PropertyProfileHeader } from '../components/PropertyProfileHeader'
import { PropertyServiceHistory } from '../components/PropertyServiceHistory'
import { PropertyWarningsPanel } from '../components/PropertyWarningsPanel'
import { PropertyWorkerHistory } from '../components/PropertyWorkerHistory'
import {
  getPropertyClient,
  getPropertyCompletedServiceCountByMonth,
  getPropertyLaborCostByMonth,
  getPropertyLastServiceDate,
  getPropertyServiceCountByMonth,
  getPropertyServices,
  getPropertyWorkerParticipations,
} from '../services/propertyCalculations'
import { getPropertyOperationalWarnings } from '../services/propertyWarnings'
import { getWorkerOperationalWarnings } from '../../workers/services/workerWarnings'

export function PropertyDetailPage() {
  const { id } = useParams()
  const repositories = getRepositories()
  const property = repositories.properties.getPropertyById(id ?? '')
  const clients = repositories.clients.listClients()
  const workers = repositories.workers.listWorkers()
  const services = repositories.services.listServices()

  if (!property) {
    return (
      <div className="page-stack">
        <EmptyState
          title="Inmueble no encontrado"
          description="La ficha solicitada no existe en los datos actuales o la ruta no es válida."
          action={
            <Link className="button button--secondary button--sm" to="/properties">
              Volver a inmuebles
            </Link>
          }
        />
      </div>
    )
  }

  const month = getMonthKey(new Date().toISOString())
  const monthLabel = formatMonthLabel(month)
  const propertyClient = getPropertyClient(property, clients)
  const propertyServices = getPropertyServices(property.id, services)
  const propertyWarnings = getPropertyOperationalWarnings(property, clients, workers, services)
  const clientsById = new Map(clients.map((client) => [client.id, client]))
  const serviceRows = propertyServices.map((service) => ({
    service,
    warningCount: getServiceWarnings(service, workers, [property], clients).length,
  }))
  const workerParticipations = getPropertyWorkerParticipations(property.id, workers, services, month).map(
    (item) => ({
      ...item,
      warningCount: item.worker ? getWorkerOperationalWarnings(item.worker, services).length : 1,
    }),
  )

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Inmueble</p>
          <h1>Ficha operativa del inmueble</h1>
          <p className="page-description">
            Contexto del inmueble, cliente vinculado, historial de servicios y participación del
            equipo.
          </p>
        </div>
        <Link className="button button--secondary button--sm" to="/properties">
          Volver
        </Link>
      </section>

      <PropertyProfileHeader
        client={propertyClient}
        property={property}
        summary={`${propertyServices.length} servicios asociados y ${propertyWarnings.length} incidencias detectadas.`}
      />

      <section className="dashboard-grid">
        <PropertyOperationalSummary
          completedServicesThisMonth={getPropertyCompletedServiceCountByMonth(property.id, services, month)}
          laborCostThisMonth={getPropertyLaborCostByMonth(property.id, services, month)}
          lastServiceDate={getPropertyLastServiceDate(property.id, services)}
          monthLabel={monthLabel}
          servicesThisMonth={getPropertyServiceCountByMonth(property.id, services, month)}
          totalWorkerParticipations={workerParticipations.reduce((sum, item) => sum + item.serviceCount, 0)}
        />
        <PropertyWarningsPanel warnings={propertyWarnings} />
      </section>

      <section className="dashboard-grid">
        <PropertyWorkerHistory participations={workerParticipations} />
        <Card title="Notas operativas" description="Contexto útil para coordinación del inmueble.">
          <p className="page-description">
            {property.notes ??
              'Sin notas adicionales. Esta sección queda preparada para futuras observaciones operativas read-only.'}
          </p>
          <p className="muted-caption">Referencia interna: {property.id}</p>
        </Card>
      </section>

      <PropertyServiceHistory clientsById={clientsById} services={serviceRows} />
    </div>
  )
}
