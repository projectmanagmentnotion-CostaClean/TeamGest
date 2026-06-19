import { Button } from '../ui/Button'
import { ConfirmDangerBox } from '../ui/ConfirmDangerBox'

type EntityArchiveDialogProps = {
  title: string
  description: string
  archived?: boolean
  onToggle: () => void
}

export function EntityArchiveDialog({
  archived,
  description,
  onToggle,
  title,
}: EntityArchiveDialogProps) {
  return (
    <ConfirmDangerBox
      title={title}
      description={description}
      action={
        <Button variant="secondary" onClick={onToggle}>
          {archived ? 'Restaurar' : 'Archivar'}
        </Button>
      }
    >
      <p className="page-description">
        {archived
          ? 'El registro volvera a aparecer en listados activos sin perder auditoria local.'
          : 'El registro dejara de aparecer en los listados activos, pero seguira disponible para restaurar.'}
      </p>
    </ConfirmDangerBox>
  )
}
