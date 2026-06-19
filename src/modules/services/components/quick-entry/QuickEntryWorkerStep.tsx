import { FormField } from '../../../../components/forms/FormField'
import type { Worker } from '../../../../domain/workers/worker.types'

type QuickEntryWorkerStepProps = {
  workerId: string
  workers: Worker[]
  onChange: (workerId: string) => void
}

export function QuickEntryWorkerStep({ onChange, workerId, workers }: QuickEntryWorkerStepProps) {
  return (
    <FormField
      control="select"
      label="Trabajador"
      value={workerId}
      options={[
        { label: 'Selecciona trabajador', value: '' },
        ...workers.map((worker) => ({ label: worker.name, value: worker.id })),
      ]}
      onChange={onChange}
    />
  )
}
