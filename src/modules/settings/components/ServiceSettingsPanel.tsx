import { FormField } from '../../../components/forms/FormField'
import { Button } from '../../../components/ui/Button'
import type { ServiceSettings } from '../../../domain/settings/appSettings.types'
import { SettingsSection } from './SettingsSection'

type ServiceSettingsPanelProps = {
  value: ServiceSettings
  warning?: string
  onChange: (patch: Partial<ServiceSettings>) => void
  onSave: () => void
}

export function ServiceSettingsPanel({
  onChange,
  onSave,
  value,
  warning,
}: ServiceSettingsPanelProps) {
  return (
    <SettingsSection
      title="Servicios"
      description="Preferencias de alta manual y proteccion de edicion frente a cierres bloqueados."
    >
      <div className="form-grid">
        <FormField
          control="select"
          label="Tipo por defecto"
          value={value.defaultServiceType}
          options={[
            { label: 'Limpieza basica', value: 'basic_cleaning' },
            { label: 'Limpieza profunda', value: 'deep_cleaning' },
            { label: 'Final de obra', value: 'post_construction' },
            { label: 'Cambio turistico', value: 'airbnb_turnover' },
            { label: 'Gimnasio', value: 'gym_cleaning' },
            { label: 'Oficina', value: 'office_cleaning' },
            { label: 'Cristales', value: 'windows' },
            { label: 'Extra', value: 'extra' },
            { label: 'Otro', value: 'other' },
          ]}
          onChange={(next) => onChange({ defaultServiceType: next as ServiceSettings['defaultServiceType'] })}
        />
      </div>
      <div className="settings-boolean-list">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.defaultAssignmentConfirmed}
            onChange={(event) => onChange({ defaultAssignmentConfirmed: event.target.checked })}
          />
          <span>Confirmar asignaciones por defecto al crear manualmente</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.blockServiceEditWhenPayrollLocked}
            onChange={(event) => onChange({ blockServiceEditWhenPayrollLocked: event.target.checked })}
          />
          <span>Bloquear edicion cuando el mes de payroll este cerrado</span>
        </label>
      </div>
      {warning ? <p className="warning-text">{warning}</p> : null}
      <div className="quick-actions">
        <Button onClick={onSave}>Guardar servicios</Button>
      </div>
    </SettingsSection>
  )
}
