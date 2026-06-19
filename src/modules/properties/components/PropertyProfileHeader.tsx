import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import {
  formatEntityStatusLabel,
  formatPropertyTypeLabel,
  getEntityStatusTone,
} from '../../../utils/labels'

type PropertyProfileHeaderProps = {
  property: Property
  client?: Client
  summary: string
}

export function PropertyProfileHeader({ client, property, summary }: PropertyProfileHeaderProps) {
  return (
    <Card className="profile-header">
      <div className="profile-header__content">
        <div className="row-card__main">
          <div>
            <h1>{property.name}</h1>
            <p className="page-description">{summary}</p>
          </div>
          <div className="badge-row">
            <Badge tone="neutral">{formatPropertyTypeLabel(property.propertyType)}</Badge>
            <Badge tone={getEntityStatusTone(property.status)}>
              {formatEntityStatusLabel(property.status)}
            </Badge>
          </div>
        </div>
        <div className="detail-grid">
          <div>
            <span className="muted-caption">Cliente</span>
            <strong>
              {client ? <Link className="section-link" to={`/clients/${client.id}`}>{client.name}</Link> : 'Cliente no disponible'}
            </strong>
          </div>
          <div>
            <span className="muted-caption">Ciudad</span>
            <strong>{property.city || 'Ciudad pendiente'}</strong>
          </div>
          <div>
            <span className="muted-caption">Dirección</span>
            <strong>{property.address || 'Dirección pendiente'}</strong>
          </div>
          <div>
            <span className="muted-caption">Espacios</span>
            <strong>
              {property.rooms ? `${property.rooms} hab.` : 'Sin dato'} ·{' '}
              {property.bathrooms ? `${property.bathrooms} baños` : 'Sin dato'}
            </strong>
          </div>
        </div>
      </div>
    </Card>
  )
}
