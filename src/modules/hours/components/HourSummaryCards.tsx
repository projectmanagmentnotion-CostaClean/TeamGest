import type { HourEntrySummary } from '../../../domain/hours/hourEntry.types'
import { MetricGrid } from '../../../components/ui/MetricGrid'
import { StatCard } from '../../../components/ui/StatCard'
import { formatMoney } from '../../../utils/money'

type HourSummaryCardsProps = {
  summary: HourEntrySummary
}

export function HourSummaryCards({ summary }: HourSummaryCardsProps) {
  return (
    <MetricGrid columns={3}>
      <StatCard label="Horas este mes" value={`${summary.totalHours.toFixed(1)} h`} hint="Horas visibles en el filtro actual." tone="info" />
      <StatCard label="Total a pagar" value={formatMoney(summary.totalPay)} hint="Estimación derivada de horas, tarifa, extras y deducciones." tone="info" />
      <StatCard label="Pendientes de revisar" value={summary.pendingReviewCount.toString()} hint="Entradas listas para cierre pero aún sin confirmar." tone="warning" />
      <StatCard label="Confirmadas" value={summary.confirmedCount.toString()} hint="Entradas válidas para cierre o ya pagadas." tone="success" />
      <StatCard label="Incidencias" value={summary.issueCount.toString()} hint="Entradas con horas, tarifa o relaciones no válidas." tone="danger" />
      <StatCard label="Bloqueadas" value={summary.lockedCount.toString()} hint="Entradas dentro de meses cerrados y bloqueados." tone="blocked" />
    </MetricGrid>
  )
}
