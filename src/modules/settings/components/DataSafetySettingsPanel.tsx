import { FormField } from '../../../components/forms/FormField'
import { Button } from '../../../components/ui/Button'
import type { DataSafetySettings } from '../../../domain/settings/appSettings.types'
import { SettingsSection } from './SettingsSection'

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
      description="Preferencias locales de recordatorio, visibilidad del danger zone y restauracion de ajustes."
    >
      <div className="form-grid">
        <FormField
          control="select"
          label="Cadencia del recordatorio de backup"
          value={value.backupReminderFrequency}
          options={[
            { label: 'Semanal', value: 'weekly' },
            { label: 'Cada dos semanas', value: 'biweekly' },
            { label: 'Mensual', value: 'monthly' },
          ]}
          onChange={(next) => onChange({ backupReminderFrequency: next as DataSafetySettings['backupReminderFrequency'] })}
        />
      </div>
      <div className="settings-boolean-list">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.backupReminderEnabled}
            onChange={(event) => onChange({ backupReminderEnabled: event.target.checked })}
          />
          <span>Activar control de antiguedad del backup</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.showDangerZone}
            onChange={(event) => onChange({ showDangerZone: event.target.checked })}
          />
          <span>Mostrar la zona de acciones destructivas en ajustes</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.requireTypedConfirmation}
            onChange={(event) => onChange({ requireTypedConfirmation: event.target.checked })}
          />
          <span>Exigir confirmacion escrita en acciones de reset total</span>
        </label>
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
