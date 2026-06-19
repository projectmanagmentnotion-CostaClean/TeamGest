import { Card } from '../../../components/ui/Card'
import { formatMoney } from '../../../utils/money'

type ServiceOperationalSummaryProps = {
  assignmentCount: number
  confirmedAssignmentsCount: number
  totalHours: number
  confirmedHours: number
  laborCost: number
  totalExtras: number
  totalDeductions: number
  warningCount: number
}

export function ServiceOperationalSummary(props: ServiceOperationalSummaryProps) {
  const {
    assignmentCount,
    confirmedAssignmentsCount,
    confirmedHours,
    laborCost,
    totalDeductions,
    totalExtras,
    totalHours,
    warningCount,
  } = props

  return (
    <Card title="Resumen operativo" description="Lectura rápida del peso operativo y económico del servicio.">
      <div className="detail-grid detail-grid--three">
        <div>
          <span className="muted-caption">Asignaciones</span>
          <strong>{assignmentCount}</strong>
        </div>
        <div>
          <span className="muted-caption">Asignaciones confirmadas</span>
          <strong>{confirmedAssignmentsCount}</strong>
        </div>
        <div>
          <span className="muted-caption">Horas totales</span>
          <strong>{totalHours.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Horas confirmadas</span>
          <strong>{confirmedHours.toFixed(1)} h</strong>
        </div>
        <div>
          <span className="muted-caption">Coste laboral</span>
          <strong>{formatMoney(laborCost)}</strong>
        </div>
        <div>
          <span className="muted-caption">Extras / deducciones</span>
          <strong>{`${formatMoney(totalExtras)} / ${formatMoney(totalDeductions)}`}</strong>
        </div>
        <div>
          <span className={warningCount > 0 ? 'warning-text' : 'muted-caption'}>
            {warningCount} incidencias
          </span>
        </div>
      </div>
    </Card>
  )
}
