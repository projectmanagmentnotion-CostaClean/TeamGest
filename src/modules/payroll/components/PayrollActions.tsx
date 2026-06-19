import { Button } from '../../../components/ui/Button'
import type { PayrollMonthState } from '../../../domain/payroll/payroll.types'
import { canLockPayroll, canMarkPaid, canMarkReviewed } from '../services/payrollStatusFlow'

type PayrollActionsProps = {
  state: PayrollMonthState
  onMarkReviewed: () => void
  onMarkPaid: () => void
}

export function PayrollActions({ onMarkPaid, onMarkReviewed, state }: PayrollActionsProps) {
  return (
    <div className="quick-actions">
      <Button variant="secondary" onClick={onMarkReviewed} disabled={!canMarkReviewed(state.status)}>
        Marcar mes como revisado
      </Button>
      <Button variant="secondary" onClick={onMarkPaid} disabled={!canMarkPaid(state.status)}>
        Marcar mes como pagado
      </Button>
      <span className="muted-caption">
        Pagado significa marcado internamente como pagado, no ejecución bancaria.
      </span>
      <span className="muted-caption">
        {canLockPayroll(state.status)
          ? 'El cierre ya puede bloquearse si no hay alertas bloqueantes.'
          : 'El bloqueo se habilita cuando el mes está marcado como pagado.'}
      </span>
    </div>
  )
}
