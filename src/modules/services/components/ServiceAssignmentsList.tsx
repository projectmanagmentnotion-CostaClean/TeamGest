import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import type { ServiceJob } from '../../../domain/services/service.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { formatWorkerRoleLabel } from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'
import { calculateAssignmentPay } from '../services/serviceCalculations'

type ServiceAssignmentsListProps = {
  service: ServiceJob
  workers: Worker[]
}

export function ServiceAssignmentsList({ service, workers }: ServiceAssignmentsListProps) {
  if (service.assignments.length === 0) {
    return (
      <Card title="Asignaciones" description="Trabajadores vinculados al servicio.">
        <EmptyState
          title="Sin asignaciones"
          description="Este servicio aún no tiene trabajadores asignados en los datos actuales."
        />
      </Card>
    )
  }

  return (
    <Card title="Asignaciones" description="Detalle de horas, tarifas y confirmación por trabajador.">
      <div className="stack-list">
        {service.assignments.map((assignment) => {
          const worker = workers.find((item) => item.id === assignment.workerId)
          const hasRateWarning = (assignment.hourlyRate ?? 0) <= 0
          const hasHoursWarning = assignment.hoursWorked <= 0

          return (
            <article key={assignment.id} className="row-card">
              <div className="row-card__main">
                <div>
                  <h4>
                    {worker ? (
                      <Link className="section-link" to={`/workers/${worker.id}`}>
                        {worker.name}
                      </Link>
                    ) : (
                      'Trabajador no disponible'
                    )}
                  </h4>
                  <p>{worker ? formatWorkerRoleLabel(worker.role) : 'Sin rol disponible'}</p>
                </div>
                <Badge tone={assignment.confirmed ? 'success' : 'warning'}>
                  {assignment.confirmed ? 'Confirmada' : 'Pendiente'}
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
                  <strong>{formatMoney(calculateAssignmentPay(assignment))}</strong>
                </div>
              </div>
              {hasRateWarning || hasHoursWarning || !worker ? (
                <div className="row-card__meta">
                  {!worker ? <span className="warning-text">Trabajador no encontrado</span> : null}
                  {hasRateWarning ? <span className="warning-text">Tarifa pendiente</span> : null}
                  {hasHoursWarning ? <span className="warning-text">Horas no válidas</span> : null}
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </Card>
  )
}
