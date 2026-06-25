import type { WarningItem } from '../../../domain/shared/warning.types'
import { Card } from '../../../components/ui/Card'
import { WarningBanner } from '../../../components/ui/WarningBanner'

type HourWarningsPanelProps = {
  warnings: WarningItem[]
}

export function HourWarningsPanel({ warnings }: HourWarningsPanelProps) {
  return (
    <Card title="Alertas del control de horas" description="Senales que afectan revision, correccion o cierre mensual.">
      {warnings.length === 0 ? (
        <p className="muted-caption">Sin alertas activas en las horas visibles.</p>
      ) : (
        <div className="stack-list">
          {warnings.map((warning) => (
            <WarningBanner
              key={`${warning.title}-${warning.entityLabel ?? warning.message}`}
              title={warning.title}
              tone={
                warning.level === 'danger'
                  ? 'danger'
                  : warning.level === 'blocked'
                    ? 'blocked'
                    : warning.level === 'warning'
                      ? 'warning'
                      : 'info'
              }
              compact
            >
              {warning.message}
            </WarningBanner>
          ))}
        </div>
      )}
    </Card>
  )
}
