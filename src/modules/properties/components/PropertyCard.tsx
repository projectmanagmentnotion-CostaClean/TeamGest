import { Link } from 'react-router-dom'
import { EntityCard } from '../../../components/ui/EntityCard'
import { StatusPill } from '../../../components/ui/StatusPill'
import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import {
  formatEntityStatusLabel,
  formatPropertyTypeLabel,
  getEntityStatusTone,
} from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'

type PropertyCardProps = {
  property: Property
  client?: Client
  servicesThisMonth: number
  laborCostThisMonth: number
  warningCount: number
}

export function PropertyCard({
  client,
  laborCostThisMonth,
  property,
  servicesThisMonth,
  warningCount,
}: PropertyCardProps) {
  return (
    <EntityCard
      badges={
        <StatusPill tone={getEntityStatusTone(property.status)}>
          {formatEntityStatusLabel(property.status)}
        </StatusPill>
      }
      footer={
        <Link className="section-link" to={`/properties/${property.id}`}>
          Ver detalle
        </Link>
      }
      meta={[
        { label: 'Cliente', value: client?.name ?? 'Cliente no disponible' },
        { label: 'Direccion', value: property.address || 'Direccion pendiente' },
        { label: 'Servicios mes', value: String(servicesThisMonth) },
        { label: 'Coste laboral mes', value: formatMoney(laborCostThisMonth) },
      ]}
      subtitle={`${formatPropertyTypeLabel(property.propertyType)} · ${property.city || 'Ciudad pendiente'}`}
      title={property.name}
      warningCount={warningCount}
    />
  )
}
