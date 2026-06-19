import { Card } from '../ui/Card'
import { WarningBanner } from '../ui/WarningBanner'

type FormValidationPanelProps = {
  title?: string
  errors: string[]
}

export function FormValidationPanel({
  errors,
  title = 'Validacion del borrador',
}: FormValidationPanelProps) {
  if (errors.length === 0) {
    return (
      <Card title={title} description="El borrador local cumple las validaciones base de esta sprint.">
        <p className="muted-caption">Sin bloqueos actuales para guardar.</p>
      </Card>
    )
  }

  return (
    <WarningBanner title={title} tone="warning">
      {errors[0]}
    </WarningBanner>
  )
}
