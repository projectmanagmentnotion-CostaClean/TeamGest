import { Badge } from '../../../../components/ui/Badge'
import { Card } from '../../../../components/ui/Card'
import type { Client } from '../../../../domain/clients/client.types'
import type { Property } from '../../../../domain/properties/property.types'
import type { Worker } from '../../../../domain/workers/worker.types'
import type { NewServiceDraft } from '../../services/newServiceDraft'
import { buildServicePreviewFromDraft } from '../../services/newServiceDraft'
import { formatDate } from '../../../../utils/dates'
import { formatServiceTypeLabel, getServiceStatusTone, formatServiceStatusLabel } from '../../../../utils/labels'
import { formatMoney } from '../../../../utils/money'
import { calculateAssignmentPay, calculateServiceLaborCost, getServiceTotalHours } from '../../services/serviceCalculations'

type NewServiceStepReviewProps = {
  clients: Client[]
  draft: NewServiceDraft
  properties: Property[]
  workers: Worker[]
}

export function NewServiceStepReview({
  clients,
  draft,
  properties,
  workers,
}: NewServiceStepReviewProps) {
  const preview = buildServicePreviewFromDraft(draft, clients, properties)

  if (!preview) {
    return null
  }

  const client = clients.find((item) => item.id === preview.clientId)
  const property = properties.find((item) => item.id === preview.propertyId)

  return (
    <Card title="Revisión final" description="Resumen completo antes de confirmar el servicio.">
      <div className="stack-list">
        <div className="row-card__main">
          <div>
            <h4>{formatServiceTypeLabel(preview.serviceType)}</h4>
            <p>
              {formatDate(preview.date)} · {preview.startTime ?? 'Sin hora de inicio'}
            </p>
          </div>
          <Badge tone={getServiceStatusTone(preview.status)}>
            {formatServiceStatusLabel(preview.status)}
          </Badge>
        </div>
        <div className="detail-grid">
          <div>
            <span className="muted-caption">Cliente</span>
            <strong>{client?.name ?? 'Cliente no disponible'}</strong>
          </div>
          <div>
            <span className="muted-caption">Inmueble</span>
            <strong>{property?.name ?? 'Inmueble no disponible'}</strong>
          </div>
          <div>
            <span className="muted-caption">Horas totales</span>
            <strong>{getServiceTotalHours(preview).toFixed(1)} h</strong>
          </div>
          <div>
            <span className="muted-caption">Coste laboral</span>
            <strong>{formatMoney(calculateServiceLaborCost(preview))}</strong>
          </div>
        </div>
        <div className="stack-list">
          {preview.assignments.map((assignment) => {
            const worker = workers.find((item) => item.id === assignment.workerId)
            return (
              <article key={assignment.id} className="row-card">
                <div className="row-card__main">
                  <div>
                    <h4>{worker?.name ?? 'Trabajador no disponible'}</h4>
                    <p>{`${assignment.hoursWorked.toFixed(1)} h · ${formatMoney(assignment.hourlyRate ?? 0)}`}</p>
                  </div>
                  <strong>{formatMoney(calculateAssignmentPay(assignment))}</strong>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
