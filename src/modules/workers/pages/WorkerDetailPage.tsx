import { Link, useParams } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { formatMonthLabel, getMonthKey } from '../../../utils/dates'
import { formatMoney } from '../../../utils/money'
import { WorkerMonthlySummary } from '../components/WorkerMonthlySummary'
import { WorkerProfileHeader } from '../components/WorkerProfileHeader'
import { WorkerServiceHistory } from '../components/WorkerServiceHistory'
import { WorkerWarningsPanel } from '../components/WorkerWarningsPanel'
import {
  getWorkerAverageHoursPerService,
  getWorkerMonthlyDeductions,
  getWorkerMonthlyExtras,
  getWorkerMonthlyHours,
  getWorkerMonthlyPay,
  getWorkerMonthlyServiceCount,
  getWorkerServices,
} from '../services/workerCalculations'
import { getWorkerOperationalWarnings } from '../services/workerWarnings'

export function WorkerDetailPage() {
  const { id } = useParams()
  const repositories = getRepositories()
  const worker = repositories.workers.getWorkerById(id ?? '')
  const services = repositories.services.listServices()
  const clients = repositories.clients.listClients()
  const properties = repositories.properties.listProperties()

  if (!worker) {
    return (
      <div className="page-stack">
        <EmptyState
          title="Trabajador no encontrado"
          description="La ficha solicitada no existe en los datos actuales o la ruta no es válida."
          action={
            <Link className="button button--secondary button--sm" to="/workers">
              Volver a trabajadores
            </Link>
          }
        />
      </div>
    )
  }

  const month = getMonthKey(new Date().toISOString())
  const monthLabel = formatMonthLabel(month)
  const workerServices = getWorkerServices(worker.id, services)
  const warnings = getWorkerOperationalWarnings(worker, services)
  const clientById = new Map(clients.map((client) => [client.id, client]))
  const propertyById = new Map(properties.map((property) => [property.id, property]))
  const monthlyHours = getWorkerMonthlyHours(worker.id, services, month)
  const monthlyPay = getWorkerMonthlyPay(worker.id, services, month)
  const monthlyServices = getWorkerMonthlyServiceCount(worker.id, services, month)
  const monthlyExtras = getWorkerMonthlyExtras(worker.id, services, month)
  const monthlyDeductions = getWorkerMonthlyDeductions(worker.id, services, month)
  const averageHoursPerService = getWorkerAverageHoursPerService(worker.id, services, month)

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Trabajador</p>
          <h1>Ficha operativa</h1>
          <p className="page-description">
            Perfil, resumen mensual, historial de servicios asignados y señales de seguimiento.
          </p>
        </div>
        <Link className="button button--secondary button--sm" to="/workers">
          Volver
        </Link>
      </section>

      <WorkerProfileHeader
        summary={`${workerServices.length} servicios asociados y ${warnings.length} incidencias detectadas con datos actuales.`}
        worker={worker}
      />

      <section className="dashboard-grid">
        <WorkerMonthlySummary
          averageHoursPerService={averageHoursPerService}
          estimatedPay={monthlyPay}
          monthLabel={monthLabel}
          totalDeductions={monthlyDeductions}
          totalExtras={monthlyExtras}
          totalHours={monthlyHours}
          totalServices={monthlyServices}
        />
        <Card title="Estimación de payroll" description={`Lectura rápida de ${monthLabel}.`}>
          <div className="detail-grid">
            <div>
              <span className="muted-caption">Pago estimado</span>
              <strong>{formatMoney(monthlyPay)}</strong>
            </div>
            <div>
              <span className="muted-caption">Extras</span>
              <strong>{formatMoney(monthlyExtras)}</strong>
            </div>
            <div>
              <span className="muted-caption">Deducciones</span>
              <strong>{formatMoney(monthlyDeductions)}</strong>
            </div>
          </div>
          <p className="muted-caption">
            Solo se cuentan servicios completados, revisados o cerrados con asignaciones confirmadas.
          </p>
        </Card>
      </section>

      <section className="dashboard-grid">
        <WorkerWarningsPanel warnings={warnings} />
        <Card title="Notas operativas" description="Contexto útil para coordinación diaria.">
          <p className="page-description">
            {worker.notes ??
              'Sin notas adicionales. Esta sección queda preparada para futuras observaciones operativas read-only.'}
          </p>
          <p className="muted-caption">Referencia interna: {worker.id}</p>
        </Card>
      </section>

      <WorkerServiceHistory
        clientById={clientById}
        propertyById={propertyById}
        services={workerServices}
        workerId={worker.id}
      />
    </div>
  )
}
