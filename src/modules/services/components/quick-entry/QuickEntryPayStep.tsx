import { FormField } from '../../../../components/forms/FormField'
import type { QuickEntryDraft } from '../../services/quickEntryDraft'

type QuickEntryPayStepProps = {
  draft: QuickEntryDraft
  workerDefaultRate?: number
  onChange: (patch: Partial<QuickEntryDraft>) => void
}

export function QuickEntryPayStep({
  draft,
  onChange,
  workerDefaultRate,
}: QuickEntryPayStepProps) {
  return (
    <section className="page-stack">
      <div className="section-header__content">
        <h3>Nomina interna</h3>
        <p>
          Tarifa por hora, extras y deducciones. Tarifa por defecto actual:{' '}
          {workerDefaultRate ? `${workerDefaultRate} EUR/h` : 'pendiente'}
        </p>
      </div>
      <div className="form-grid">
        <FormField
          type="number"
          min={0}
          step={0.5}
          label="Tarifa por hora"
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
    </section>
  )
}
