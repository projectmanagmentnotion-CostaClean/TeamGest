import { Card } from '../../../components/ui/Card'
import { DetailGrid } from '../../../components/ui/DetailGrid'
import { formatMoney } from '../../../utils/money'

type PayrollSummaryCardProps = {
  totalPay: number
  totalHours: number
  totalServices: number
  totalExtras: number
  totalDeductions: number
  workersCount: number
  warningsCount: number
}

export function PayrollSummaryCard(props: PayrollSummaryCardProps) {
  const {
    totalDeductions,
    totalExtras,
    totalHours,
    totalPay,
    totalServices,
    warningsCount,
    workersCount,
  } = props

  return (
    <Card title="Resumen mensual" description="Estimacion operativa basada en horas confirmadas.">
      <DetailGrid columns={3}>
        <div>
          <span className="muted-caption">Total a pagar</span>
          <strong>{formatMoney(totalPay)}</strong>
        </div>
        <div>
          <span className="muted-caption">Horas</span>
          <strong>{totalHours.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Servicios</span>
          <strong>{totalServices}</strong>
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
          <span className="muted-caption">Trabajadores / incidencias</span>
          <strong>{`${workersCount} / ${warningsCount}`}</strong>
        </div>
      </DetailGrid>
    </Card>
  )
}
