import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { formatWorkerRoleLabel } from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'

type PropertyWorkerHistoryProps = {
  participations: Array<{
    workerId: string
    worker?: {
      name: string
      role: 'supervisor' | 'cleaner' | 'specialist' | 'driver'
    }
    totalHours: number
    totalPay: number
    serviceCount: number
    warningCount: number
  }>
}

export function PropertyWorkerHistory({ participations }: PropertyWorkerHistoryProps) {
  if (participations.length === 0) {
    return (
      <Card title="Participación de trabajadores" description="Resumen de equipo por inmueble.">
        <EmptyState
          title="Sin participación registrada"
          description="No hay trabajadores asociados a este inmueble en el mes actual."
        />
      </Card>
    )
  }

  return (
    <Card title="Participación de trabajadores" description="Horas y coste laboral por trabajador en este inmueble.">
      <div className="stack-list">
        {participations.map((item) => (
          <article key={item.workerId} className="row-card">
            <div className="row-card__main">
              <div>
                <h4>{item.worker?.name ?? 'Trabajador no disponible'}</h4>
                <p>{item.worker ? formatWorkerRoleLabel(item.worker.role) : 'Sin rol disponible'}</p>
              </div>
              {item.worker ? (
                <Link className="section-link" to={`/workers/${item.workerId}`}>
                  Ver trabajador
                </Link>
              ) : null}
            </div>
            <div className="detail-grid detail-grid--four">
              <div>
                <span className="muted-caption">Horas</span>
                <strong>{item.totalHours.toFixed(1)} h</strong>
              </div>
              <div>
                <span className="muted-caption">Pago estimado</span>
                <strong>{formatMoney(item.totalPay)}</strong>
              </div>
              <div>
                <span className="muted-caption">Servicios</span>
                <strong>{item.serviceCount}</strong>
              </div>
              <div>
                <span className={item.warningCount > 0 ? 'warning-text' : 'muted-caption'}>
                  {item.warningCount} incidencias
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  )
}
