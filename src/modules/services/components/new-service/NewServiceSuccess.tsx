import { Link } from 'react-router-dom'
import { Card } from '../../../../components/ui/Card'
import type { ServiceJob } from '../../../../domain/services/service.types'
import { formatDate } from '../../../../utils/dates'
import { formatServiceTypeLabel } from '../../../../utils/labels'

type NewServiceSuccessProps = {
  persisted: boolean
  service: ServiceJob
}

export function NewServiceSuccess({ persisted, service }: NewServiceSuccessProps) {
  return (
    <Card title="Servicio preparado" description="El flujo ha terminado y ya puedes volver a la operación.">
      <div className="stack-list">
        <p className="page-description">
          {persisted
            ? 'Servicio guardado en almacenamiento local del navegador mediante el repositorio de servicios.'
            : 'Servicio preparado en modo demo. La persistencia real se activará en un sprint posterior.'}
        </p>
        <div className="detail-grid">
          <div>
            <span className="muted-caption">Tipo</span>
            <strong>{formatServiceTypeLabel(service.serviceType)}</strong>
          </div>
          <div>
            <span className="muted-caption">Fecha</span>
            <strong>{formatDate(service.date)}</strong>
          </div>
        </div>
        <div className="quick-actions">
          <Link className="button button--primary" to="/services">
            Ver servicios
          </Link>
          <Link className="button button--secondary" to="/dashboard">
            Ir al dashboard
          </Link>
          {persisted ? (
            <Link className="button button--secondary" to={`/services/${service.id}`}>
              Ver servicio creado
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
