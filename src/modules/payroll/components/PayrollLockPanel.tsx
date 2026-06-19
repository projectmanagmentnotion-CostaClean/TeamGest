import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import type { PayrollLockedSnapshot, PayrollMonthState } from '../../../domain/payroll/payroll.types'
import { formatDate } from '../../../utils/dates'
import { formatMoney } from '../../../utils/money'
import { canLockPayroll, isPayrollLocked } from '../services/payrollStatusFlow'

type PayrollLockPanelProps = {
  blockingWarningsCount: number
  snapshot?: PayrollLockedSnapshot
  state: PayrollMonthState
  onLock: () => void
}

export function PayrollLockPanel({
  blockingWarningsCount,
  onLock,
  snapshot,
  state,
}: PayrollLockPanelProps) {
  const locked = isPayrollLocked(state.status)

  return (
    <Card title="Bloqueo del cierre" description="Controla el cierre operativo del mes en localStorage.">
      <div className="stack-list">
        <p className="page-description">
          Bloquear el cierre evita cambios operativos accidentales en este resumen. No sustituye revisión fiscal o pago bancario.
        </p>
        {locked && snapshot ? (
          <div className="detail-grid">
            <div>
              <span className="muted-caption">Bloqueado el</span>
              <strong>{formatDate(state.lockedAt ?? snapshot.createdAt)}</strong>
            </div>
            <div>
              <span className="muted-caption">Total bloqueado</span>
              <strong>{formatMoney(snapshot.totalPay)}</strong>
            </div>
            <div>
              <span className="muted-caption">Horas bloqueadas</span>
              <strong>{snapshot.totalHours.toFixed(1)} h</strong>
            </div>
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={onLock}
            disabled={!canLockPayroll(state.status) || blockingWarningsCount > 0}
          >
            Bloquear cierre mensual
          </Button>
        )}
        {blockingWarningsCount > 0 ? (
          <span className="warning-text">{blockingWarningsCount} alertas bloqueantes impiden el cierre.</span>
        ) : null}
      </div>
    </Card>
  )
}
