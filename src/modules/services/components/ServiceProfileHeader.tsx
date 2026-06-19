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

type ServiceProfileHeaderProps = {
  client?: Client
  laborCost: number
  property?: Property
  service: ServiceJob
  summary: string
}

export function ServiceProfileHeader({
  client,
  laborCost,
  property,
  service,
  summary,
}: ServiceProfileHeaderProps) {
  return (
    <Card className="profile-header">
      <div className="profile-header__content">
        <div className="row-card__main">
          <div>
            <h1>{formatServiceTypeLabel(service.serviceType)}</h1>
            <p className="page-description">{summary}</p>
          </div>
          <Badge tone={getServiceStatusTone(service.status)}>
            {formatServiceStatusLabel(service.status)}
          </Badge>
        </div>
        <div className="detail-grid">
          <div>
            <span className="muted-caption">Fecha</span>
            <strong>{formatDate(service.date)}</strong>
          </div>
          <div>
            <span className="muted-caption">Horario</span>
            <strong>
              {service.startTime && service.endTime
                ? `${service.startTime} - ${service.endTime}`
                : service.startTime ?? 'Sin horario definido'}
            </strong>
          </div>
          <div>
            <span className="muted-caption">Cliente</span>
            <strong>
              {client ? <Link className="section-link" to={`/clients/${client.id}`}>{client.name}</Link> : 'Cliente no disponible'}
            </strong>
          </div>
          <div>
            <span className="muted-caption">Inmueble</span>
            <strong>
              {property ? <Link className="section-link" to={`/properties/${property.id}`}>{property.name}</Link> : 'Inmueble no disponible'}
            </strong>
          </div>
          <div>
            <span className="muted-caption">Coste laboral</span>
            <strong>{formatMoney(laborCost)}</strong>
          </div>
        </div>
      </div>
    </Card>
  )
}
