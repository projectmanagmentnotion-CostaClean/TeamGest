import { Card } from '../../../../components/ui/Card'
import type { Property } from '../../../../domain/properties/property.types'
import type { Worker } from '../../../../domain/workers/worker.types'
import type { QuickEntryDraft } from '../../services/quickEntryDraft'

type QuickEntrySummaryBarProps = {
  draft: QuickEntryDraft
  worker?: Worker
  property?: Property
}

export function QuickEntrySummaryBar({ draft, property, worker }: QuickEntrySummaryBarProps) {
  return (
    <Card title="Resumen rapido" description="Control de la entrada principal de horas.">
      <div className="detail-grid">
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
          <span className="muted-caption">Horas</span>
          <strong>{draft.hoursWorked.toFixed(1)} h</strong>
        </div>
      </div>
    </Card>
  )
}
