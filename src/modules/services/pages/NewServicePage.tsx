import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { formatMoney } from '../../../utils/money'
import { NewServiceStepper } from '../components/new-service/NewServiceStepper'
import { NewServiceStepAssignments } from '../components/new-service/NewServiceStepAssignments'
import { NewServiceStepClient } from '../components/new-service/NewServiceStepClient'
import { NewServiceStepProperty } from '../components/new-service/NewServiceStepProperty'
import { NewServiceStepReview } from '../components/new-service/NewServiceStepReview'
import { NewServiceStepSchedule } from '../components/new-service/NewServiceStepSchedule'
import { NewServiceStepType } from '../components/new-service/NewServiceStepType'
import { NewServiceStepWorkers } from '../components/new-service/NewServiceStepWorkers'
import { NewServiceSuccess } from '../components/new-service/NewServiceSuccess'
import {
  buildServicePreviewFromDraft,
  createInitialNewServiceDraft,
  updateDraftAssignment,
  updateDraftClient,
  updateDraftProperty,
  updateDraftSchedule,
  updateDraftServiceType,
  updateDraftWorkers,
} from '../services/newServiceDraft'
import { calculateAssignmentPay } from '../services/serviceCalculations'
import { getNewServiceStepWarnings, validateReviewStep } from '../services/newServiceValidation'

