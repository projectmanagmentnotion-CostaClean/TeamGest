import { FormField } from '../../../components/forms/FormField'
import { Button } from '../../../components/ui/Button'
import type { DisplaySettings } from '../../../domain/settings/appSettings.types'
import { SettingsSection } from './SettingsSection'
import { SettingsToggleField } from './SettingsToggleField'

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
          hint="Ajusta la separacion visual entre bloques y listas."
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
          hint="Define como se muestran las fechas en tablas y fichas."
          value={value.preferredDateFormat}
          options={[
            { label: 'DD/MM/AAAA', value: 'dd/MM/yyyy' },
            { label: 'AAAA-MM-DD', value: 'yyyy-MM-dd' },
          ]}
          onChange={(next) =>
            onChange({ preferredDateFormat: next as DisplaySettings['preferredDateFormat'] })
          }
        />
        <FormField
          control="select"
          label="Formato de hora"
          hint="Afecta la lectura visual de horas en pantallas operativas."
          value={value.preferredTimeFormat}
          options={[
            { label: '24 horas', value: '24h' },
            { label: '12 horas', value: '12h' },
          ]}
          onChange={(next) =>
            onChange({ preferredTimeFormat: next as DisplaySettings['preferredTimeFormat'] })
          }
        />
      </div>
      <div className="settings-boolean-list">
        <SettingsToggleField
          checked={value.showTechnicalIds}
          label="Mostrar identificadores tecnicos"
          hint="Util para soporte interno, pero no necesario en operacion diaria."
          onChange={(checked) => onChange({ showTechnicalIds: checked })}
        />
      </div>
      {warning ? <p className="warning-text">{warning}</p> : null}
      <div className="quick-actions">
        <Button onClick={onSave}>Guardar visualizacion</Button>
      </div>
    </SettingsSection>
  )
}
