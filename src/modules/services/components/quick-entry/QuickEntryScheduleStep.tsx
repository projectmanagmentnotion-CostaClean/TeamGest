import { FormField } from '../../../../components/forms/FormField'
import type { QuickEntryDraft } from '../../services/quickEntryDraft'

type QuickEntryScheduleStepProps = {
  draft: QuickEntryDraft
  onChange: (patch: Partial<QuickEntryDraft>) => void
}

export function QuickEntryScheduleStep({ draft, onChange }: QuickEntryScheduleStepProps) {
  return (
    <div className="form-grid">
      <FormField type="date" label="Fecha" value={draft.date} onChange={(value) => onChange({ date: value })} />
      <FormField type="time" label="Inicio" value={draft.startTime} onChange={(value) => onChange({ startTime: value })} />
      <FormField type="time" label="Fin" value={draft.endTime} onChange={(value) => onChange({ endTime: value })} />
      <FormField
        type="number"
        min={0.5}
        step={0.5}
        label="Horas"
        value={draft.hoursWorked}
        onChange={(value) => onChange({ hoursWorked: Number(value) || 0 })}
      />
    </div>
  )
}
