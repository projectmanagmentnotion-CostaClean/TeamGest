import { useState } from 'react'
import { FormField } from '../../../components/forms/FormField'
import { FormFlowActions } from '../../../components/forms/FormFlowActions'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'

type HourExcludeDialogProps = {
  onCancel: () => void
  onSave: (reason: string) => void
}

export function HourExcludeDialog({ onCancel, onSave }: HourExcludeDialogProps) {
  const [reason, setReason] = useState('')

  return (
    <Card title="Excluir del payroll" description="Esta entrada no entrara al cierre mensual mientras permanezca excluida.">
      <div className="page-stack">
        <FormField
          control="textarea"
          label="Motivo de exclusion"
          value={reason}
          onChange={setReason}
        />
        <FormFlowActions
          secondaryAction={
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          }
          primaryAction={
            <Button onClick={() => onSave(reason)} disabled={!reason.trim()}>
              Excluir
            </Button>
          }
        />
      </div>
    </Card>
  )
}
