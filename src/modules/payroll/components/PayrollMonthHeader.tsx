import { Card } from '../../../components/ui/Card'
import { StatusPill } from '../../../components/ui/StatusPill'
import type { PayrollMonthState } from '../../../domain/payroll/payroll.types'
import { getPayrollMonthLabel } from '../services/payrollCalculations'
import { PayrollStatusBadge } from './PayrollStatusBadge'

type PayrollMonthHeaderProps = {
  month: string
  state: PayrollMonthState
}

export function PayrollMonthHeader({ month, state }: PayrollMonthHeaderProps) {
  return (
    <Card title={getPayrollMonthLabel(month)} description="Estado operativo del cierre mensual.">
      <div className="row-card__main">
        <div>
          <p className="page-description">
            Los importes son estimaciones operativas basadas en horas confirmadas. No ejecutan pagos reales.
          </p>
        </div>
        <div className="badge-row">
          <StatusPill tone="info">Seguimiento interno</StatusPill>
          <PayrollStatusBadge status={state.status} />
        </div>
      </div>
    </Card>
  )
}
