import { formatServiceTypeLabel } from '../../../../utils/labels'
import type { ServiceType } from '../../../../domain/services/service.types'

type NewServiceStepTypeProps = {
  selectedType?: ServiceType
  onSelect: (serviceType: ServiceType) => void
}

const serviceTypes: Array<{ type: ServiceType; helper: string }> = [
  { type: 'basic_cleaning', helper: 'Servicio recurrente o estándar.' },
  { type: 'deep_cleaning', helper: 'Intervención intensiva de puesta a punto.' },
  { type: 'post_construction', helper: 'Limpieza tras obra o reforma.' },
  { type: 'airbnb_turnover', helper: 'Rotación turística y preparación de entrada.' },
  { type: 'gym_cleaning', helper: 'Rutina específica para instalaciones deportivas.' },
  { type: 'office_cleaning', helper: 'Operación para oficinas y espacios de trabajo.' },
  { type: 'windows', helper: 'Enfoque en cristales y superficies acristaladas.' },
  { type: 'extra', helper: 'Servicio adicional puntual.' },
  { type: 'other', helper: 'Caso no cubierto por las categorías anteriores.' },
]

export function NewServiceStepType({ onSelect, selectedType }: NewServiceStepTypeProps) {
  return (
    <div className="cards-grid">
      {serviceTypes.map((item) => (
        <button
          key={item.type}
          className={`choice-card${selectedType === item.type ? ' is-selected' : ''}`}
          type="button"
          onClick={() => onSelect(item.type)}
        >
          <strong>{formatServiceTypeLabel(item.type)}</strong>
          <p>{item.helper}</p>
        </button>
      ))}
    </div>
  )
}
