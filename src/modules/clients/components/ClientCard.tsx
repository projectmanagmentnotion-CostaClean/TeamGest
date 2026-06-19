import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import type { Client } from '../../../domain/clients/client.types'
import { formatEntityStatusLabel, getEntityStatusTone } from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'

type ClientCardProps = {
  client: Client
  propertyCount: number
  servicesThisMonth: number
  laborCostThisMonth: number
  warningCount: number
}

export function ClientCard({
  client,
  laborCostThisMonth,
  propertyCount,
  servicesThisMonth,
  warningCount,
}: ClientCardProps) {
  return (
    <Card
      className="entity-card"
      title={client.name}
      description={client.phone ?? client.email ?? 'Contacto pendiente'}
      action={
        <Badge tone={getEntityStatusTone(client.status)}>
          {formatEntityStatusLabel(client.status)}
        </Badge>
      }
    >
      <div className="entity-card__stats">
        <div>
          <span className="muted-caption">Correo</span>
          <strong>{client.email ?? 'No disponible'}</strong>
        </div>
        <div>
          <span className="muted-caption">Inmuebles</span>
          <strong>{propertyCount}</strong>
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
        <Link className="section-link" to={`/clients/${client.id}`}>
          Ver detalle
        </Link>
      </div>
    </Card>
  )
}
