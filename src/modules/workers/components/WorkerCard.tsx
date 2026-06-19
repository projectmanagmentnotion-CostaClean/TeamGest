import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import type { Worker } from '../../../domain/workers/worker.types'
import {
  formatEntityStatusLabel,
  formatWorkerRoleLabel,
  getEntityStatusTone,
} from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'

type WorkerCardProps = {
  worker: Worker
  monthlyHours: number
  monthlyPay: number
  monthlyServices: number
  warningCount: number
}

export function WorkerCard({
  monthlyHours,
  monthlyPay,
  monthlyServices,
  warningCount,
  worker,
}: WorkerCardProps) {
  return (
    <Card
      className="worker-card"
      title={worker.name}
      description={formatWorkerRoleLabel(worker.role)}
      action={
        <Badge tone={getEntityStatusTone(worker.status)}>
          {formatEntityStatusLabel(worker.status)}
        </Badge>
      }
    >
      <div className="worker-card__stats">
        <div>
          <span className="muted-caption">Tarifa</span>
          <strong>{worker.defaultHourlyRate ? formatMoney(worker.defaultHourlyRate) : 'Pendiente'}</strong>
        </div>
        <div>
          <span className="muted-caption">Horas mes</span>
          <strong>{monthlyHours.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Pago estimado</span>
          <strong>{formatMoney(monthlyPay)}</strong>
        </div>
        <div>
          <span className="muted-caption">Servicios mes</span>
          <strong>{monthlyServices}</strong>
        </div>
      </div>
      <div className="worker-card__footer">
        <span className={warningCount > 0 ? 'warning-text' : 'muted-caption'}>
          {warningCount} incidencias
        </span>
        <Link className="section-link" to={`/workers/${worker.id}`}>
          Ver detalle
        </Link>
      </div>
    </Card>
  )
}
