import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { HourEntry } from '../../../domain/hours/hourEntry.types'
import { Card } from '../../../components/ui/Card'
import { StatusPill } from '../../../components/ui/StatusPill'
import { formatDate } from '../../../utils/dates'
import { formatServiceStatusLabel, getServiceStatusTone } from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'
import { HourStatusBadge } from './HourStatusBadge'

type HourEntryCardProps = {
  entry: HourEntry
  action?: ReactNode
}

export function HourEntryCard({ action, entry }: HourEntryCardProps) {
  const timeLabel = entry.startTime && entry.endTime ? `${entry.startTime} - ${entry.endTime}` : 'Horario no definido'

  return (
    <Card
      className="hour-entry-card"
      title={entry.workerName}
      description={`${entry.propertyName} · ${entry.clientName}`}
      action={action}
    >
      <div className="hour-entry-card__meta">
        <HourStatusBadge status={entry.hourStatus} />
        <StatusPill tone={getServiceStatusTone(entry.serviceStatus)}>
          {formatServiceStatusLabel(entry.serviceStatus)}
        </StatusPill>
      </div>

      <div className="detail-grid">
        <div>
          <span className="muted-caption">Fecha</span>
          <strong>{formatDate(entry.date)}</strong>
        </div>
        <div>
          <span className="muted-caption">Horario</span>
          <strong>{timeLabel}</strong>
        </div>
        <div>
          <span className="muted-caption">Horas</span>
          <strong>{entry.hoursWorked.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Tarifa</span>
          <strong>{formatMoney(entry.hourlyRate)}</strong>
        </div>
        <div>
          <span className="muted-caption">Total</span>
          <strong>{formatMoney(entry.totalPay)}</strong>
        </div>
        <div>
          <span className="muted-caption">Alertas</span>
          <strong>{entry.warnings.length}</strong>
        </div>
      </div>

      {entry.warnings.length > 0 ? (
        <div className="hour-entry-card__warnings">
          {entry.warnings.map((warning) => (
            <p key={warning} className="muted-caption">
              {warning}
            </p>
          ))}
        </div>
      ) : null}

      <div className="hour-entry-card__links">
        <Link className="button button--ghost button--sm" to={`/services/${entry.serviceId}`}>
          Ver servicio
        </Link>
        <Link className="button button--ghost button--sm" to={`/workers/${entry.workerId}`}>
          Ver trabajador
        </Link>
        <Link className="button button--ghost button--sm" to={`/properties/${entry.propertyId}`}>
          Ver inmueble
        </Link>
      </div>
    </Card>
  )
}
