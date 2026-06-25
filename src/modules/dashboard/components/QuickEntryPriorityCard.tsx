import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import type { Client } from '../../../domain/clients/client.types'
import type { Property } from '../../../domain/properties/property.types'
import type { ServiceJob } from '../../../domain/services/service.types'
import { formatMoney } from '../../../utils/money'

type QuickEntryPriorityCardProps = {
  services: ServiceJob[]
  clients: Client[]
  properties: Property[]
}

export function QuickEntryPriorityCard({
  clients,
  properties,
  services,
}: QuickEntryPriorityCardProps) {
  return (
    <Card
      title="Registrar trabajo realizado"
      description="El flujo principal para cargar horas confirmadas de forma rapida y clara."
      action={
        <Link className="button button--primary button--sm" to="/quick-entry">
          Registrar horas
        </Link>
      }
    >
      <p className="page-description">
        Empieza aqui cuando el trabajo ya esta hecho y solo falta dejarlo listo para revision y cierre.
      </p>
      {services.length > 0 ? (
        <div className="stack-list">
          {services.map((service) => {
            const property = properties.find((item) => item.id === service.propertyId)
            const client = clients.find((item) => item.id === service.clientId)
            const totalPay = service.assignments.reduce((sum, assignment) => {
              const rate = assignment.hourlyRate ?? 0
              return (
                sum +
                assignment.hoursWorked * rate +
                (assignment.extraAmount ?? 0) -
                (assignment.deductions ?? 0)
              )
            }, 0)

            return (
              <div key={service.id} className="row-card">
                <div className="row-card__main">
                  <div>
                    <h4>{property?.name ?? 'Inmueble no disponible'}</h4>
                    <p>{client?.name ?? 'Cliente no disponible'}</p>
                  </div>
                  <span className="muted-caption">{formatMoney(totalPay)}</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="muted-caption">
          Aun no hay registros recientes. Cuando registres horas aqui veras las ultimas entradas listas para seguimiento.
        </p>
      )}
    </Card>
  )
}
