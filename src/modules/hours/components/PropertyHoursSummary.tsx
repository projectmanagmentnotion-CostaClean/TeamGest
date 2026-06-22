import type { Client } from '../../../domain/clients/client.types'
import type { HourEntrySummary } from '../../../domain/hours/hourEntry.types'
import type { Property } from '../../../domain/properties/property.types'
import { Card } from '../../../components/ui/Card'
import { formatMoney } from '../../../utils/money'

type PropertyHoursSummaryProps = {
  property: Property
  client?: Client
  summary: HourEntrySummary
  workersInvolved: number
}

export function PropertyHoursSummary({
  client,
  property,
  summary,
  workersInvolved,
}: PropertyHoursSummaryProps) {
  return (
    <Card title="Resumen del inmueble" description="Actividad de horas ligada al inmueble en el filtro activo.">
      <div className="detail-grid">
        <div>
          <span className="muted-caption">Inmueble</span>
          <strong>{property.name}</strong>
        </div>
        <div>
          <span className="muted-caption">Cliente</span>
          <strong>{client?.name ?? 'Cliente no disponible'}</strong>
        </div>
        <div>
          <span className="muted-caption">Horas</span>
          <strong>{summary.totalHours.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Total a pagar</span>
          <strong>{formatMoney(summary.totalPay)}</strong>
        </div>
        <div>
          <span className="muted-caption">Trabajadores</span>
          <strong>{workersInvolved}</strong>
        </div>
        <div>
          <span className="muted-caption">Incidencias</span>
          <strong>{summary.issueCount}</strong>
        </div>
      </div>
    </Card>
  )
}
