import { Card } from '../../../../components/ui/Card'
import type { Property } from '../../../../domain/properties/property.types'
import type { Worker } from '../../../../domain/workers/worker.types'
import { formatMoney } from '../../../../utils/money'
import type { QuickEntryDraft } from '../../services/quickEntryDraft'

type QuickEntrySummaryBarProps = {
  draft: QuickEntryDraft
  worker?: Worker
  property?: Property
  payrollMonthLabel: string
  totalPay: number
}

export function QuickEntrySummaryBar({
  draft,
  payrollMonthLabel,
  property,
  totalPay,
  worker,
}: QuickEntrySummaryBarProps) {
  return (
    <Card
      title="Resumen rapido"
      description={`Se sumara al cierre mensual de ${payrollMonthLabel}. Impacta solo en pago interno.`}
    >
      <div className="detail-grid detail-grid--four">
        <div>
          <span className="muted-caption">Trabajador</span>
          <strong>{worker?.name ?? 'Pendiente'}</strong>
        </div>
        <div>
          <span className="muted-caption">Inmueble</span>
          <strong>{property?.name ?? 'Pendiente'}</strong>
        </div>
        <div>
          <span className="muted-caption">Fecha</span>
          <strong>{draft.date || 'Pendiente'}</strong>
        </div>
        <div>
          <span className="muted-caption">Horas trabajadas</span>
          <strong>{draft.hoursWorked.toFixed(2)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Tarifa por hora</span>
          <strong>{draft.hourlyRate ? `${draft.hourlyRate} EUR/h` : worker?.defaultHourlyRate ? `${worker.defaultHourlyRate} EUR/h` : 'Pendiente'}</strong>
        </div>
        <div>
          <span className="muted-caption">Total a pagar</span>
          <strong>{formatMoney(totalPay)}</strong>
        </div>
      </div>
    </Card>
  )
}
