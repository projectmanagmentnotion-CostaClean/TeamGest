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
import { formatMoney } from '../../../utils/money'

type PropertyCardProps = {
  property: Property
  client?: Client
  servicesThisMonth: number
  laborCostThisMonth: number
  warningCount: number
}

export function PropertyCard({
  client,
  laborCostThisMonth,
  property,
  servicesThisMonth,
  warningCount,
}: PropertyCardProps) {
  return (
    <Card
      className="entity-card"
      title={property.name}
      description={`${formatPropertyTypeLabel(property.propertyType)} · ${property.city || 'Ciudad pendiente'}`}
      action={
        <Badge tone={getEntityStatusTone(property.status)}>
          {formatEntityStatusLabel(property.status)}
        </Badge>
      }
    >
      <div className="entity-card__stats">
        <div>
          <span className="muted-caption">Cliente</span>
          <strong>{client?.name ?? 'Cliente no disponible'}</strong>
        </div>
        <div>
          <span className="muted-caption">Dirección</span>
          <strong>{property.address || 'Dirección pendiente'}</strong>
        </div>
        <div>
          <span className="muted-caption">Servicios mes</span>
          <strong>{servicesThisMonth}</strong>
        </div>
        <div>
          <span className="muted-caption">Coste laboral mes</span>
          <strong>{formatMoney(laborCostThisMonth)}</strong>
        </div>
      </div>
      <div className="entity-card__footer">
        <span className={warningCount > 0 ? 'warning-text' : 'muted-caption'}>
          {warningCount} incidencias
        </span>
        <Link className="section-link" to={`/properties/${property.id}`}>
          Ver detalle
        </Link>
      </div>
    </Card>
  )
}
