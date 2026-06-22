import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EntityArchiveDialog } from '../../../components/forms/EntityArchiveDialog'
import { EntityDeleteDialog } from '../../../components/forms/EntityDeleteDialog'
import { ActionBar } from '../../../components/ui/ActionBar'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageHeader } from '../../../components/ui/PageHeader'
import { WarningBanner } from '../../../components/ui/WarningBanner'
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
  const navigate = useNavigate()
  const repositories = getRepositories()
  const worker = repositories.workers.getWorkerById(id ?? '')
  const services = repositories.services.listServices()
  const clients = repositories.clients.listClients()
  const properties = repositories.properties.listProperties()
  const [message, setMessage] = useState<string | null>(null)

  if (!worker) {
    return (
      <div className="page-stack">
        <EmptyState
          title="Trabajador no encontrado"
          description="La ficha solicitada no existe en los datos actuales o la ruta no es valida."
          action={
            <Link className="button button--secondary button--sm" to="/workers">
              Volver a trabajadores
            </Link>
          }
        />
      </div>
    )
  }

  const deletePolicy = repositories.workers.canDeleteWorker(worker.id)
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
      <PageHeader
        eyebrow="Trabajador"
        title="Ficha operativa"
        description="Perfil, resumen mensual, historial de servicios asignados y acciones locales de mantenimiento."
        primaryAction={
          <Link className="button button--primary" to={`/workers/${worker.id}/edit`}>
            Editar
          </Link>
        }
        secondaryAction={
          <Link className="button button--secondary button--sm" to={`/quick-entry?workerId=${worker.id}`}>
            Registrar horas
          </Link>
        }
      />

      {message ? (
        <WarningBanner title="Operacion local" tone="info">
          {message}
        </WarningBanner>
      ) : null}

      {worker.status !== 'active' ? (
        <WarningBanner title="Trabajador no activo" tone="warning">
          Este trabajador no esta activo. Normalmente no deberias registrar nuevas horas para su nomina interna.
        </WarningBanner>
      ) : null}

      <WorkerProfileHeader
        summary={`${workerServices.length} servicios asociados y ${warnings.length} incidencias detectadas con datos actuales.`}
        worker={worker}
      />

      <ActionBar>
        <Button variant="secondary" onClick={() => navigate('/workers')}>
          Volver
        </Button>
      </ActionBar>

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
        <Card title="Estimacion de payroll" description={`Lectura rapida de ${monthLabel}.`}>
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
        <Card title="Notas operativas" description="Contexto util para coordinacion diaria.">
          <p className="page-description">{worker.notes ?? 'Sin notas adicionales.'}</p>
          <p className="muted-caption">Referencia interna: {worker.id}</p>
        </Card>
      </section>

      <WorkerServiceHistory
        clientById={clientById}
        propertyById={propertyById}
        services={workerServices}
        workerId={worker.id}
      />

      <EntityArchiveDialog
        title="Archivar trabajador"
        description={
          workerServices.length > 0
            ? `Este trabajador tiene ${workerServices.length} servicios asociados. Archivar es seguro, pero no elimina su historial.`
            : 'Oculta este trabajador de los listados activos sin perder auditoria local.'
        }
        onToggle={() => {
          repositories.workers.archiveWorker(worker.id)
          navigate('/workers')
        }}
      />

      <EntityDeleteDialog
        title="Eliminar trabajador local"
        description="Solo se permite borrar altas locales sin dependencias historicas."
        blockedReason={deletePolicy.reason}
        onConfirm={() => {
          if (repositories.workers.deleteWorker(worker.id)) {
            navigate('/workers')
          } else {
            setMessage('No fue posible eliminar este trabajador con las reglas locales actuales.')
          }
        }}
      />
    </div>
  )
}
