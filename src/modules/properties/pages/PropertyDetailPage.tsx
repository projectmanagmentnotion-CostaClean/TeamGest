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
import { getServiceWarnings } from '../../services/services/serviceWarnings'
import { getWorkerOperationalWarnings } from '../../workers/services/workerWarnings'
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

export function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const repositories = getRepositories()
  const property = repositories.properties.getPropertyById(id ?? '')
  const clients = repositories.clients.listClients()
  const workers = repositories.workers.listWorkers()
  const services = repositories.services.listServices()
  const [message, setMessage] = useState<string | null>(null)

  if (!property) {
    return (
      <div className="page-stack">
        <EmptyState
          title="Inmueble no encontrado"
          description="La ficha solicitada no existe en los datos actuales o la ruta no es valida."
          action={
            <Link className="button button--secondary button--sm" to="/properties">
              Volver a inmuebles
            </Link>
          }
        />
      </div>
    )
  }

  const deletePolicy = repositories.properties.canDeleteProperty(property.id)
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
      <PageHeader
        eyebrow="Inmueble"
        title="Ficha operativa del inmueble"
        description="Contexto del inmueble, cliente vinculado, historial y acciones locales del parque."
        primaryAction={
          <Link className="button button--primary" to={`/properties/${property.id}/edit`}>
            Editar
          </Link>
        }
        secondaryAction={
          <Link className="button button--secondary button--sm" to={`/quick-entry?propertyId=${property.id}`}>
            Registrar horas
          </Link>
        }
      />

      {message ? (
        <WarningBanner title="Operacion local" tone="info">
          {message}
        </WarningBanner>
      ) : null}

      {property.status !== 'active' ? (
        <WarningBanner title="Inmueble no activo" tone="warning">
          Este inmueble no esta activo. Normalmente no deberias registrar nuevas horas aqui sin revisar la operacion.
        </WarningBanner>
      ) : null}

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
        <Card title="Notas operativas" description="Contexto util para coordinacion del inmueble.">
          <p className="page-description">{property.notes ?? 'Sin notas adicionales.'}</p>
          <p className="muted-caption">Referencia interna: {property.id}</p>
        </Card>
      </section>

      <PropertyServiceHistory clientsById={clientsById} services={serviceRows} />

      <EntityArchiveDialog
        title="Archivar inmueble"
        description={
          propertyServices.length > 0
            ? `Este inmueble tiene ${propertyServices.length} servicios asociados. Archivar es seguro, pero no elimina su trazabilidad.`
            : 'Oculta este inmueble del parque activo sin borrar su trazabilidad local.'
        }
        onToggle={() => {
          repositories.properties.archiveProperty(property.id)
          navigate('/properties')
        }}
      />

      <EntityDeleteDialog
        title="Eliminar inmueble local"
        description="Solo se permite borrar altas locales sin servicios asociados."
        blockedReason={deletePolicy.reason}
        onConfirm={() => {
          if (repositories.properties.deleteProperty(property.id)) {
            navigate('/properties')
          } else {
            setMessage('No fue posible eliminar este inmueble con las reglas locales actuales.')
          }
        }}
      />
    </div>
  )
}
