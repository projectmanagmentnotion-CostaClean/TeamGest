import { Link } from 'react-router-dom'
import { EmptyState } from '../../../../components/ui/EmptyState'
import type { ServiceJob } from '../../../../domain/services/service.types'
import { formatMoney } from '../../../../utils/money'

type QuickEntrySuccessProps = {
  service: ServiceJob
  clientName: string
  propertyName: string
  workerName: string
  hoursWorked: number
  hourlyRate: number
  totalPay: number
  payrollMonthLabel: string
  timeLabel: string
}

export function QuickEntrySuccess({
  clientName,
  hourlyRate,
  hoursWorked,
  payrollMonthLabel,
  propertyName,
  service,
  timeLabel,
  totalPay,
  workerName,
}: QuickEntrySuccessProps) {
  return (
    <EmptyState
      title="Horas registradas"
      description="La entrada rapida ya genero un servicio local con asignacion confirmada."
      action={
        <div className="empty-state__actions">
          <Link className="button button--primary" to={`/services/${service.id}`}>
            Ver servicio creado
          </Link>
          <Link className="button button--secondary" to={`/payroll/${service.date.slice(0, 7)}`}>
            Ver cierre del mes
          </Link>
          <Link className="button button--secondary" to="/quick-entry">
            Crear otro registro
          </Link>
          <Link className="button button--ghost" to="/dashboard">
            Volver al dashboard
          </Link>
        </div>
      }
      icon="OK"
    >
      <div className="detail-grid">
        <div>
          <span className="muted-caption">Trabajador</span>
          <strong>{workerName}</strong>
        </div>
        <div>
          <span className="muted-caption">Cliente</span>
          <strong>{clientName}</strong>
        </div>
        <div>
          <span className="muted-caption">Inmueble</span>
          <strong>{propertyName}</strong>
        </div>
        <div>
          <span className="muted-caption">Fecha y horario</span>
          <strong>
            {service.date} · {timeLabel}
          </strong>
        </div>
        <div>
          <span className="muted-caption">Horas trabajadas</span>
          <strong>{hoursWorked.toFixed(2)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Tarifa por hora</span>
          <strong>{hourlyRate.toFixed(2)} EUR/h</strong>
        </div>
        <div>
          <span className="muted-caption">Total a pagar</span>
          <strong>{formatMoney(totalPay)}</strong>
        </div>
        <div>
          <span className="muted-caption">Impacto en payroll</span>
          <strong>Se sumara al cierre mensual de {payrollMonthLabel}</strong>
        </div>
      </div>
    </EmptyState>
  )
}
