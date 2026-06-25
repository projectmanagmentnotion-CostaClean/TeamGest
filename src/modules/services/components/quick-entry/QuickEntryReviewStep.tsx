import { FormField } from '../../../../components/forms/FormField'
import type { QuickEntryDraft } from '../../services/quickEntryDraft'

type QuickEntryReviewStepProps = {
  notes: string
  onChange: (patch: Partial<QuickEntryDraft>) => void
}

export function QuickEntryReviewStep({ notes, onChange }: QuickEntryReviewStepProps) {
  return (
    <div className="page-stack">
      <div className="row-card">
        <div>
          <h4>Ultima comprobacion</h4>
          <p>
            Revisa trabajador, inmueble, horario, tarifa y total antes de guardar. Si algo no cuadra,
            vuelve atras y corrigelo ahora.
          </p>
        </div>
      </div>
      <FormField
        control="textarea"
        label="Nota interna"
        hint="Opcional. Usala solo si ayuda a entender una correccion, una incidencia o un contexto especial."
        value={notes}
        onChange={(value) => onChange({ notes: value })}
      />
    </div>
  )
}
