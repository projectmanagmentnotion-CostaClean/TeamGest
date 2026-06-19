import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EntityDeleteDialog } from '../../../components/forms/EntityDeleteDialog'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageHeader } from '../../../components/ui/PageHeader'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { ServiceAssignmentsList } from '../components/ServiceAssignmentsList'
import { ServiceCostSummary } from '../components/ServiceCostSummary'
import { ServiceLifecycle } from '../components/ServiceLifecycle'
import { ServiceOperationalSummary } from '../components/ServiceOperationalSummary'
import { ServiceProfileHeader } from '../components/ServiceProfileHeader'
import { ServiceRelatedContext } from '../components/ServiceRelatedContext'
import { ServiceWarningsPanel } from '../components/ServiceWarningsPanel'
import {
  calculateServiceLaborCost,
  getAverageServiceHourlyCost,
  getServiceClient,
  getServiceConfirmedAssignments,
  getServiceConfirmedHours,
  getServiceProperty,
  getServiceTotalDeductions,
  getServiceTotalExtras,
  getServiceTotalHours,
  getServiceWorkers,
} from '../services/serviceCalculations'
import { getServiceWarnings } from '../services/serviceWarnings'

export function ServiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const repositories = getRepositories()
  const service = repositories.services.getServiceById(id ?? '')
  const workers = repositories.workers.listWorkers()
  const properties = repositories.properties.listProperties()
  const clients = repositories.clients.listClients()
  const [message, setMessage] = useState<string | null>(null)

  if (!service) {
    return (
      <div className="page-stack">
        <EmptyState
          title="Servicio no encontrado"
          description="La ficha solicitada no existe en los datos actuales o la ruta no es valida."
          action={
            <Link className="button button--secondary button--sm" to="/services">
              Volver a servicios
            </Link>
          }
        />
      </div>
    )
  }

  const editPolicy = repositories.services.canEditService(service.id)
  const deletePolicy = repositories.services.canDeleteService(service.id)
  const client = getServiceClient(service, clients)
  const property = getServiceProperty(service, properties)
  const warnings = getServiceWarnings(service, workers, properties, clients)
  const serviceWorkers = getServiceWorkers(service, workers)
  const laborCost = calculateServiceLaborCost(service)
  const totalExtras = getServiceTotalExtras(service)
  const totalDeductions = getServiceTotalDeductions(service)

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Servicio"
        title="Ficha operativa del servicio"
        description="Contexto del servicio, asignaciones, coste laboral, estado y acciones locales."
        primaryAction={
          <Link className={`button button--primary${!editPolicy.allowed ? ' is-disabled' : ''}`} to={editPolicy.allowed ? `/services/${service.id}/edit` : `/services/${service.id}`}>
            Editar
          </Link>
        }
        secondaryAction={
          <Link className="button button--secondary button--sm" to="/services">
            Volver
          </Link>
        }
      />

      {message ? (
        <WarningBanner title="Operacion local" tone="info">
          {message}
        </WarningBanner>
      ) : null}

      {!editPolicy.allowed ? (
        <WarningBanner title="Edicion bloqueada" tone="warning">
          {editPolicy.reason ?? 'No se permite editar este servicio.'}
        </WarningBanner>
      ) : null}

      <ServiceProfileHeader
        client={client}
        laborCost={laborCost}
        property={property}
        service={service}
        summary={`${service.assignments.length} asignaciones y ${warnings.length} incidencias detectadas.`}
      />

      <section className="dashboard-grid">
        <ServiceOperationalSummary
          assignmentCount={service.assignments.length}
          confirmedAssignmentsCount={getServiceConfirmedAssignments(service).length}
          confirmedHours={getServiceConfirmedHours(service)}
          laborCost={laborCost}
          totalDeductions={totalDeductions}
          totalExtras={totalExtras}
          totalHours={getServiceTotalHours(service)}
          warningCount={warnings.length}
        />
        <ServiceWarningsPanel warnings={warnings} />
      </section>

      <section className="dashboard-grid">
        <ServiceCostSummary
          assignmentsCount={service.assignments.length}
          averageHourlyCost={getAverageServiceHourlyCost(service)}
          baseLaborCost={laborCost}
          finalLaborCost={laborCost}
          totalDeductions={totalDeductions}
          totalExtras={totalExtras}
        />
        <ServiceLifecycle status={service.status} />
      </section>

      <section className="dashboard-grid">
        <ServiceAssignmentsList service={service} workers={workers} />
        <ServiceRelatedContext client={client} property={property} workers={serviceWorkers} />
      </section>

      <Card title="Notas operativas" description="Contexto adicional para seguimiento interno.">
        <p className="page-description">{service.notes ?? 'Sin notas adicionales.'}</p>
        <p className="muted-caption">Referencia interna: {service.id}</p>
      </Card>

      <Card title="Acciones del servicio" description="Cancelacion o restauracion local del servicio.">
        <div className="quick-actions">
          {service.status !== 'cancelled' ? (
            <button
              className="button button--secondary"
              type="button"
              disabled={!editPolicy.allowed}
              onClick={() => {
                const result = repositories.services.archiveService(service.id)
                if (result.success) {
                  navigate('/services')
                } else {
                  setMessage(result.error ?? 'No se pudo cancelar el servicio.')
                }
              }}
            >
              Cancelar servicio
            </button>
          ) : (
            <button
              className="button button--secondary"
              type="button"
              onClick={() => {
                const result = repositories.services.restoreService(service.id)
                if (result.success) {
                  setMessage('El servicio fue restaurado a estado operativo.')
                } else {
                  setMessage(result.error ?? 'No se pudo restaurar el servicio.')
                }
              }}
            >
              Restaurar servicio
            </button>
          )}
        </div>
      </Card>

      <EntityDeleteDialog
        title="Eliminar servicio local"
        description="Solo se permite borrar servicios creados localmente y fuera de meses bloqueados."
        blockedReason={deletePolicy.reason}
        onConfirm={() => {
          const result = repositories.services.deleteService(service.id)
          if (result.success) {
            navigate('/services')
          } else {
            setMessage(result.error ?? 'No se pudo eliminar el servicio.')
          }
        }}
      />
    </div>
  )
}
