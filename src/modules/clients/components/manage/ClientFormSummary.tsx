import { FormSummary } from '../../../../components/forms/FormSummary'
import type { ClientInput } from '../../../../domain/clients/client.inputs'
import { formatEntityStatusLabel } from '../../../../utils/labels'

type ClientFormSummaryProps = {
  draft: ClientInput
}

export function ClientFormSummary({ draft }: ClientFormSummaryProps) {
  return (
    <FormSummary
      title="Resumen del cliente"
      items={[
        { label: 'Nombre', value: draft.name || 'Pendiente' },
        { label: 'Facturacion', value: draft.billingName || 'Pendiente' },
        { label: 'Email', value: draft.email || 'Pendiente' },
        { label: 'Estado', value: formatEntityStatusLabel(draft.status) },
      ]}
    />
  )
}
