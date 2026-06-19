import { Link } from 'react-router-dom'
import { EntityCard } from '../../../components/ui/EntityCard'
import { StatusPill } from '../../../components/ui/StatusPill'
import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import { formatDate } from '../../../utils/dates'
import {
  formatServiceStatusLabel,
  formatServiceTypeLabel,
  getServiceStatusTone,
} from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'

type ServiceCardProps = {
  client?: Client
  property?: Property
  service: ServiceJob
  totalHours: number
  laborCost: number
  warningCount: number
}

export function ServiceCard({
  client,
  laborCost,
  property,
  service,
  totalHours,
  warningCount,
}: ServiceCardProps) {
  const timeRange =
    service.startTime && service.endTime
      ? `${service.startTime} - ${service.endTime}`
      : service.startTime
        ? `Inicio ${service.startTime}`
        : 'Sin franja horaria'

  return (
    <EntityCard
      badges={
        <StatusPill tone={getServiceStatusTone(service.status)}>
          {formatServiceStatusLabel(service.status)}
        </StatusPill>
      }
      footer={
        <Link className="section-link" to={`/services/${service.id}`}>
          Ver detalle
        </Link>
      }
      meta={[
        { label: 'Cliente', value: client?.name ?? 'Cliente no disponible' },
        { label: 'Inmueble', value: property?.name ?? 'Inmueble no disponible' },
        { label: 'Ciudad', value: property?.city || 'Ciudad pendiente' },
        { label: 'Asignaciones', value: String(service.assignments.length) },
        { label: 'Horas confirmadas', value: `${totalHours.toFixed(1)} h` },
        { label: 'Coste laboral', value: formatMoney(laborCost) },
      ]}
      subtitle={`${formatDate(service.date)} · ${timeRange}`}
      title={formatServiceTypeLabel(service.serviceType)}
      warningCount={warningCount}
    />
  )
}
