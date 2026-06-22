import { FormField } from '../../../components/forms/FormField'
import { Button } from '../../../components/ui/Button'
import type { HoursSettings } from '../../../domain/settings/appSettings.types'
import { SettingsSection } from './SettingsSection'
import { SettingsToggleField } from './SettingsToggleField'

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
          hint="Se usa como respaldo cuando el trabajador no tiene tarifa valida."
          value={value.defaultHourlyRate}
          onChange={(next) => onChange({ defaultHourlyRate: Number(next) || 0 })}
        />
        <FormField
          type="number"
          min={0}
          step={0.25}
          label="Minimo por entrada"
          hint="Evita guardar registros por debajo del umbral operativo minimo."
          value={value.minimumHoursPerEntry}
          onChange={(next) => onChange({ minimumHoursPerEntry: Number(next) || 0 })}
        />
        <FormField
          control="select"
          label="Redondeo horario"
          hint="Normaliza horas derivadas de horario cuando aplique."
          value={String(value.roundHoursToNearestMinutes)}
          options={[
            { label: 'Sin redondeo', value: '0' },
            { label: '5 minutos', value: '5' },
            { label: '10 minutos', value: '10' },
            { label: '15 minutos', value: '15' },
            { label: '30 minutos', value: '30' },
          ]}
          onChange={(next) =>
            onChange({
              roundHoursToNearestMinutes: Number(next) as HoursSettings['roundHoursToNearestMinutes'],
            })
          }
        />
      </div>
      <div className="settings-boolean-list">
        <SettingsToggleField
          checked={value.requireRateForPayroll}
          label="Exigir tarifa valida"
          hint="Bloquea la inclusion en cierres si falta una tarifa utilizable."
          onChange={(checked) => onChange({ requireRateForPayroll: checked })}
        />
        <SettingsToggleField
          checked={value.requireConfirmedHoursForPayroll}
          label="Exigir confirmacion de horas"
          hint="Solo las horas confirmadas deben pasar al cierre mensual."
          onChange={(checked) => onChange({ requireConfirmedHoursForPayroll: checked })}
        />
        <SettingsToggleField
          checked={value.allowFutureCompletedEntries}
          label="Permitir completados futuros"
          hint="Mantener desactivado reduce cierres adelantados por error."
          onChange={(checked) => onChange({ allowFutureCompletedEntries: checked })}
        />
      </div>
      {warning ? <p className="warning-text">{warning}</p> : null}
      <div className="quick-actions">
        <Button onClick={onSave}>Guardar reglas de horas</Button>
      </div>
    </SettingsSection>
  )
}
