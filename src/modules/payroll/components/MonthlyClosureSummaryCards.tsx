import { MetricGrid } from '../../../components/ui/MetricGrid'
import { StatCard } from '../../../components/ui/StatCard'
import { formatMoney } from '../../../utils/money'
import type { MonthlyClosureSummary } from '../services/monthlyClosure.types'

type MonthlyClosureSummaryCardsProps = {
  summary: MonthlyClosureSummary
  statusLabel: string
}

export function MonthlyClosureSummaryCards({
  statusLabel,
  summary,
}: MonthlyClosureSummaryCardsProps) {
  return (
    <MetricGrid columns={6}>
      <StatCard
        label="Total trabajadores"
        value={summary.workerCount.toString()}
        hint="Trabajadores visibles en el cierre del mes."
        tone="info"
      />
      <StatCard
        label="Listos para pagar"
        value={summary.readyWorkerCount.toString()}
        hint="Sin pendientes ni incidencias activas."
        tone="success"
      />
      <StatCard
        label="Con pendientes"
        value={summary.pendingWorkerCount.toString()}
        hint="Horas por revisar antes del cierre."
        tone="warning"
      />
      <StatCard
        label="Con incidencias"
        value={summary.issueWorkerCount.toString()}
        hint="Requieren accion antes del pago interno."
        tone="danger"
      />
      <StatCard
        label="Horas confirmadas"
        value={`${summary.confirmedHours.toFixed(1)} h`}
        hint="Horas que ya cuentan para el cierre."
        tone="info"
      />
      <StatCard
        label="Total a pagar"
        value={formatMoney(summary.totalPay)}
        hint={`Estado del cierre: ${statusLabel}.`}
        tone={summary.isLocked ? 'blocked' : 'info'}
      />
    </MetricGrid>
  )
}
