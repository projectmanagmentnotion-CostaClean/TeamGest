import type { ServiceStatus } from '../../../domain/shared/status.types'
import { SERVICE_STATUS_FLOW, getServiceStatusLabel, getServiceStatusStep } from '../services/serviceStatusFlow'

type ServiceLifecycleProps = {
  status: ServiceStatus
}

export function ServiceLifecycle({ status }: ServiceLifecycleProps) {
  if (status === 'cancelled') {
    return (
      <section className="card">
        <div className="card__body">
          <h3>Estado del ciclo</h3>
          <div className="lifecycle-row">
            <span className="lifecycle-step is-cancelled">Cancelado</span>
          </div>
        </div>
      </section>
    )
  }

  const currentStep = getServiceStatusStep(status)

  return (
    <section className="card">
      <div className="card__body">
        <h3>Estado del ciclo</h3>
        <div className="lifecycle-row">
          {SERVICE_STATUS_FLOW.map((flowStatus, index) => (
            <span
              key={flowStatus}
              className={`lifecycle-step ${
                index < currentStep ? 'is-complete' : index === currentStep ? 'is-current' : ''
              }`.trim()}
            >
              {getServiceStatusLabel(flowStatus)}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
