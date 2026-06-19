import { Card } from '../../../components/ui/Card'
import { formatMoney } from '../../../utils/money'

type ServiceCostSummaryProps = {
  baseLaborCost: number
  totalExtras: number
  totalDeductions: number
  finalLaborCost: number
  averageHourlyCost: number
  assignmentsCount: number
}

export function ServiceCostSummary({
  assignmentsCount,
  averageHourlyCost,
  baseLaborCost,
  finalLaborCost,
  totalDeductions,
  totalExtras,
}: ServiceCostSummaryProps) {
  return (
    <Card title="Resumen de coste" description="Composición económica del servicio con las asignaciones actuales.">
      <div className="detail-grid">
        <div>
          <span className="muted-caption">Base laboral</span>
          <strong>{formatMoney(baseLaborCost - totalExtras + totalDeductions)}</strong>
        </div>
        <div>
          <span className="muted-caption">Extras</span>
          <strong>{formatMoney(totalExtras)}</strong>
        </div>
        <div>
          <span className="muted-caption">Deducciones</span>
          <strong>{formatMoney(totalDeductions)}</strong>
        </div>
        <div>
          <span className="muted-caption">Coste final</span>
          <strong>{formatMoney(finalLaborCost)}</strong>
        </div>
        <div>
          <span className="muted-caption">Coste medio por hora</span>
          <strong>{formatMoney(averageHourlyCost)}</strong>
        </div>
        <div>
          <span className="muted-caption">Asignaciones incluidas</span>
          <strong>{assignmentsCount}</strong>
        </div>
      </div>
    </Card>
  )
}
