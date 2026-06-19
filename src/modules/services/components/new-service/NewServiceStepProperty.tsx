import { Badge } from '../../../../components/ui/Badge'
import { EmptyState } from '../../../../components/ui/EmptyState'
import type { Property } from '../../../../domain/properties/property.types'
import {
  formatEntityStatusLabel,
  formatPropertyTypeLabel,
  getEntityStatusTone,
} from '../../../../utils/labels'

type NewServiceStepPropertyProps = {
  properties: Property[]
  selectedPropertyId?: string
  onSelect: (propertyId: string) => void
}

export function NewServiceStepProperty({
  onSelect,
  properties,
  selectedPropertyId,
}: NewServiceStepPropertyProps) {
  if (properties.length === 0) {
    return (
      <EmptyState
        title="Sin inmuebles disponibles"
        description="El cliente seleccionado no tiene inmuebles asociados en los datos actuales."
      />
    )
  }

  return (
    <div className="cards-grid">
      {properties.map((property) => (
        <button
          key={property.id}
          className={`choice-card${selectedPropertyId === property.id ? ' is-selected' : ''}`}
          type="button"
          onClick={() => onSelect(property.id)}
        >
          <div className="row-card__main">
            <div>
              <strong>{property.name}</strong>
              <p>{`${formatPropertyTypeLabel(property.propertyType)} · ${property.city || 'Ciudad pendiente'}`}</p>
            </div>
            <Badge tone={getEntityStatusTone(property.status)}>
              {formatEntityStatusLabel(property.status)}
            </Badge>
          </div>
        </button>
      ))}
    </div>
  )
}
