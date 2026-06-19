import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import { formatDate } from '../../../utils/dates'
import {
  formatServiceStatusLabel,
  formatServiceTypeLabel,
  getServiceStatusTone,
} from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'

type ServiceCardProps = {
  client?: Client
  property?: Property
  service: ServiceJob
  totalHours: number
  laborCost: number
  warningCount: number
}

export function ServiceCard({
  client,
  laborCost,
  property,
  service,
  totalHours,
  warningCount,
}: ServiceCardProps) {
  const timeRange =
    service.startTime && service.endTime
      ? `${service.startTime} - ${service.endTime}`
      : service.startTime
        ? `Inicio ${service.startTime}`
        : 'Sin franja horaria'

  return (
    <Card
      className="entity-card"
      title={formatServiceTypeLabel(service.serviceType)}
      description={`${formatDate(service.date)} · ${timeRange}`}
      action={
        <Badge tone={getServiceStatusTone(service.status)}>
          {formatServiceStatusLabel(service.status)}
        </Badge>
      }
    >
      <div className="entity-card__stats">
        <div>
          <span className="muted-caption">Cliente</span>
          <strong>{client?.name ?? 'Cliente no disponible'}</strong>
        </div>
        <div>
          <span className="muted-caption">Inmueble</span>
          <strong>{property?.name ?? 'Inmueble no disponible'}</strong>
        </div>
        <div>
          <span className="muted-caption">Ciudad</span>
          <strong>{property?.city || 'Ciudad pendiente'}</strong>
        </div>
        <div>
          <span className="muted-caption">Asignaciones</span>
          <strong>{service.assignments.length}</strong>
        </div>
        <div>
          <span className="muted-caption">Horas confirmadas</span>
          <strong>{totalHours.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Coste laboral</span>
          <strong>{formatMoney(laborCost)}</strong>
        </div>
      </div>
      <div className="entity-card__footer">
        <span className={warningCount > 0 ? 'warning-text' : 'muted-caption'}>
          {warningCount} incidencias
        </span>
        <Link className="section-link" to={`/services/${service.id}`}>
          Ver detalle
        </Link>
      </div>
    </Card>
  )
}
