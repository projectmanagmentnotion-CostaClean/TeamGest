import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import type { WorkerClosureCardModel } from '../services/monthlyClosure.types'

type WorkerClosureActionsProps = {
  model: WorkerClosureCardModel
  month: string
  onMarkReviewed: (workerId: string) => void
  onMarkPaid: (workerId: string) => void
  onRevertPaid: (workerId: string) => void
}

export function WorkerClosureActions({
  model,
  month,
  onMarkPaid,
  onMarkReviewed,
  onRevertPaid,
}: WorkerClosureActionsProps) {
  return (
    <div className="worker-closure-actions">
      <Link className="button button--ghost button--sm" to={`/payroll/${month}/workers/${model.workerId}`}>
        Ver detalle
      </Link>
      <Link className="button button--ghost button--sm" to={`/hours/workers/${model.workerId}`}>
        Ver horas
      </Link>
      <Link
        className="button button--ghost button--sm"
        to={`/hours/review?month=${month}&workerId=${model.workerId}`}
      >
        Revisar horas
      </Link>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => onMarkReviewed(model.workerId)}
        disabled={!model.actionAvailability.canMarkReviewed}
        title={model.actionAvailability.canMarkReviewed ? undefined : model.actionAvailability.reason}
      >
        Marcar revisado
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => onMarkPaid(model.workerId)}
        disabled={!model.actionAvailability.canMarkPaid}
        title={model.actionAvailability.canMarkPaid ? undefined : model.actionAvailability.reason}
      >
        Marcar pagado
      </Button>
      {model.actionAvailability.canRevertPaid ? (
        <Button size="sm" variant="ghost" onClick={() => onRevertPaid(model.workerId)}>
          Revertir pagado
        </Button>
      ) : null}
      {!model.actionAvailability.canMarkReviewed && model.actionAvailability.reason ? (
        <p className="muted-caption">{model.actionAvailability.reason}</p>
      ) : null}
    </div>
  )
}
