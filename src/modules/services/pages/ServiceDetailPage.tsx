import { Link, useParams } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
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
  const repositories = getRepositories()
  const service = repositories.services.getServiceById(id ?? '')
  const workers = repositories.workers.listWorkers()
  const properties = repositories.properties.listProperties()
  const clients = repositories.clients.listClients()

  if (!service) {
    return (
      <div className="page-stack">
        <EmptyState
          title="Servicio no encontrado"
          description="La ficha solicitada no existe en los datos actuales o la ruta no es válida."
          action={
            <Link className="button button--secondary button--sm" to="/services">
              Volver a servicios
            </Link>
          }
        />
      </div>
    )
  }

  const client = getServiceClient(service, clients)
  const property = getServiceProperty(service, properties)
  const warnings = getServiceWarnings(service, workers, properties, clients)
  const serviceWorkers = getServiceWorkers(service, workers)
  const laborCost = calculateServiceLaborCost(service)
  const totalExtras = getServiceTotalExtras(service)
  const totalDeductions = getServiceTotalDeductions(service)

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Servicio</p>
          <h1>Ficha operativa del servicio</h1>
          <p className="page-description">
            Contexto del servicio, asignaciones, coste laboral, estado y relaciones operativas.
          </p>
        </div>
        <Link className="button button--secondary button--sm" to="/services">
          Volver
        </Link>
      </section>

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
        <p className="page-description">
          {service.notes ??
            'Sin notas adicionales. Esta sección queda preparada para observaciones operativas read-only.'}
        </p>
        <p className="muted-caption">Referencia interna: {service.id}</p>
      </Card>
    </div>
  )
}
