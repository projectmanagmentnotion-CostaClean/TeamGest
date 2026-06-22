import { Badge } from '../../../components/ui/Badge'
import type { SystemSettings } from '../../../domain/settings/appSettings.types'
import { SettingsSection } from './SettingsSection'

type SystemSettingsPanelProps = {
  value: SystemSettings
}

export function SystemSettingsPanel({ value }: SystemSettingsPanelProps) {
  return (
    <SettingsSection
      title="Sistema"
      description="Estado operativo real del runtime actual. Solo se muestran capacidades activas hoy."
      action={<Badge tone="info">Local only</Badge>}
    >
      <div className="detail-grid detail-grid--three">
        <div>
          <span className="muted-caption">Modo actual</span>
          <strong>Local</strong>
        </div>
        <div>
          <span className="muted-caption">Supabase/backend</span>
          <strong>No activo</strong>
        </div>
        <div>
          <span className="muted-caption">Auth</span>
          <strong>No activo</strong>
        </div>
        <div>
          <span className="muted-caption">Data real</span>
          <strong>{value.dataRealStatus}</strong>
        </div>
        <div>
          <span className="muted-caption">Version de ajustes</span>
          <strong>{value.settingsVersion}</strong>
        </div>
        <div>
          <span className="muted-caption">Pagos reales</span>
          <strong>No activos</strong>
        </div>
      </div>
    </SettingsSection>
  )
}
