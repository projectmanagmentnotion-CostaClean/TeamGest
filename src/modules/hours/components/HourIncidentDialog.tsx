import { useState } from 'react'
import { FormField } from '../../../components/forms/FormField'
import { FormFlowActions } from '../../../components/forms/FormFlowActions'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { getAppSettings } from '../../settings/services/appSettingsService'

type HourIncidentDialogProps = {
  onCancel: () => void
  onSave: (note: string) => void
}

export function HourIncidentDialog({ onCancel, onSave }: HourIncidentDialogProps) {
  const [note, setNote] = useState('')
  const requireNote = getAppSettings().hourReviewSettings.requireNoteForIncident

  return (
    <Card title="Marcar incidencia" description="Esta entrada quedara fuera de confirmacion hasta revisar el problema.">
      <div className="page-stack">
        <FormField
          control="textarea"
          label="Nota de incidencia"
          hint={requireNote ? 'La nota es obligatoria antes de guardar.' : 'La nota es opcional en la configuracion actual.'}
          value={note}
          onChange={setNote}
        />
        <FormFlowActions
          secondaryAction={
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          }
          primaryAction={
            <Button onClick={() => onSave(note)} disabled={requireNote && !note.trim()}>
              Guardar
            </Button>
          }
        />
      </div>
    </Card>
  )
}
