import { SearchableEntitySelect } from '../../../../components/forms/SearchableEntitySelect'
import { Card } from '../../../../components/ui/Card'
import type { Worker } from '../../../../domain/workers/worker.types'
import { formatWorkerRoleLabel } from '../../../../utils/labels'
import { formatMoney } from '../../../../utils/money'

type QuickEntryWorkerStepProps = {
  workerId: string
  workers: Worker[]
  onChange: (workerId: string) => void
}

export function QuickEntryWorkerStep({ onChange, workerId, workers }: QuickEntryWorkerStepProps) {
  const selectedWorker = workers.find((worker) => worker.id === workerId)

  return (
    <section className="page-stack">
      <div className="section-header__content">
        <h3>Selecciona un trabajador</h3>
        <p>Busca por nombre, rol o telefono y reutiliza su tarifa por defecto cuando exista.</p>
      </div>
      <SearchableEntitySelect
        label="Buscar trabajador"
        entityLabel="trabajador"
        value={workerId}
        placeholder="Buscar trabajador"
        options={workers.map((worker) => ({
          id: worker.id,
          label: worker.name,
          subtitle: worker.phone ?? worker.email ?? 'Contacto pendiente',
          meta: worker.defaultHourlyRate ? `${formatMoney(worker.defaultHourlyRate)} / h` : 'Tarifa pendiente',
          status: worker.status,
        }))}
        onChange={onChange}
      />
      {selectedWorker ? (
        <Card title={selectedWorker.name} description="Trabajador seleccionado">
          <div className="detail-grid">
            <div>
              <span className="muted-caption">Rol</span>
              <strong>{formatWorkerRoleLabel(selectedWorker.role)}</strong>
            </div>
            <div>
              <span className="muted-caption">Tarifa por defecto</span>
              <strong>
                {selectedWorker.defaultHourlyRate
                  ? `${formatMoney(selectedWorker.defaultHourlyRate)} / h`
                  : 'Tarifa pendiente'}
              </strong>
            </div>
            <div>
              <span className="muted-caption">Estado</span>
              <strong>{selectedWorker.status}</strong>
            </div>
          </div>
        </Card>
      ) : null}
    </section>
  )
}
