import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import type { WarningItem } from '../../../domain/shared/warning.types'
import { formatWarningLevelLabel, getWarningLevelTone } from '../../../utils/labels'

type ServiceWarningsPanelProps = {
  warnings: WarningItem[]
}

export function ServiceWarningsPanel({ warnings }: ServiceWarningsPanelProps) {
  if (warnings.length === 0) {
    return (
      <Card title="Alertas del servicio" description="Validaciones operativas y de coste del servicio.">
        <EmptyState
          title="Sin incidencias activas"
          description="El servicio no presenta alertas relevantes en los datos actuales."
        />
      </Card>
    )
  }

  return (
    <Card title="Alertas del servicio" description="Validaciones operativas y de coste del servicio.">
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
