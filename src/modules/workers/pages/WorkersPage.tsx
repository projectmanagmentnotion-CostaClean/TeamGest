import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/ui/EmptyState'
import { StatCard } from '../../../components/ui/StatCard'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { formatMonthLabel, getMonthKey } from '../../../utils/dates'
import { formatMoney } from '../../../utils/money'
import { WorkerCard } from '../components/WorkerCard'
import { getWorkersSummary } from '../services/workerCalculations'
import { getWorkerOperationalWarnings, getWorkersWithWarnings } from '../services/workerWarnings'

export function WorkersPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'with_warnings'>('all')
  const repositories = getRepositories()
  const workers = repositories.workers.listWorkers()
  const services = repositories.services.listServices()
  const month = getMonthKey(new Date().toISOString())
  const monthLabel = formatMonthLabel(month)
  const summary = getWorkersSummary(workers, services, month)
  const workersWithWarnings = getWorkersWithWarnings(workers, services)
  const visibleWorkers = summary.filter(({ worker }) => {
    if (filter === 'active') {
      return worker.status === 'active'
    }

    if (filter === 'inactive') {
      return worker.status === 'inactive'
    }

    if (filter === 'with_warnings') {
      return getWorkerOperationalWarnings(worker, services).length > 0
    }

    return true
  })
  const totalHours = summary.reduce((sum, item) => sum + item.monthlyHours, 0)
  const totalPay = summary.reduce((sum, item) => sum + item.monthlyPay, 0)

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Trabajadores</p>
          <h1>Trabajadores</h1>
          <p className="page-description">
            Lectura operativa del equipo, sus horas confirmadas, pago estimado y señales de
            seguimiento para {monthLabel}.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          hint="Disponibles para planificación actual."
          label="Trabajadores activos"
          tone="success"
          value={workers.filter((worker) => worker.status === 'active').length.toString()}
        />
        <StatCard
          hint="Horas confirmadas en servicios cerrables."
          label="Total horas del mes"
          tone="info"
          value={`${totalHours.toFixed(1)} h`}
        />
        <StatCard
          hint="Estimación agregada con datos actuales."
          label="Nómina estimada del mes"
          tone="info"
          value={formatMoney(totalPay)}
        />
        <StatCard
          hint="Trabajadores con señales operativas activas."
          label="Trabajadores con incidencias"
          tone="warning"
          value={workersWithWarnings.length.toString()}
        />
      </section>

      <section className="filter-row">
        {[
          ['all', 'Todos'],
          ['active', 'Activos'],
          ['inactive', 'Inactivos'],
          ['with_warnings', 'Con incidencias'],
        ].map(([value, label]) => (
          <Button
            key={value}
            size="sm"
            variant={filter === value ? 'primary' : 'secondary'}
            onClick={() => setFilter(value as 'all' | 'active' | 'inactive' | 'with_warnings')}
          >
            {label}
          </Button>
        ))}
      </section>

      {visibleWorkers.length === 0 ? (
        <EmptyState
          title="Sin resultados para este filtro"
          description="Prueba con otro estado para revisar el resto del equipo."
        />
      ) : (
        <section className="cards-grid">
          {visibleWorkers.map((item) => (
            <WorkerCard
              key={item.worker.id}
              monthlyHours={item.monthlyHours}
              monthlyPay={item.monthlyPay}
              monthlyServices={item.monthlyServices}
              warningCount={getWorkerOperationalWarnings(item.worker, services).length}
              worker={item.worker}
            />
          ))}
        </section>
      )}
    </div>
  )
}
