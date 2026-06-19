import { Link } from 'react-router-dom'
import { EmptyState } from '../../../../components/ui/EmptyState'
import type { ServiceJob } from '../../../../domain/services/service.types'

type QuickEntrySuccessProps = {
  service: ServiceJob
}

export function QuickEntrySuccess({ service }: QuickEntrySuccessProps) {
  return (
    <EmptyState
      title="Horas registradas"
      description="La entrada rapida ya genero un servicio local con asignacion confirmada."
      action={
        <div className="empty-state__actions">
          <Link className="button button--primary" to={`/services/${service.id}`}>
            Ver servicio
          </Link>
          <Link className="button button--secondary" to="/quick-entry">
            Registrar otra entrada
          </Link>
        </div>
      }
    />
  )
}
