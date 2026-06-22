import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { ConfirmDangerBox } from '../ui/ConfirmDangerBox'

type EntityDeleteDialogProps = {
  title: string
  description: string
  blockedReason?: string
  confirmLabel?: string
  confirmationWord?: string
  onConfirm: () => void
}

export function EntityDeleteDialog({
  blockedReason,
  confirmLabel = 'Eliminar localmente',
  confirmationWord = 'ELIMINAR',
  description,
  onConfirm,
  title,
}: EntityDeleteDialogProps) {
  const [confirmation, setConfirmation] = useState('')
  const isBlocked = Boolean(blockedReason)

  return (
    <ConfirmDangerBox
      title={title}
      description={description}
      action={
        <Button
          variant="ghost"
          onClick={onConfirm}
          disabled={isBlocked || confirmation.trim().toUpperCase() !== confirmationWord}
        >
          {confirmLabel}
        </Button>
      }
    >
      <p className="page-description">
        {blockedReason ?? 'La eliminacion solo borra el registro local de esta sprint.'}
      </p>
      {!isBlocked ? (
        <Input
          label="Confirmacion obligatoria"
          hint={`Escribe ${confirmationWord} para habilitar la eliminacion.`}
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
        />
      ) : null}
    </ConfirmDangerBox>
  )
}
