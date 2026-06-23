import { Badge } from '../../../components/ui/Badge'
import type { WorkerClosureCardModel } from '../services/monthlyClosure.types'

function getWorkerClosureTone(model: WorkerClosureCardModel) {
  if (model.locked) {
    return 'blocked' as const
  }

  if (model.paid) {
    return 'success' as const
  }

  if (model.issueCount > 0) {
    return 'danger' as const
  }

  if (model.pendingHours > 0) {
    return 'warning' as const
  }

  if (model.reviewed) {
    return 'info' as const
  }

  if (model.readyToPay) {
    return 'success' as const
  }

  return 'neutral' as const
}

type WorkerClosureStatusBadgeProps = {
  model: WorkerClosureCardModel
}

export function WorkerClosureStatusBadge({ model }: WorkerClosureStatusBadgeProps) {
  return <Badge tone={getWorkerClosureTone(model)}>{model.statusLabel}</Badge>
}