export function NewServicePage() {
  const repositories = getRepositories()
  const clients = repositories.clients.listClients()
  const properties = repositories.properties.listProperties()
  const workers = repositories.workers.listWorkers().filter((worker) => worker.status === 'active')
  const [currentStep, setCurrentStep] = useState(0)
  const [draft, setDraft] = useState(createInitialNewServiceDraft())
  const [savedServiceId, setSavedServiceId] = useState<string | null>(null)
  const [persisted, setPersisted] = useState(false)

  const selectedClient = clients.find((client) => client.id === draft.clientId)
  const availableProperties = properties.filter((property) => property.clientId === draft.clientId)
  const selectedWorkers = workers.filter((worker) => draft.workerIds.includes(worker.id))
  const stepWarnings = getNewServiceStepWarnings(currentStep, draft, clients, properties, workers)
  const reviewWarnings = validateReviewStep(draft, clients, properties, workers)
  const totalLaborCost = draft.assignments.reduce(
    (sum, assignment) => sum + calculateAssignmentPay(assignment),
    0,
  )
  const preview = buildServicePreviewFromDraft(draft, clients, properties)
  const savedService = savedServiceId ? repositories.services.getServiceById(savedServiceId) : preview
  const canAdvance = stepWarnings.every(
    (warning) => warning.level === 'info' || warning.level === 'success',
  )
  const canConfirm =
    preview !== null &&
    reviewWarnings.every((warning) => warning.level === 'info' || warning.level === 'success')

  if (savedService) {
    return (
      <div className="page-stack">
        <section className="page-hero">
          <div>
            <p className="eyebrow">Servicios</p>
            <h1>Nuevo servicio</h1>
            <p className="page-description">
              Flujo guiado completado. Puedes volver a revisar el servicio o continuar operando.
            </p>
          </div>
        </section>
        <NewServiceSuccess persisted={persisted} service={savedService} />
      </div>
    )
  }

  const goNext = () => {
    if (!canAdvance) {
      return
    }

    setCurrentStep((step) => Math.min(step + 1, 6))
  }

  const goBack = () => setCurrentStep((step) => Math.max(step - 1, 0))

  const confirmService = () => {
    if (!preview || !canConfirm) {
      return
    }

    const storedService = repositories.services.createService(preview)
    setSavedServiceId(storedService.id)
    setPersisted(true)
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Servicios</p>
          <h1>Nuevo servicio</h1>
          <p className="page-description">
            StepFlow guiado para preparar un servicio con cliente, inmueble, equipo, horas y coste.
          </p>
        </div>
        <Link className="button button--secondary button--sm" to="/services">
          Cancelar
        </Link>
      </section>

      <Card title="Progreso del flujo" description="Avanza paso a paso sin perder el contexto.">
        <NewServiceStepper currentStep={currentStep} />
      </Card>

      {stepWarnings.length > 0 ? (
        <WarningBanner
          title="Revision del paso"
          tone={stepWarnings.some((warning) => warning.level === 'danger') ? 'danger' : 'warning'}
        >
          {stepWarnings[0]?.message}
        </WarningBanner>
      ) : null}

      <Card
        title={
          [
            'Selecciona cliente',
            'Selecciona inmueble',
            'Selecciona tipo de servicio',
            'Define fecha y horario',
            'Selecciona equipo',
            'Configura asignaciones',
            'Revisa y confirma',
          ][currentStep]
        }
      >
        {currentStep === 0 ? (
          <NewServiceStepClient
            clients={clients.filter((client) => client.status !== 'archived')}
            selectedClientId={draft.clientId}
            onSelect={(clientId) => setDraft((current) => updateDraftClient(current, clientId))}
          />
        ) : null}

        {currentStep === 1 ? (
          <NewServiceStepProperty
            properties={availableProperties}
            selectedPropertyId={draft.propertyId}
            onSelect={(propertyId) => setDraft((current) => updateDraftProperty(current, propertyId))}
          />
        ) : null}

        {currentStep === 2 ? (
          <NewServiceStepType
            selectedType={draft.serviceType}
            onSelect={(serviceType) => setDraft((current) => updateDraftServiceType(current, serviceType))}
          />
        ) : null}

        {currentStep === 3 ? (
          <NewServiceStepSchedule
            date={draft.date}
            endTime={draft.endTime}
            startTime={draft.startTime}
            onChange={(field, value) =>
              setDraft((current) =>
                updateDraftSchedule(current, {
                  date: field === 'date' ? value : current.date,
                  startTime: field === 'startTime' ? value : current.startTime,
                  endTime: field === 'endTime' ? value : current.endTime,
                }),
              )
            }
          />
        ) : null}

        {currentStep === 4 ? (
          <NewServiceStepWorkers
            selectedWorkerIds={draft.workerIds}
            workers={workers}
            onToggle={(workerId) => {
              const nextWorkers = draft.workerIds.includes(workerId)
                ? workers.filter((worker) =>
                    draft.workerIds.filter((id) => id !== workerId).includes(worker.id),
                  )
                : workers.filter((worker) => [...draft.workerIds, workerId].includes(worker.id))
              setDraft((current) => updateDraftWorkers(current, nextWorkers))
            }}
          />
        ) : null}

        {currentStep === 5 ? (
          <NewServiceStepAssignments
            assignments={draft.assignments}
            totalLaborCost={totalLaborCost}
            workers={selectedWorkers}
            onChange={(workerId, patch) =>
              setDraft((current) => updateDraftAssignment(current, workerId, patch))
            }
          />
        ) : null}

        {currentStep === 6 ? (
          <NewServiceStepReview
            clients={clients}
            draft={draft}
            properties={properties}
            workers={workers}
          />
        ) : null}
      </Card>

      <section className="filter-row">
        <Button variant="secondary" onClick={goBack} disabled={currentStep === 0}>
          Atras
        </Button>
        {currentStep < 6 ? (
          <Button variant="primary" onClick={goNext} disabled={!canAdvance}>
            Siguiente
          </Button>
        ) : (
          <Button variant="primary" onClick={confirmService} disabled={!canConfirm}>
            Confirmar servicio
          </Button>
        )}
      </section>

      {selectedClient ? (
        <Card title="Contexto actual" description="Resumen del borrador mientras avanzas.">
          <div className="detail-grid">
            <div>
              <span className="muted-caption">Cliente</span>
              <strong>{selectedClient.name}</strong>
            </div>
            <div>
              <span className="muted-caption">Inmueble</span>
              <strong>
                {availableProperties.find((property) => property.id === draft.propertyId)?.name ??
                  'Pendiente'}
              </strong>
            </div>
            <div>
              <span className="muted-caption">Equipo</span>
              <strong>{draft.workerIds.length}</strong>
            </div>
            <div>
              <span className="muted-caption">Coste laboral</span>
              <strong>{formatMoney(totalLaborCost)}</strong>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
