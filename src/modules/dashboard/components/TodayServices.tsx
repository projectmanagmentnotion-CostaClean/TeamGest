import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import { formatMoney } from '../../../utils/money'
import {
  formatServiceStatusLabel,
  formatServiceTypeLabel,
  getServiceStatusTone,
} from '../../../utils/labels'
import { calculateServiceLaborCost } from '../../services/services/serviceCalculations'

type TodayServicesProps = {
  clients: Client[]
  properties: Property[]
  services: ServiceJob[]
}

export function TodayServices({ clients, properties, services }: TodayServicesProps) {
  if (services.length === 0) {
    return (
      <Card title="Servicios de hoy" description="No hay servicios activos para la jornada actual.">
        <EmptyState
          title="Sin servicios para hoy"
          description="Cuando el equipo programe nuevos servicios aparecerán aquí con su estado y coste estimado."
          action={
            <Link className="button button--secondary button--sm" to="/services/new">
              Nuevo servicio
            </Link>
          }
        />
      </Card>
    )
  }

  return (
    <Card title="Servicios de hoy" description="Programados y completados durante la jornada actual.">
      <div className="stack-list">
        {services.map((service) => {
          const property = properties.find((item) => item.id === service.propertyId)
          const client = clients.find((item) => item.id === service.clientId)

          return (
            <article key={service.id} className="row-card">
              <div className="row-card__main">
                <div>
                  <h4>{formatServiceTypeLabel(service.serviceType)}</h4>
                  <p>
                    {property?.name ?? 'Inmueble sin asignar'} · {client?.name ?? 'Cliente sin asignar'}
                  </p>
                </div>
                <Badge tone={getServiceStatusTone(service.status)}>
                  {formatServiceStatusLabel(service.status)}
                </Badge>
              </div>
              <div className="row-card__meta">
                <span>Coste laboral {formatMoney(calculateServiceLaborCost(service))}</span>
                <span>{service.assignments.length} trabajadores</span>
              </div>
            </article>
          )
        })}
      </div>
    </Card>
  )
}
