import { Badge } from '../../../components/ui/Badge'
import { SettingsSection } from './SettingsSection'

type SettingsHealthPanelProps = {
  settingsVersion: number
  customizedSections: string[]
  warnings: string[]
}

export function SettingsHealthPanel({
  customizedSections,
  settingsVersion,
  warnings,
}: SettingsHealthPanelProps) {
  return (
    <SettingsSection
      title="Salud de ajustes"
      description="Valida la configuracion tipada, su version y el alcance real del modo local."
      action={<Badge tone={warnings.length === 0 ? 'success' : 'warning'}>{warnings.length === 0 ? 'valido' : 'revisar'}</Badge>}
    >
      <div className="detail-grid">
        <div>
          <span className="muted-caption">Version de ajustes</span>
          <strong>{settingsVersion}</strong>
        </div>
        <div>
          <span className="muted-caption">Secciones personalizadas</span>
          <strong>{customizedSections.length}</strong>
        </div>
        <div>
          <span className="muted-caption">Advertencias</span>
          <strong>{warnings.length}</strong>
        </div>
        <div>
          <span className="muted-caption">Modo</span>
          <strong>Local first</strong>
        </div>
      </div>

      {warnings.length > 0 ? (
        <div className="stack-list">
          {warnings.map((warning) => (
            <p key={warning} className="muted-caption">
              {warning}
            </p>
          ))}
        </div>
      ) : null}
    </SettingsSection>
  )
}
