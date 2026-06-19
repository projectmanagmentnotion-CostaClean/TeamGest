import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { Worker } from '../../../domain/workers/worker.types'
import { formatWorkerRoleLabel } from '../../../utils/labels'

type ServiceRelatedContextProps = {
  client?: Client
  property?: Property
  workers: Array<Worker | undefined>
}

export function ServiceRelatedContext({ client, property, workers }: ServiceRelatedContextProps) {
  return (
    <Card title="Contexto relacionado" description="Relaciones clave alrededor del servicio.">
      <div className="stack-list">
        <article className="row-card">
          <h4>Cliente</h4>
          <p>
            {client ? <Link className="section-link" to={`/clients/${client.id}`}>{client.name}</Link> : 'Cliente no disponible'}
          </p>
        </article>
        <article className="row-card">
          <h4>Inmueble</h4>
          <p>
            {property ? <Link className="section-link" to={`/properties/${property.id}`}>{property.name}</Link> : 'Inmueble no disponible'}
          </p>
        </article>
        <article className="row-card">
          <h4>Trabajadores asignados</h4>
          <div className="stack-list">
            {workers.length > 0 ? (
              workers.map((worker, index) => (
                <p key={`${worker?.id ?? 'missing'}-${index}`}>
                  {worker ? (
                    <>
                      <Link className="section-link" to={`/workers/${worker.id}`}>{worker.name}</Link>
                      {` · ${formatWorkerRoleLabel(worker.role)}`}
                    </>
                  ) : (
                    'Trabajador no disponible'
                  )}
                </p>
              ))
            ) : (
              <p>Sin trabajadores asignados</p>
            )}
          </div>
        </article>
      </div>
    </Card>
  )
}
