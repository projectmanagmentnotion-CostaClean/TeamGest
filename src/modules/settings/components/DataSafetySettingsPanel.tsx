import { FormField } from '../../../components/forms/FormField'
import { Button } from '../../../components/ui/Button'
import type { DataSafetySettings } from '../../../domain/settings/appSettings.types'
import { SettingsSection } from './SettingsSection'
import { SettingsToggleField } from './SettingsToggleField'

type DataSafetySettingsPanelProps = {
  value: DataSafetySettings
  warning?: string
  onChange: (patch: Partial<DataSafetySettings>) => void
  onSave: () => void
  onResetSettings: () => void
}

export function DataSafetySettingsPanel({
  onChange,
  onResetSettings,
  onSave,
  value,
  warning,
}: DataSafetySettingsPanelProps) {
  return (
    <SettingsSection
      title="Datos y seguridad"
      description="Separa recordatorios, exportacion local, restauracion de ajustes y controles de acciones destructivas."
    >
      <div className="form-grid">
        <FormField
          control="select"
          label="Cadencia del recordatorio de backup"
          hint="Marca cada cuanto conviene exportar una copia local del sistema."
          value={value.backupReminderFrequency}
          options={[
            { label: 'Semanal', value: 'weekly' },
            { label: 'Cada dos semanas', value: 'biweekly' },
            { label: 'Mensual', value: 'monthly' },
          ]}
          onChange={(next) =>
            onChange({ backupReminderFrequency: next as DataSafetySettings['backupReminderFrequency'] })
          }
        />
      </div>
      <div className="settings-boolean-list">
        <SettingsToggleField
          checked={value.backupReminderEnabled}
          label="Activar recordatorio de backup"
          hint="Ayuda a no operar mucho tiempo sin una exportacion reciente."
          onChange={(checked) => onChange({ backupReminderEnabled: checked })}
        />
        <SettingsToggleField
          checked={value.showDangerZone}
          label="Mostrar zona de reinicio total"
          hint="Separa el reset destructivo del resto de herramientas de seguridad."
          onChange={(checked) => onChange({ showDangerZone: checked })}
        />
        <SettingsToggleField
          checked={value.requireTypedConfirmation}
          label="Exigir confirmacion escrita"
          hint="Mantiene confirmacion tipada antes del borrado completo local."
          onChange={(checked) => onChange({ requireTypedConfirmation: checked })}
        />
      </div>
      {warning ? <p className="warning-text">{warning}</p> : null}
      <div className="quick-actions">
        <Button onClick={onSave}>Guardar seguridad</Button>
        <Button variant="secondary" onClick={onResetSettings}>
          Restaurar ajustes por defecto
        </Button>
      </div>
    </SettingsSection>
  )
}
