import { Card } from '../../../components/ui/Card'
import { formatMoney } from '../../../utils/money'

type WorkerMonthlySummaryProps = {
  averageHoursPerService: number
  estimatedPay: number
  monthLabel: string
  totalDeductions: number
  totalExtras: number
  totalHours: number
  totalServices: number
}

export function WorkerMonthlySummary({
  averageHoursPerService,
  estimatedPay,
  monthLabel,
  totalDeductions,
  totalExtras,
  totalHours,
  totalServices,
}: WorkerMonthlySummaryProps) {
  return (
    <Card title="Resumen mensual" description={`Seguimiento operativo de ${monthLabel}.`}>
      <div className="detail-grid detail-grid--three">
        <div>
          <span className="muted-caption">Horas confirmadas</span>
          <strong>{totalHours.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Servicios</span>
          <strong>{totalServices}</strong>
        </div>
        <div>
          <span className="muted-caption">Pago estimado</span>
          <strong>{formatMoney(estimatedPay)}</strong>
        </div>
        <div>
          <span className="muted-caption">Media por servicio</span>
          <strong>{averageHoursPerService.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Extras</span>
          <strong>{formatMoney(totalExtras)}</strong>
        </div>
        <div>
          <span className="muted-caption">Deducciones</span>
          <strong>{formatMoney(totalDeductions)}</strong>
        </div>
      </div>
    </Card>
  )
}
