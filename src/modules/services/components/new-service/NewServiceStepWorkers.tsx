import { Badge } from '../../../../components/ui/Badge'
import type { Worker } from '../../../../domain/workers/worker.types'
import { formatWorkerRoleLabel } from '../../../../utils/labels'
import { formatMoney } from '../../../../utils/money'

type NewServiceStepWorkersProps = {
  workers: Worker[]
  selectedWorkerIds: string[]
  onToggle: (workerId: string) => void
}

export function NewServiceStepWorkers({
  onToggle,
  selectedWorkerIds,
  workers,
}: NewServiceStepWorkersProps) {
  return (
    <div className="cards-grid">
      {workers.map((worker) => {
        const isSelected = selectedWorkerIds.includes(worker.id)

        return (
          <button
            key={worker.id}
            className={`choice-card${isSelected ? ' is-selected' : ''}`}
            type="button"
            onClick={() => onToggle(worker.id)}
          >
            <div className="row-card__main">
              <div>
                <strong>{worker.name}</strong>
                <p>{formatWorkerRoleLabel(worker.role)}</p>
              </div>
              <Badge tone={(worker.defaultHourlyRate ?? 0) > 0 ? 'success' : 'warning'}>
                {worker.defaultHourlyRate ? formatMoney(worker.defaultHourlyRate) : 'Tarifa pendiente'}
              </Badge>
            </div>
          </button>
        )
      })}
    </div>
  )
}
