import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import type { WarningItem } from '../../../domain/shared/warning.types'
import { formatWarningLevelLabel, getWarningLevelTone } from '../../../utils/labels'

type WorkerWarningsPanelProps = {
  warnings: WarningItem[]
}

export function WorkerWarningsPanel({ warnings }: WorkerWarningsPanelProps) {
  if (warnings.length === 0) {
    return (
      <Card title="Alertas del trabajador" description="Señales operativas y de payroll relacionadas.">
        <EmptyState
          title="Sin incidencias activas"
          description="El trabajador no presenta alertas relevantes con los datos actuales."
        />
      </Card>
    )
  }

  return (
    <Card title="Alertas del trabajador" description="Señales operativas y de payroll relacionadas.">
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
