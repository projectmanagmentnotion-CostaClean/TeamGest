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
      description="Aclara el alcance real del runtime. Este panel informa, pero no activa backend ni integraciones."
      action={<Badge tone="info">Solo local</Badge>}
    >
      <div className="detail-grid detail-grid--three">
        <div>
          <span className="muted-caption">Modo actual</span>
          <strong>Local</strong>
        </div>
        <div>
          <span className="muted-caption">Backend/Supabase</span>
          <strong>No activo</strong>
        </div>
        <div>
          <span className="muted-caption">Autenticacion</span>
          <strong>No activa</strong>
        </div>
        <div>
          <span className="muted-caption">Estado data-real</span>
          <strong>{value.dataRealStatus === 'planning_only' ? 'Solo planificacion' : value.dataRealStatus}</strong>
        </div>
        <div>
          <span className="muted-caption">Pagos reales</span>
          <strong>No activos</strong>
        </div>
        <div>
          <span className="muted-caption">Version de ajustes</span>
          <strong>{value.settingsVersion}</strong>
        </div>
      </div>
    </SettingsSection>
  )
}
