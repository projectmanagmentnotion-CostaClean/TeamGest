import type { HourEntrySummary } from '../../../domain/hours/hourEntry.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { Card } from '../../../components/ui/Card'
import { formatMoney } from '../../../utils/money'

type WorkerHoursSummaryProps = {
  worker: Worker
  summary: HourEntrySummary
}

export function WorkerHoursSummary({ summary, worker }: WorkerHoursSummaryProps) {
  return (
    <Card title="Resumen del trabajador" description="Horas, revisión y pago del filtro activo.">
      <div className="detail-grid">
        <div>
          <span className="muted-caption">Trabajador</span>
          <strong>{worker.name}</strong>
        </div>
        <div>
          <span className="muted-caption">Horas</span>
          <strong>{summary.totalHours.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Total a pagar</span>
          <strong>{formatMoney(summary.totalPay)}</strong>
        </div>
        <div>
          <span className="muted-caption">Pendientes</span>
          <strong>{summary.pendingReviewCount}</strong>
        </div>
        <div>
          <span className="muted-caption">Confirmadas</span>
          <strong>{summary.confirmedCount}</strong>
        </div>
        <div>
          <span className="muted-caption">Incidencias</span>
          <strong>{summary.issueCount}</strong>
        </div>
      </div>
    </Card>
  )
}
