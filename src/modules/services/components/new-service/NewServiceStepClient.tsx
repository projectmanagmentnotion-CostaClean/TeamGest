import { Badge } from '../../../../components/ui/Badge'
import type { Client } from '../../../../domain/clients/client.types'
import { formatEntityStatusLabel, getEntityStatusTone } from '../../../../utils/labels'

type NewServiceStepClientProps = {
  clients: Client[]
  selectedClientId?: string
  onSelect: (clientId: string) => void
}

export function NewServiceStepClient({
  clients,
  onSelect,
  selectedClientId,
}: NewServiceStepClientProps) {
  return (
    <div className="cards-grid">
      {clients.map((client) => (
        <button
          key={client.id}
          className={`choice-card${selectedClientId === client.id ? ' is-selected' : ''}`}
          type="button"
          onClick={() => onSelect(client.id)}
        >
          <div className="row-card__main">
            <div>
              <strong>{client.name}</strong>
              <p>{client.phone ?? client.email ?? 'Contacto pendiente'}</p>
            </div>
            <Badge tone={getEntityStatusTone(client.status)}>
              {formatEntityStatusLabel(client.status)}
            </Badge>
          </div>
        </button>
      ))}
    </div>
  )
}
