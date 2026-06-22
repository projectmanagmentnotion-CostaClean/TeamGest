import { FormField } from '../../../components/forms/FormField'
import { Button } from '../../../components/ui/Button'
import type { CompanySettings } from '../../../domain/settings/appSettings.types'
import { SettingsSection } from './SettingsSection'

type CompanySettingsPanelProps = {
  value: CompanySettings
  warning?: string
  onChange: (patch: Partial<CompanySettings>) => void
  onSave: () => void
}

export function CompanySettingsPanel({
  onChange,
  onSave,
  value,
  warning,
}: CompanySettingsPanelProps) {
  return (
    <SettingsSection
      title="Empresa"
      description="Identidad operativa base para etiquetas, contexto y futuras exportaciones internas."
    >
      <div className="form-grid">
        <FormField label="Nombre visible" value={value.companyName} onChange={(next) => onChange({ companyName: next })} />
        <FormField label="Ciudad por defecto" value={value.defaultCity} onChange={(next) => onChange({ defaultCity: next })} />
        <FormField
          control="select"
          label="Moneda"
          value={value.defaultCurrency}
          options={[{ label: 'EUR', value: 'EUR' }]}
          onChange={() => onChange({ defaultCurrency: 'EUR' })}
        />
      </div>
      <FormField
        control="textarea"
        label="Notas operativas"
        value={value.notes ?? ''}
        onChange={(next) => onChange({ notes: next })}
      />
      {warning ? <p className="warning-text">{warning}</p> : null}
      <div className="quick-actions">
        <Button onClick={onSave}>Guardar empresa</Button>
      </div>
    </SettingsSection>
  )
}
