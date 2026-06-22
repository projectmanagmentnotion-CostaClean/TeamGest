import { Button } from '../../../../components/ui/Button'
import { FormField } from '../../../../components/forms/FormField'
import type { QuickEntryDraft } from '../../services/quickEntryDraft'
import { calculateQuickEntryHoursFromSchedule } from '../../services/quickEntryDraft'

type QuickEntryScheduleStepProps = {
  draft: QuickEntryDraft
  onChange: (patch: Partial<QuickEntryDraft>) => void
  onSyncHours: () => void
}

export function QuickEntryScheduleStep({
  draft,
  onChange,
  onSyncHours,
}: QuickEntryScheduleStepProps) {
  const calculatedHours = calculateQuickEntryHoursFromSchedule(draft.startTime, draft.endTime)

  return (
    <section className="page-stack">
      <div className="section-header">
        <div className="section-header__content">
          <h3>Trabajo realizado</h3>
          <p>Fecha, horario y horas trabajadas. El horario puede rellenar las horas automaticamente.</p>
        </div>
        {calculatedHours !== null ? (
          <Button variant="secondary" size="sm" onClick={onSyncHours}>
            Usar horario ({calculatedHours.toFixed(2)} h)
          </Button>
        ) : null}
      </div>
      <div className="form-grid">
        <FormField type="date" label="Fecha" value={draft.date} onChange={(value) => onChange({ date: value })} />
        <FormField type="time" label="Inicio" value={draft.startTime} onChange={(value) => onChange({ startTime: value })} />
        <FormField type="time" label="Fin" value={draft.endTime} onChange={(value) => onChange({ endTime: value })} />
        <FormField
          type="number"
          min={0.5}
          step={0.25}
          label="Horas trabajadas"
          value={draft.hoursWorked}
          onChange={(value) => onChange({ hoursWorked: Number(value) || 0, hoursManuallyEdited: true })}
        />
      </div>
    </section>
  )
}
