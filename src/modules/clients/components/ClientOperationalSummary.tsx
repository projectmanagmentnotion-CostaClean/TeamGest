import { Card } from '../../../components/ui/Card'
import { formatMoney } from '../../../utils/money'

type ClientOperationalSummaryProps = {
  monthLabel: string
  totalProperties: number
  activeProperties: number
  servicesThisMonth: number
  completedServicesThisMonth: number
  laborCostThisMonth: number
  lastServiceDate: string | null
}

export function ClientOperationalSummary({
  activeProperties,
  completedServicesThisMonth,
  laborCostThisMonth,
  lastServiceDate,
  monthLabel,
  servicesThisMonth,
  totalProperties,
}: ClientOperationalSummaryProps) {
  return (
    <Card title="Resumen operativo" description={`Lectura comercial y operativa de ${monthLabel}.`}>
      <div className="detail-grid detail-grid--three">
        <div>
          <span className="muted-caption">Inmuebles</span>
          <strong>{totalProperties}</strong>
        </div>
        <div>
          <span className="muted-caption">Inmuebles activos</span>
          <strong>{activeProperties}</strong>
        </div>
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
      </div>
    </Card>
  )
}
