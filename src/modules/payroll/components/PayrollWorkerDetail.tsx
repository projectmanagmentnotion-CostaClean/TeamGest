import { Card } from '../../../components/ui/Card'
import { DetailGrid } from '../../../components/ui/DetailGrid'
import type { PayrollSummary } from '../../../domain/payroll/payroll.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { formatWorkerRoleLabel } from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'
import { PayrollServiceBreakdown } from './PayrollServiceBreakdown'

type PayrollWorkerDetailProps = {
  row: PayrollSummary
  worker?: Worker
  warnings: Array<{ title: string; message: string }>
  breakdown: React.ComponentProps<typeof PayrollServiceBreakdown>['items']
}

export function PayrollWorkerDetail({ breakdown, row, warnings, worker }: PayrollWorkerDetailProps) {
  return (
    <Card
      title={worker?.name ?? 'Trabajador no disponible'}
      description={worker ? formatWorkerRoleLabel(worker.role) : 'Sin rol disponible'}
    >
      <DetailGrid>
        <div>
          <span className="muted-caption">Horas del mes</span>
          <strong>{row.totalHours.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Servicios pagables</span>
          <strong>{row.totalServices}</strong>
        </div>
        <div>
          <span className="muted-caption">Total a pagar</span>
          <strong>{formatMoney(row.totalPay)}</strong>
        </div>
        <div>
          <span className={warnings.length > 0 ? 'warning-text' : 'muted-caption'}>
            {warnings.length} incidencias
          </span>
        </div>
      </DetailGrid>
      {warnings.length > 0 ? (
        <div className="stack-list">
          {warnings.map((warning, index) => (
            <article key={`${warning.title}-${index}`} className="warning-item">
              <div>
                <h4>{warning.title}</h4>
                <p>{warning.message}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
      <PayrollServiceBreakdown items={breakdown} />
    </Card>
  )
}
