import { Badge } from '../../../components/ui/Badge'
import { SettingsSection } from './SettingsSection'

type SettingsHealthPanelProps = {
  backupCoverageLabel: string
  runtimeLabel: string
  settingsVersion: number
  storageModeLabel: string
  customizedSections: string[]
  warnings: string[]
}

export function SettingsHealthPanel({
  backupCoverageLabel,
  customizedSections,
  runtimeLabel,
  settingsVersion,
  storageModeLabel,
  warnings,
}: SettingsHealthPanelProps) {
  const isValid = warnings.length === 0

  return (
    <SettingsSection
      title="Salud de ajustes"
      description="Resume la validez tipada, el alcance local del runtime y la cobertura actual de seguridad."
      action={<Badge tone={isValid ? 'success' : 'warning'}>{isValid ? 'valido' : 'revisar'}</Badge>}
    >
      <div className="detail-grid">
        <div>
          <span className="muted-caption">Estado</span>
          <strong>{isValid ? 'Valido' : 'Con advertencias'}</strong>
        </div>
        <div>
          <span className="muted-caption">Version de ajustes</span>
          <strong>{settingsVersion}</strong>
        </div>
        <div>
          <span className="muted-caption">Modo de almacenamiento</span>
          <strong>{storageModeLabel}</strong>
        </div>
        <div>
          <span className="muted-caption">Backend y auth</span>
          <strong>{runtimeLabel}</strong>
        </div>
        <div>
          <span className="muted-caption">Cobertura de backup</span>
          <strong>{backupCoverageLabel}</strong>
        </div>
        <div>
          <span className="muted-caption">Secciones personalizadas</span>
          <strong>{customizedSections.length}</strong>
        </div>
        <div>
          <span className="muted-caption">Advertencias</span>
          <strong>{warnings.length}</strong>
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
