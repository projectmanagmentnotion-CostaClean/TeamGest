import { FormField } from '../../../../components/forms/FormField'
import type { QuickEntryDraft } from '../../services/quickEntryDraft'

type QuickEntryPayStepProps = {
  draft: QuickEntryDraft
  onChange: (patch: Partial<QuickEntryDraft>) => void
}

export function QuickEntryPayStep({ draft, onChange }: QuickEntryPayStepProps) {
  return (
    <div className="form-grid">
      <FormField
        type="number"
        min={0}
        step={0.5}
        label="Tarifa horaria"
        value={draft.hourlyRate ?? ''}
        onChange={(value) => onChange({ hourlyRate: value ? Number(value) : undefined })}
      />
      <FormField
        type="number"
        min={0}
        step={0.5}
        label="Extras"
        value={draft.extraAmount ?? ''}
        onChange={(value) => onChange({ extraAmount: value ? Number(value) : undefined })}
      />
      <FormField
        type="number"
        min={0}
        step={0.5}
        label="Deducciones"
        value={draft.deductions ?? ''}
        onChange={(value) => onChange({ deductions: value ? Number(value) : undefined })}
      />
    </div>
  )
}
