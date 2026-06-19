import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import type { PayrollAuditEntry } from '../../../domain/payroll/payroll.types'
import { formatDate } from '../../../utils/dates'

type PayrollAuditTrailProps = {
  entries: PayrollAuditEntry[]
}

export function PayrollAuditTrail({ entries }: PayrollAuditTrailProps) {
  if (entries.length === 0) {
    return (
      <Card title="Auditoría del cierre" description="Trazabilidad de cambios de estado del mes.">
        <EmptyState
          title="Sin movimientos registrados"
          description="Todavía no se han registrado cambios de estado en este cierre."
        />
      </Card>
    )
  }

  return (
    <Card title="Auditoría del cierre" description="Trazabilidad de cambios de estado del mes.">
      <div className="timeline-list">
        {entries.map((entry) => (
          <article key={entry.id} className="timeline-item">
            <div className="timeline-item__dot" />
            <div className="timeline-item__content">
              <div className="row-card__main">
                <h4>{entry.action}</h4>
                <span className="muted-caption">{formatDate(entry.createdAt)}</span>
              </div>
              <p>{entry.message}</p>
            </div>
          </article>
        ))}
      </div>
    </Card>
  )
}
