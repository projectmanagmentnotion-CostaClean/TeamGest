import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
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
import { calculateAssignmentPay } from '../../services/services/serviceCalculations'

type WorkerServiceHistoryProps = {
  clientById: Map<string, Client>
  propertyById: Map<string, Property>
  services: ServiceJob[]
  workerId: string
}

export function WorkerServiceHistory({
  clientById,
  propertyById,
  services,
  workerId,
}: WorkerServiceHistoryProps) {
  if (services.length === 0) {
    return (
      <Card title="Historial de servicios" description="Servicios asignados a este trabajador.">
        <EmptyState
          title="Sin historial disponible"
          description="Este trabajador todavía no tiene servicios asociados en los datos actuales."
        />
      </Card>
    )
  }

  return (
    <Card title="Historial de servicios" description="Servicios donde el trabajador figura asignado.">
      <div className="stack-list">
        {services.map((service) => {
          const assignment = service.assignments.find((item) => item.workerId === workerId)
          const property = propertyById.get(service.propertyId)
          const client = clientById.get(service.clientId)

          if (!assignment) {
            return null
          }

          return (
            <article key={service.id} className="row-card">
              <div className="row-card__main">
                <div>
                  <h4>{formatServiceTypeLabel(service.serviceType)}</h4>
                  <p>
                    {formatDate(service.date)} · {property?.name ?? 'Inmueble no disponible'} ·{' '}
                    {client?.name ?? 'Cliente no disponible'}
                  </p>
                </div>
                <Badge tone={getServiceStatusTone(service.status)}>
                  {formatServiceStatusLabel(service.status)}
                </Badge>
              </div>
              <div className="detail-grid detail-grid--four">
                <div>
                  <span className="muted-caption">Horas</span>
                  <strong>{assignment.hoursWorked.toFixed(1)} h</strong>
                </div>
                <div>
                  <span className="muted-caption">Tarifa usada</span>
                  <strong>{formatMoney(assignment.hourlyRate ?? 0)}</strong>
                </div>
                <div>
                  <span className="muted-caption">Pago estimado</span>
                  <strong>{formatMoney(calculateAssignmentPay(assignment))}</strong>
                </div>
                <div>
                  <span className="muted-caption">Confirmación</span>
                  <strong>{assignment.confirmed ? 'Confirmada' : 'Pendiente'}</strong>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </Card>
  )
}
