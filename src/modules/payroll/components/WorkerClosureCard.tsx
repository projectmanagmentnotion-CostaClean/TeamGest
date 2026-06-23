import { Card } from '../../../components/ui/Card'
import { formatWorkerRoleLabel } from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'
import type { WorkerClosureCardModel } from '../services/monthlyClosure.types'
import { WorkerClosureActions } from './WorkerClosureActions'
import { WorkerClosureStatusBadge } from './WorkerClosureStatusBadge'
import { WorkerClosureWarnings } from './WorkerClosureWarnings'

type WorkerClosureCardProps = {
  model: WorkerClosureCardModel
  month: string
  onMarkReviewed: (workerId: string) => void
  onMarkPaid: (workerId: string) => void
  onRevertPaid: (workerId: string) => void
}

export function WorkerClosureCard({
  model,
  month,
  onMarkPaid,
  onMarkReviewed,
  onRevertPaid,
}: WorkerClosureCardProps) {
  return (
    <Card
      className="worker-closure-card"
      title={model.workerName}
      description={formatWorkerRoleLabel(model.workerRole)}
      action={<WorkerClosureStatusBadge model={model} />}
    >
      <div className="detail-grid detail-grid--three">
        <div>
          <span className="muted-caption">Horas confirmadas</span>
          <strong>{model.confirmedHours.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Pendientes</span>
          <strong>{model.pendingHours.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Incidencias</span>
          <strong>{model.issueCount}</strong>
        </div>
        <div>
          <span className="muted-caption">Excluidas</span>
          <strong>{model.excludedHours.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Total a pagar</span>
          <strong>{formatMoney(model.totalPay)}</strong>
        </div>
        <div>
          <span className="muted-caption">Tarifa media</span>
          <strong>{model.averageRate > 0 ? formatMoney(model.averageRate) : 'Pendiente'}</strong>
        </div>
        <div>
          <span className="muted-caption">Servicios</span>
          <strong>{model.serviceCount}</strong>
        </div>
        <div>
          <span className="muted-caption">Entradas</span>
          <strong>{model.entryCount}</strong>
        </div>
        <div>
          <span className="muted-caption">Pago interno</span>
          <strong>{model.paid ? 'Marcado' : 'Pendiente'}</strong>
        </div>
      </div>

      <WorkerClosureWarnings model={model} />

      <WorkerClosureActions
        model={model}
        month={month}
        onMarkReviewed={onMarkReviewed}
        onMarkPaid={onMarkPaid}
        onRevertPaid={onRevertPaid}
      />
    </Card>
  )
}
