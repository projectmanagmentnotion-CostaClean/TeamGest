import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import { formatDate } from '../../../utils/dates'
import {
  formatServiceStatusLabel,
  formatServiceTypeLabel,
  getServiceStatusTone,
} from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'
import { calculateServiceLaborCost } from '../../services/services/serviceCalculations'

type ClientServiceHistoryProps = {
  propertiesById: Map<string, Property>
  services: Array<{
    service: ServiceJob
    warningCount: number
  }>
}

export function ClientServiceHistory({ propertiesById, services }: ClientServiceHistoryProps) {
  if (services.length === 0) {
    return (
      <Card title="Historial de servicios" description="Servicios vinculados a este cliente.">
        <EmptyState
          title="Sin servicios disponibles"
          description="Este cliente aún no tiene servicios registrados en el conjunto actual."
        />
      </Card>
    )
  }

  return (
    <Card title="Historial de servicios" description="Servicios asociados al cliente y su impacto operativo.">
      <div className="stack-list">
        {services.map(({ service, warningCount }) => {
          const property = propertiesById.get(service.propertyId)

          return (
            <article key={service.id} className="row-card">
              <div className="row-card__main">
                <div>
                  <h4>
                    <Link className="section-link" to={`/services/${service.id}`}>
                      {formatServiceTypeLabel(service.serviceType)}
                    </Link>
                  </h4>
                  <p>
                    {formatDate(service.date)} · {property?.name ?? 'Inmueble no disponible'}
                  </p>
                </div>
                <Badge tone={getServiceStatusTone(service.status)}>
                  {formatServiceStatusLabel(service.status)}
                </Badge>
              </div>
              <div className="row-card__meta">
                <span>{service.assignments.length} trabajadores</span>
                <span>Coste {formatMoney(calculateServiceLaborCost(service))}</span>
                <span className={warningCount > 0 ? 'warning-text' : 'muted-caption'}>
                  {warningCount} incidencias
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </Card>
  )
}
