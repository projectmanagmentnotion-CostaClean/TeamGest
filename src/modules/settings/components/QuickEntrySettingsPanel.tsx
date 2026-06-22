import { FormField } from '../../../components/forms/FormField'
import { Button } from '../../../components/ui/Button'
import type { QuickEntrySettings } from '../../../domain/settings/appSettings.types'
import { SettingsSection } from './SettingsSection'
import { SettingsToggleField } from './SettingsToggleField'

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
      description="Controla el comportamiento por defecto del flujo principal para registrar horas ya trabajadas."
    >
      <div className="form-grid">
        <FormField
          control="select"
          label="Estado por defecto en fecha pasada"
          hint="Define como se guarda una entrada con fecha anterior a hoy."
          value={value.defaultServiceStatusForPastDate}
          options={[
            { label: 'Completado', value: 'completed' },
            { label: 'Revisado', value: 'reviewed' },
          ]}
          onChange={(next) =>
            onChange({
              defaultServiceStatusForPastDate:
                next as QuickEntrySettings['defaultServiceStatusForPastDate'],
            })
          }
        />
        <FormField
          control="select"
          label="Estado por defecto en fecha futura"
          hint="Evita marcar por error trabajo futuro como ya ejecutado."
          value={value.defaultServiceStatusForFutureDate}
          options={[
            { label: 'Programado', value: 'scheduled' },
            { label: 'Borrador', value: 'draft' },
          ]}
          onChange={(next) =>
            onChange({
              defaultServiceStatusForFutureDate:
                next as QuickEntrySettings['defaultServiceStatusForFutureDate'],
            })
          }
        />
      </div>
      <div className="settings-boolean-list">
        <SettingsToggleField
          checked={value.defaultConfirmed}
          label="Confirmar asignacion por defecto"
          hint="Marca la asignacion como confirmada al guardar si no hay incidencia."
          onChange={(checked) => onChange({ defaultConfirmed: checked })}
        />
        <SettingsToggleField
          checked={value.rememberLastWorker}
          label="Recordar ultimo trabajador"
          hint="Acelera nuevas entradas reutilizando el trabajador mas reciente."
          onChange={(checked) => onChange({ rememberLastWorker: checked })}
        />
        <SettingsToggleField
          checked={value.rememberLastProperty}
          label="Recordar ultimo inmueble"
          hint="Mantiene el inmueble reciente como ayuda de continuidad operativa."
          onChange={(checked) => onChange({ rememberLastProperty: checked })}
        />
        <SettingsToggleField
          checked={value.showPayrollImpactMessage}
          label="Mostrar impacto en cierres"
          hint="Recuerda que la entrada alimenta el cierre mensual interno."
          onChange={(checked) => onChange({ showPayrollImpactMessage: checked })}
        />
      </div>
      {warning ? <p className="warning-text">{warning}</p> : null}
      <div className="quick-actions">
        <Button onClick={onSave}>Guardar registro rapido</Button>
      </div>
    </SettingsSection>
  )
}
