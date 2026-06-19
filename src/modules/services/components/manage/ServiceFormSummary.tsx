import { FormSummary } from '../../../../components/forms/FormSummary'
import type { Client } from '../../../../domain/clients/client.types'
import type { Property } from '../../../../domain/properties/property.types'
import type { Worker } from '../../../../domain/workers/worker.types'
import type { ServiceInput } from '../../../../domain/services/service.inputs'
import { formatServiceStatusLabel, formatServiceTypeLabel } from '../../../../utils/labels'

type ServiceFormSummaryProps = {
  draft: ServiceInput
  clients: Client[]
  properties: Property[]
  workers: Worker[]
}

export function ServiceFormSummary({
  clients,
  draft,
  properties,
  workers,
}: ServiceFormSummaryProps) {
  const assignedWorkers = draft.assignments
    .map((assignment) => workers.find((worker) => worker.id === assignment.workerId)?.name)
    .filter(Boolean)
    .join(', ')

  return (
    <FormSummary
      title="Resumen del servicio"
      items={[
        { label: 'Cliente', value: clients.find((client) => client.id === draft.clientId)?.name ?? 'Pendiente' },
        { label: 'Inmueble', value: properties.find((property) => property.id === draft.propertyId)?.name ?? 'Pendiente' },
        { label: 'Tipo', value: formatServiceTypeLabel(draft.serviceType) },
        { label: 'Estado', value: formatServiceStatusLabel(draft.status) },
        { label: 'Equipo', value: assignedWorkers || 'Pendiente' },
      ]}
    />
  )
}
