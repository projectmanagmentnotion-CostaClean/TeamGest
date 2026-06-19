import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import type { Worker } from '../../../domain/workers/worker.types'
import {
  formatEntityStatusLabel,
  formatWorkerRoleLabel,
  getEntityStatusTone,
} from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'

type WorkerProfileHeaderProps = {
  worker: Worker
  summary: string
}

export function WorkerProfileHeader({ summary, worker }: WorkerProfileHeaderProps) {
  const initials = worker.name
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
              <h1>{worker.name}</h1>
              <p className="page-description">{formatWorkerRoleLabel(worker.role)}</p>
            </div>
            <Badge tone={getEntityStatusTone(worker.status)}>
              {formatEntityStatusLabel(worker.status)}
            </Badge>
          </div>
          <div className="detail-grid">
            <div>
              <span className="muted-caption">Tarifa horaria</span>
              <strong>{worker.defaultHourlyRate ? formatMoney(worker.defaultHourlyRate) : 'Pendiente'}</strong>
            </div>
            <div>
              <span className="muted-caption">Teléfono</span>
              <strong>{worker.phone ?? 'No disponible'}</strong>
            </div>
            <div>
              <span className="muted-caption">Correo</span>
              <strong>{worker.email ?? 'No disponible'}</strong>
            </div>
          </div>
          <p className="page-description">{summary}</p>
          {worker.notes ? <p className="muted-caption">{worker.notes}</p> : null}
        </div>
      </div>
    </Card>
  )
}
