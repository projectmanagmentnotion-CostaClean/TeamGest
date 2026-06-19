import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import type { Client } from '../../../domain/clients/client.types'
import { formatEntityStatusLabel, getEntityStatusTone } from '../../../utils/labels'

type ClientProfileHeaderProps = {
  client: Client
  summary: string
}

export function ClientProfileHeader({ client, summary }: ClientProfileHeaderProps) {
  const initials = client.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()

  return (
    <Card className="profile-header">
      <div className="profile-header__layout">
        <div className="avatar-block">{initials}</div>
        <div className="profile-header__content">
          <div className="row-card__main">
            <div>
              <h1>{client.name}</h1>
              <p className="page-description">{summary}</p>
            </div>
            <Badge tone={getEntityStatusTone(client.status)}>
              {formatEntityStatusLabel(client.status)}
            </Badge>
          </div>
          <div className="detail-grid">
            <div>
              <span className="muted-caption">Teléfono</span>
              <strong>{client.phone ?? 'No disponible'}</strong>
            </div>
            <div>
              <span className="muted-caption">Correo</span>
              <strong>{client.email ?? 'No disponible'}</strong>
            </div>
            <div>
              <span className="muted-caption">Razón social</span>
              <strong>{client.billingName ?? 'No disponible'}</strong>
            </div>
            <div>
              <span className="muted-caption">NIF/CIF</span>
              <strong>{client.billingTaxId ?? 'No disponible'}</strong>
            </div>
          </div>
          {client.billingAddress ? <p className="muted-caption">{client.billingAddress}</p> : null}
        </div>
      </div>
    </Card>
  )
}
