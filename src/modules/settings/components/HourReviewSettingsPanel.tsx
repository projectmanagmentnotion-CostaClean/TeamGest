import { Button } from '../../../components/ui/Button'
import type { HourReviewSettings } from '../../../domain/settings/appSettings.types'
import { SettingsSection } from './SettingsSection'

type HourReviewSettingsPanelProps = {
  value: HourReviewSettings
  warning?: string
  onChange: (patch: Partial<HourReviewSettings>) => void
  onSave: () => void
}

export function HourReviewSettingsPanel({
  onChange,
  onSave,
  value,
  warning,
}: HourReviewSettingsPanelProps) {
  return (
    <SettingsSection
      title="Revision de horas"
      description="Politicas de incidencias, exclusiones y condicion previa al cierre mensual."
    >
      <div className="settings-boolean-list">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.requireReviewBeforePayrollClose}
            onChange={(event) => onChange({ requireReviewBeforePayrollClose: event.target.checked })}
          />
          <span>Exigir revision limpia antes de bloquear el cierre</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.allowIncidentEntriesInPayroll}
            onChange={(event) => onChange({ allowIncidentEntriesInPayroll: event.target.checked })}
          />
          <span>Permitir incidencias dentro de payroll</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.allowExcludedEntriesRestore}
            onChange={(event) => onChange({ allowExcludedEntriesRestore: event.target.checked })}
          />
          <span>Permitir restaurar entradas excluidas</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.requireNoteForIncident}
            onChange={(event) => onChange({ requireNoteForIncident: event.target.checked })}
          />
          <span>Exigir nota para incidencias</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={value.requireReasonForExclusion}
            onChange={(event) => onChange({ requireReasonForExclusion: event.target.checked })}
          />
          <span>Exigir motivo al excluir una entrada</span>
        </label>
      </div>
      {warning ? <p className="warning-text">{warning}</p> : null}
      <div className="quick-actions">
        <Button onClick={onSave}>Guardar revision</Button>
      </div>
    </SettingsSection>
  )
}
