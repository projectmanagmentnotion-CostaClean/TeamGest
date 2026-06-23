import { FormField } from '../../../../components/forms/FormField'
import type { QuickEntryDraft } from '../../services/quickEntryDraft'

type QuickEntryReviewStepProps = {
  notes: string
  onChange: (patch: Partial<QuickEntryDraft>) => void
}

export function QuickEntryReviewStep({ notes, onChange }: QuickEntryReviewStepProps) {
  return (
    <FormField
      control="textarea"
      label="Notas"
      hint="Opcional. Util para dejar contexto interno antes del cierre mensual."
      value={notes}
      onChange={(value) => onChange({ notes: value })}
    />
  )
}
