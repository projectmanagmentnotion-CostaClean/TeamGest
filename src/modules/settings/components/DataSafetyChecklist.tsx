import { Badge } from '../../../components/ui/Badge'
import type { DataSafetyChecklistItem } from '../services/dataSafety'
import { SettingsSection } from './SettingsSection'

type DataSafetyChecklistProps = {
  items: DataSafetyChecklistItem[]
  riskLevel: 'low' | 'medium' | 'high'
}

function getRiskTone(riskLevel: DataSafetyChecklistProps['riskLevel']) {
  if (riskLevel === 'high') {
    return 'danger' as const
  }

  if (riskLevel === 'medium') {
    return 'warning' as const
  }

  return 'success' as const
}

export function DataSafetyChecklist({ items, riskLevel }: DataSafetyChecklistProps) {
  return (
    <SettingsSection
      title="Checklist de seguridad"
      description="Controles rápidos para reducir pérdida accidental de datos locales."
      action={<Badge tone={getRiskTone(riskLevel)}>Riesgo {riskLevel}</Badge>}
    >
      <div className="stack-list">
        {items.map((item) => (
          <div key={item.id} className="row-card">
            <div className="row-card__main">
              <div>
                <h4>{item.label}</h4>
                <p>{item.description}</p>
              </div>
              <Badge tone={item.status === 'ok' ? 'success' : 'warning'}>
                {item.status === 'ok' ? 'OK' : 'Revisar'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </SettingsSection>
  )
}
