import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import type { Property } from '../../../domain/properties/property.types'
import {
  formatEntityStatusLabel,
  formatPropertyTypeLabel,
  getEntityStatusTone,
} from '../../../utils/labels'

type ClientPropertiesListProps = {
  properties: Array<{
    property: Property
    servicesThisMonth: number
    warningCount: number
  }>
}

export function ClientPropertiesList({ properties }: ClientPropertiesListProps) {
  if (properties.length === 0) {
    return (
      <Card title="Inmuebles asociados" description="Inmuebles vinculados al cliente actual.">
        <EmptyState
          title="Sin inmuebles asociados"
          description="Este cliente no tiene inmuebles vinculados en los datos actuales."
        />
      </Card>
    )
  }

  return (
    <Card title="Inmuebles asociados" description="Inventario operativo del cliente.">
      <div className="stack-list">
        {properties.map(({ property, servicesThisMonth, warningCount }) => (
          <article key={property.id} className="row-card">
            <div className="row-card__main">
              <div>
                <h4>{property.name}</h4>
                <p>
                  {formatPropertyTypeLabel(property.propertyType)} · {property.city || 'Ciudad pendiente'}
                </p>
              </div>
              <Badge tone={getEntityStatusTone(property.status)}>
                {formatEntityStatusLabel(property.status)}
              </Badge>
            </div>
            <div className="row-card__meta">
              <span>{servicesThisMonth} servicios este mes</span>
              <span className={warningCount > 0 ? 'warning-text' : 'muted-caption'}>
                {warningCount} incidencias
              </span>
              <Link className="section-link" to={`/properties/${property.id}`}>
                Ver inmueble
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Card>
  )
}
