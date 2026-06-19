import { Card } from '../../../components/ui/Card'
import { formatMoney } from '../../../utils/money'

type PropertyOperationalSummaryProps = {
  monthLabel: string
  servicesThisMonth: number
  completedServicesThisMonth: number
  laborCostThisMonth: number
  lastServiceDate: string | null
  totalWorkerParticipations: number
}

export function PropertyOperationalSummary({
  completedServicesThisMonth,
  laborCostThisMonth,
  lastServiceDate,
  monthLabel,
  servicesThisMonth,
  totalWorkerParticipations,
}: PropertyOperationalSummaryProps) {
  return (
    <Card title="Resumen operativo" description={`Seguimiento del inmueble durante ${monthLabel}.`}>
      <div className="detail-grid detail-grid--three">
        <div>
          <span className="muted-caption">Servicios del mes</span>
          <strong>{servicesThisMonth}</strong>
        </div>
        <div>
          <span className="muted-caption">Servicios completados</span>
          <strong>{completedServicesThisMonth}</strong>
        </div>
        <div>
          <span className="muted-caption">Coste laboral mes</span>
          <strong>{formatMoney(laborCostThisMonth)}</strong>
        </div>
        <div>
          <span className="muted-caption">Último servicio</span>
          <strong>{lastServiceDate ?? 'Sin servicios'}</strong>
        </div>
        <div>
          <span className="muted-caption">Participaciones</span>
          <strong>{totalWorkerParticipations}</strong>
        </div>
      </div>
    </Card>
  )
}
