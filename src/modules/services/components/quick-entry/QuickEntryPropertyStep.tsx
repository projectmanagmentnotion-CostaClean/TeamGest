import type { Property } from '../../../../domain/properties/property.types'
import { formatPropertyTypeLabel } from '../../../../utils/labels'

type QuickEntryPropertyStepProps = {
  propertyId: string
  properties: Property[]
  onChange: (propertyId: string) => void
}

export function QuickEntryPropertyStep({
  onChange,
  properties,
  propertyId,
}: QuickEntryPropertyStepProps) {
  return (
    <section className="page-stack">
      <div className="section-header__content">
        <h3>Inmueble</h3>
        <p>Selecciona donde se realizo el trabajo.</p>
      </div>
      <div className="cards-grid">
        {properties.map((property) => {
          const isSelected = property.id === propertyId

          return (
            <button
              key={property.id}
              className={`choice-card${isSelected ? ' is-selected' : ''}`}
              type="button"
              onClick={() => onChange(property.id)}
            >
              <div className="row-card__main">
                <div>
                  <strong>{property.name}</strong>
                  <p>{property.city}</p>
                </div>
                <span className="muted-caption">{formatPropertyTypeLabel(property.propertyType)}</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
