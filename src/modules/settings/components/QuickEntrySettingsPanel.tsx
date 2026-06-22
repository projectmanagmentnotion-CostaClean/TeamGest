import { FormField } from '../../../components/forms/FormField'
import { Button } from '../../../components/ui/Button'
import type { QuickEntrySettings } from '../../../domain/settings/appSettings.types'
import { SettingsSection } from './SettingsSection'

type QuickEntrySettingsPanelProps = {
  value: QuickEntrySettings
  warning?: string
  onChange: (patch: Partial<QuickEntrySettings>) => void
  onSave: () => void
}

export function QuickEntrySettingsPanel({
  onChange,
  onSave,
  value,
  warning,
}: QuickEntrySettingsPanelProps) {
  return (
    <SettingsSection
      title="Registro rapido"
      description="Ajustes seguros del flujo principal para registrar trabajo ya realizado."
    >
      <div className="form-grid">
        <FormField
          control="select"
          label="Estado por defecto en fecha pasada"
          value={value.defaultServiceStatusForPastDate}
          options={[
            { label: 'Completado', value: 'completed' },
            { label: 'Revisado', value: 'reviewed' },
          ]}
          onChange={(next) => onChange({ defaultServiceStatusForPastDate: next as QuickEntrySettings['defaultServiceStatusForPastDate'] })}
        />
        <FormField
          control="select"
          label="Estado por defecto en fecha futura"
          value={value.defaultServiceStatusForFutureDate}
          options={[
            { label: 'Programado', value: 'scheduled' },
            { label: 'Borrador', value: 'draft' },
          ]}
          onChange={(next) => onChange({ defaultServiceStatusForFutureDate: next as QuickEntrySettings['defaultServiceStatusForFutureDate'] })}
        />
      </div>
      <div className="settings-boolean-list">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.defaultConfirmed}
            onChange={(event) => onChange({ defaultConfirmed: event.target.checked })}
          />
          <span>Confirmar asignacion por defecto al guardar</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.rememberLastWorker}
            onChange={(event) => onChange({ rememberLastWorker: event.target.checked })}
          />
          <span>Recordar el ultimo trabajador usado</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.rememberLastProperty}
            onChange={(event) => onChange({ rememberLastProperty: event.target.checked })}
          />
          <span>Recordar el ultimo inmueble usado</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.showPayrollImpactMessage}
            onChange={(event) => onChange({ showPayrollImpactMessage: event.target.checked })}
          />
          <span>Mostrar el mensaje de impacto en payroll al revisar</span>
        </label>
      </div>
      {warning ? <p className="warning-text">{warning}</p> : null}
      <div className="quick-actions">
        <Button onClick={onSave}>Guardar registro rapido</Button>
      </div>
    </SettingsSection>
  )
}
