import { FormSummary } from '../../../../components/forms/FormSummary'
import type { WorkerInput } from '../../../../domain/workers/worker.inputs'
import { formatEntityStatusLabel, formatWorkerRoleLabel } from '../../../../utils/labels'

type WorkerFormSummaryProps = {
  draft: WorkerInput
}

export function WorkerFormSummary({ draft }: WorkerFormSummaryProps) {
  return (
    <FormSummary
      title="Resumen del trabajador"
      items={[
        { label: 'Nombre', value: draft.name || 'Pendiente' },
        { label: 'Rol', value: formatWorkerRoleLabel(draft.role) },
        { label: 'Estado', value: formatEntityStatusLabel(draft.status) },
        { label: 'Tarifa', value: draft.defaultHourlyRate ? `${draft.defaultHourlyRate} EUR/h` : 'Pendiente' },
      ]}
    />
  )
}
