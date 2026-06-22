import { FormField } from '../../../components/forms/FormField'
import { Button } from '../../../components/ui/Button'
import type { DisplaySettings } from '../../../domain/settings/appSettings.types'
import { SettingsSection } from './SettingsSection'

type DisplaySettingsPanelProps = {
  value: DisplaySettings
  warning?: string
  onChange: (patch: Partial<DisplaySettings>) => void
  onSave: () => void
}

export function DisplaySettingsPanel({
  onChange,
  onSave,
  value,
  warning,
}: DisplaySettingsPanelProps) {
  return (
    <SettingsSection
      title="Visualizacion"
      description="Preferencias de densidad y formatos visibles que no alteran la logica operativa."
    >
      <div className="form-grid">
        <FormField
          control="select"
          label="Densidad"
          value={value.density}
          options={[
            { label: 'Confortable', value: 'comfortable' },
            { label: 'Compacta', value: 'compact' },
          ]}
          onChange={(next) => onChange({ density: next as DisplaySettings['density'] })}
        />
        <FormField
          control="select"
          label="Formato de fecha"
          value={value.preferredDateFormat}
          options={[
            { label: 'DD/MM/AAAA', value: 'dd/MM/yyyy' },
            { label: 'AAAA-MM-DD', value: 'yyyy-MM-dd' },
          ]}
          onChange={(next) => onChange({ preferredDateFormat: next as DisplaySettings['preferredDateFormat'] })}
        />
        <FormField
          control="select"
          label="Formato de hora"
          value={value.preferredTimeFormat}
          options={[
            { label: '24 horas', value: '24h' },
            { label: '12 horas', value: '12h' },
          ]}
          onChange={(next) => onChange({ preferredTimeFormat: next as DisplaySettings['preferredTimeFormat'] })}
        />
      </div>
      <div className="settings-boolean-list">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.showTechnicalIds}
            onChange={(event) => onChange({ showTechnicalIds: event.target.checked })}
          />
          <span>Mostrar identificadores tecnicos cuando sea posible</span>
        </label>
      </div>
      {warning ? <p className="warning-text">{warning}</p> : null}
      <div className="quick-actions">
        <Button onClick={onSave}>Guardar visualizacion</Button>
      </div>
    </SettingsSection>
  )
}
