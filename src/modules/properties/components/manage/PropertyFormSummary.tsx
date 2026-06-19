import { FormSummary } from '../../../../components/forms/FormSummary'
import type { Client } from '../../../../domain/clients/client.types'
import type { PropertyInput } from '../../../../domain/properties/property.inputs'
import { formatEntityStatusLabel, formatPropertyTypeLabel } from '../../../../utils/labels'

type PropertyFormSummaryProps = {
  draft: PropertyInput
  clients: Client[]
}

export function PropertyFormSummary({ clients, draft }: PropertyFormSummaryProps) {
  return (
    <FormSummary
      title="Resumen del inmueble"
      items={[
        { label: 'Nombre', value: draft.name || 'Pendiente' },
        { label: 'Cliente', value: clients.find((client) => client.id === draft.clientId)?.name ?? 'Pendiente' },
        { label: 'Tipo', value: formatPropertyTypeLabel(draft.propertyType) },
        { label: 'Estado', value: formatEntityStatusLabel(draft.status) },
      ]}
    />
  )
}
