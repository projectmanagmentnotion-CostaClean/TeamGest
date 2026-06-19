import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import type { WarningItem } from '../../../domain/shared/warning.types'
import { formatWarningLevelLabel, getWarningLevelTone } from '../../../utils/labels'

type PayrollWarningsPanelProps = {
  warnings: WarningItem[]
}

export function PayrollWarningsPanel({ warnings }: PayrollWarningsPanelProps) {
  if (warnings.length === 0) {
    return (
      <Card title="Alertas de payroll" description="Validaciones del mes y del cierre operativo.">
        <EmptyState
          title="Sin incidencias activas"
          description="No se han detectado alertas relevantes para el mes seleccionado."
        />
      </Card>
    )
  }

  return (
    <Card title="Alertas de payroll" description="Validaciones del mes y del cierre operativo.">
      <div className="stack-list">
        {warnings.map((warning, index) => (
          <article key={`${warning.title}-${index}`} className="warning-item">
            <div className="warning-item__header">
              <Badge tone={getWarningLevelTone(warning.level)}>
                {formatWarningLevelLabel(warning.level)}
              </Badge>
            </div>
            <div>
              <h4>{warning.title}</h4>
              <p>{warning.message}</p>
            </div>
          </article>
        ))}
      </div>
    </Card>
  )
}
