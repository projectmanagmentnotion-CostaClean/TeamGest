import { Button } from '../../../components/ui/Button'
import type { HourEntry } from '../../../domain/hours/hourEntry.types'

type ActionPolicy = {
  allowed: boolean
  reason?: string
}

type HourReviewActionsProps = {
  entry: HourEntry
  confirmPolicy: ActionPolicy
  correctPolicy: ActionPolicy
  incidentPolicy: ActionPolicy
  excludePolicy: ActionPolicy
  restorePolicy: ActionPolicy
  onConfirm: () => void
  onCorrect: () => void
  onIncident: () => void
  onExclude: () => void
  onRestore: () => void
}

export function HourReviewActions({
  confirmPolicy,
  correctPolicy,
  entry,
  excludePolicy,
  incidentPolicy,
  onConfirm,
  onCorrect,
  onExclude,
  onIncident,
  onRestore,
  restorePolicy,
}: HourReviewActionsProps) {
  const blockedReason =
    confirmPolicy.reason ??
    correctPolicy.reason ??
    incidentPolicy.reason ??
    (entry.hourStatus === 'excluded' ? restorePolicy.reason : excludePolicy.reason)

  return (
    <div className="hour-review-actions">
      <Button size="sm" onClick={onConfirm} disabled={!confirmPolicy.allowed}>
        Confirmar
      </Button>
      <Button size="sm" variant="secondary" onClick={onCorrect} disabled={!correctPolicy.allowed}>
        Corregir
      </Button>
      <Button size="sm" variant="secondary" onClick={onIncident} disabled={!incidentPolicy.allowed}>
        Incidencia
      </Button>
      {entry.hourStatus === 'excluded' ? (
        <Button size="sm" variant="secondary" onClick={onRestore} disabled={!restorePolicy.allowed}>
          Restaurar
        </Button>
      ) : (
        <Button size="sm" variant="secondary" onClick={onExclude} disabled={!excludePolicy.allowed}>
          Excluir
        </Button>
      )}
      {blockedReason ? (
        <span className="muted-caption">No disponible: {blockedReason}</span>
      ) : null}
    </div>
  )
}
