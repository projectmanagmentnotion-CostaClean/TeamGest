import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { ConfirmDangerBox } from '../ui/ConfirmDangerBox'

type EntityArchiveDialogProps = {
  title: string
  description: string
  archived?: boolean
  confirmationWord?: string
  onToggle: () => void
}

export function EntityArchiveDialog({
  archived,
  confirmationWord = archived ? 'RESTAURAR' : 'ARCHIVAR',
  description,
  onToggle,
  title,
}: EntityArchiveDialogProps) {
  const [confirmation, setConfirmation] = useState('')

  return (
    <ConfirmDangerBox
      title={title}
      description={description}
      action={
        <Button
          variant="secondary"
          onClick={onToggle}
          disabled={confirmation.trim().toUpperCase() !== confirmationWord}
        >
          {archived ? 'Restaurar' : 'Archivar'}
        </Button>
      }
    >
      <p className="page-description">
        {archived
          ? 'El registro volvera a aparecer en listados activos sin perder auditoria local.'
          : 'El registro dejara de aparecer en los listados activos, pero seguira disponible para restaurar.'}
      </p>
      <Input
        label="Confirmacion obligatoria"
        hint={`Escribe ${confirmationWord} para habilitar la accion.`}
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
      />
    </ConfirmDangerBox>
  )
}
