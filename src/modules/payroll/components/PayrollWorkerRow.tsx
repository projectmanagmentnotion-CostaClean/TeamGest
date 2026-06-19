import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import type { PayrollSummary } from '../../../domain/payroll/payroll.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { formatWorkerRoleLabel } from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'
import { PayrollStatusBadge } from './PayrollStatusBadge'

type PayrollWorkerRowProps = {
  row: PayrollSummary
  worker?: Worker
  warningCount: number
}

export function PayrollWorkerRow({ row, warningCount, worker }: PayrollWorkerRowProps) {
  return (
    <Card className="row-card">
      <div className="row-card__main">
        <div>
          <h4>{worker?.name ?? 'Trabajador no disponible'}</h4>
          <p>{worker ? formatWorkerRoleLabel(worker.role) : 'Sin rol disponible'}</p>
        </div>
        <PayrollStatusBadge status={row.status} />
      </div>
      <div className="detail-grid detail-grid--four">
        <div>
          <span className="muted-caption">Servicios</span>
          <strong>{row.totalServices}</strong>
        </div>
        <div>
          <span className="muted-caption">Horas</span>
          <strong>{row.totalHours.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Extras / deducciones</span>
          <strong>{`${formatMoney(row.totalExtras)} / ${formatMoney(row.totalDeductions)}`}</strong>
        </div>
        <div>
          <span className="muted-caption">Total a pagar</span>
          <strong>{formatMoney(row.totalPay)}</strong>
        </div>
      </div>
      <div className="row-card__meta">
        <span className={warningCount > 0 ? 'warning-text' : 'muted-caption'}>
          {warningCount} incidencias
        </span>
        {worker ? (
          <Link className="section-link" to={`/workers/${worker.id}`}>
            Ver trabajador
          </Link>
        ) : null}
      </div>
    </Card>
  )
}
