import { useState } from 'react'
import { FormField } from '../../../components/forms/FormField'
import { FormFlowActions } from '../../../components/forms/FormFlowActions'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'

type HourIncidentDialogProps = {
  onCancel: () => void
  onSave: (note: string) => void
}

export function HourIncidentDialog({ onCancel, onSave }: HourIncidentDialogProps) {
  const [note, setNote] = useState('')

  return (
    <Card title="Marcar incidencia" description="Esta entrada quedara fuera de confirmacion hasta revisar el problema.">
      <div className="page-stack">
        <FormField
          control="textarea"
          label="Nota de incidencia"
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
            <Button onClick={() => onSave(note)} disabled={!note.trim()}>
              Guardar
            </Button>
          }
        />
      </div>
    </Card>
  )
}
