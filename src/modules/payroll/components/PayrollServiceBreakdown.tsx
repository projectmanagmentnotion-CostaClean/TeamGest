import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { formatDate } from '../../../utils/dates'
import { formatServiceStatusLabel, formatServiceTypeLabel, getServiceStatusTone } from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'

type PayrollServiceBreakdownProps = {
  items: Array<{
    service: {
      id: string
      date: string
      serviceType: import('../../../domain/services/service.types').ServiceType
      status: import('../../../domain/shared/status.types').ServiceStatus
    }
    assignment: {
      hoursWorked: number
      hourlyRate?: number
      extraAmount?: number
      deductions?: number
      confirmed: boolean
    }
    client?: { name: string }
    property?: { name: string }
    assignmentPay: number
  }>
}

export function PayrollServiceBreakdown({ items }: PayrollServiceBreakdownProps) {
  if (items.length === 0) {
    return (
      <Card title="Servicios incluidos" description="Servicios que entran en el cálculo del trabajador.">
        <EmptyState
          title="Sin servicios incluidos"
          description="No hay servicios pagables para este trabajador en el mes seleccionado."
        />
      </Card>
    )
  }

  return (
    <Card title="Servicios incluidos" description="Detalle de horas y coste por servicio.">
      <div className="stack-list">
        {items.map(({ assignment, assignmentPay, client, property, service }) => (
          <article key={`${service.id}-${assignment.hoursWorked}-${assignmentPay}`} className="row-card">
            <div className="row-card__main">
              <div>
                <h4>
                  <Link className="section-link" to={`/services/${service.id}`}>
                    {formatServiceTypeLabel(service.serviceType)}
                  </Link>
                </h4>
                <p>
                  {formatDate(service.date)} · {client?.name ?? 'Cliente no disponible'} · {property?.name ?? 'Inmueble no disponible'}
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
                <span className="muted-caption">Tarifa</span>
                <strong>{formatMoney(assignment.hourlyRate ?? 0)}</strong>
              </div>
              <div>
                <span className="muted-caption">Extras / deducciones</span>
                <strong>{`${formatMoney(assignment.extraAmount ?? 0)} / ${formatMoney(assignment.deductions ?? 0)}`}</strong>
              </div>
              <div>
                <span className="muted-caption">Pago</span>
                <strong>{formatMoney(assignmentPay)}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  )
}
