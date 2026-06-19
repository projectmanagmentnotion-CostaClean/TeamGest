import { Button } from '../ui/Button'
import { ConfirmDangerBox } from '../ui/ConfirmDangerBox'

type EntityDeleteDialogProps = {
  title: string
  description: string
  blockedReason?: string
  confirmLabel?: string
  onConfirm: () => void
}

export function EntityDeleteDialog({
  blockedReason,
  confirmLabel = 'Eliminar localmente',
  description,
  onConfirm,
  title,
}: EntityDeleteDialogProps) {
  return (
    <ConfirmDangerBox
      title={title}
      description={description}
      action={
        <Button variant="ghost" onClick={onConfirm} disabled={Boolean(blockedReason)}>
          {confirmLabel}
        </Button>
      }
    >
      <p className="page-description">
        {blockedReason ?? 'La eliminacion solo borra el registro local de esta sprint.'}
      </p>
    </ConfirmDangerBox>
  )
}
