import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import type { WarningItem } from '../../../domain/shared/warning.types'
import { formatWarningLevelLabel, getWarningLevelTone } from '../../../utils/labels'

type DashboardWarningsProps = {
  warnings: WarningItem[]
}

export function DashboardWarnings({ warnings }: DashboardWarningsProps) {
  return (
    <Card
      title="Alertas críticas"
      description="Priorizadas por impacto operativo para actuar primero sobre lo urgente."
      action={<span className="section-link">Ver todos</span>}
    >
      <div className="stack-list">
        {warnings.slice(0, 5).map((warning, index) => (
          <article key={`${warning.title}-${index}`} className="warning-item">
            <div className="warning-item__header">
              <Badge tone={getWarningLevelTone(warning.level)}>
                {formatWarningLevelLabel(warning.level)}
              </Badge>
              {warning.entityLabel ? <span className="muted-caption">{warning.entityLabel}</span> : null}
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
