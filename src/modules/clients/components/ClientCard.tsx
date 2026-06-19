import { Link } from 'react-router-dom'
import { EntityCard } from '../../../components/ui/EntityCard'
import { StatusPill } from '../../../components/ui/StatusPill'
import type { Client } from '../../../domain/clients/client.types'
import { formatEntityStatusLabel, getEntityStatusTone } from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'

type ClientCardProps = {
  client: Client
  propertyCount: number
  servicesThisMonth: number
  laborCostThisMonth: number
  warningCount: number
}

export function ClientCard({
  client,
  laborCostThisMonth,
  propertyCount,
  servicesThisMonth,
  warningCount,
}: ClientCardProps) {
  return (
    <EntityCard
      badges={
        <StatusPill tone={getEntityStatusTone(client.status)}>
          {formatEntityStatusLabel(client.status)}
        </StatusPill>
      }
      footer={
        <Link className="section-link" to={`/clients/${client.id}`}>
          Ver detalle
        </Link>
      }
      meta={[
        { label: 'Correo', value: client.email ?? 'No disponible' },
        { label: 'Inmuebles', value: String(propertyCount) },
        { label: 'Servicios mes', value: String(servicesThisMonth) },
        { label: 'Coste laboral mes', value: formatMoney(laborCostThisMonth) },
      ]}
      subtitle={client.phone ?? client.email ?? 'Contacto pendiente'}
      title={client.name}
      warningCount={warningCount}
    />
  )
}
