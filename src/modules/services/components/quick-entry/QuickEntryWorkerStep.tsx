import type { Worker } from '../../../../domain/workers/worker.types'

type QuickEntryWorkerStepProps = {
  workerId: string
  workers: Worker[]
  onChange: (workerId: string) => void
}

export function QuickEntryWorkerStep({ onChange, workerId, workers }: QuickEntryWorkerStepProps) {
  return (
    <section className="page-stack">
      <div className="section-header__content">
        <h3>Trabajador</h3>
        <p>Selecciona el trabajador y reutiliza su tarifa por defecto cuando exista.</p>
      </div>
      <div className="cards-grid">
        {workers.map((worker) => {
          const isSelected = worker.id === workerId

          return (
            <button
              key={worker.id}
              className={`choice-card${isSelected ? ' is-selected' : ''}`}
              type="button"
              onClick={() => onChange(worker.id)}
            >
              <div className="row-card__main">
                <div>
                  <strong>{worker.name}</strong>
                  <p>{worker.role}</p>
                </div>
                <span className="muted-caption">
                  {worker.defaultHourlyRate ? `${worker.defaultHourlyRate} EUR/h` : 'Tarifa pendiente'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
