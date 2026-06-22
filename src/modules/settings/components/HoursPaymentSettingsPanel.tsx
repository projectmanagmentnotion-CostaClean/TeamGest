import { FormField } from '../../../components/forms/FormField'
import { Button } from '../../../components/ui/Button'
import type { HoursSettings } from '../../../domain/settings/appSettings.types'
import { SettingsSection } from './SettingsSection'

type HoursPaymentSettingsPanelProps = {
  value: HoursSettings
  warning?: string
  onChange: (patch: Partial<HoursSettings>) => void
  onSave: () => void
}

export function HoursPaymentSettingsPanel({
  onChange,
  onSave,
  value,
  warning,
}: HoursPaymentSettingsPanelProps) {
  return (
    <SettingsSection
      title="Horas y pagos"
      description="Politicas base para horas minimas, redondeo y criterios de inclusion en payroll."
    >
      <div className="form-grid">
        <FormField
          type="number"
          min={0}
          step={0.5}
          label="Tarifa por defecto"
          value={value.defaultHourlyRate}
          onChange={(next) => onChange({ defaultHourlyRate: Number(next) || 0 })}
        />
        <FormField
          type="number"
          min={0}
          step={0.25}
          label="Minimo por entrada"
          value={value.minimumHoursPerEntry}
          onChange={(next) => onChange({ minimumHoursPerEntry: Number(next) || 0 })}
        />
        <FormField
          control="select"
          label="Redondeo horario"
          value={String(value.roundHoursToNearestMinutes)}
          options={[
            { label: 'Sin redondeo', value: '0' },
            { label: '5 minutos', value: '5' },
            { label: '10 minutos', value: '10' },
            { label: '15 minutos', value: '15' },
            { label: '30 minutos', value: '30' },
          ]}
          onChange={(next) => onChange({ roundHoursToNearestMinutes: Number(next) as HoursSettings['roundHoursToNearestMinutes'] })}
        />
      </div>
      <div className="settings-boolean-list">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.requireRateForPayroll}
            onChange={(event) => onChange({ requireRateForPayroll: event.target.checked })}
          />
          <span>Exigir tarifa valida antes de entrar en payroll</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.requireConfirmedHoursForPayroll}
            onChange={(event) => onChange({ requireConfirmedHoursForPayroll: event.target.checked })}
          />
          <span>Exigir confirmacion antes de incluir horas en payroll</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.allowFutureCompletedEntries}
            onChange={(event) => onChange({ allowFutureCompletedEntries: event.target.checked })}
          />
          <span>Permitir servicios futuros en estado completado</span>
        </label>
      </div>
      {warning ? <p className="warning-text">{warning}</p> : null}
      <div className="quick-actions">
        <Button onClick={onSave}>Guardar reglas de horas</Button>
      </div>
    </SettingsSection>
  )
}
