import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormFlowActions } from '../../../components/forms/FormFlowActions'
import { StepFlowFooter } from '../../../components/forms/StepFlowFooter'
import { StepFlowHeader } from '../../../components/forms/StepFlowHeader'
import { StepFlowScreen } from '../../../components/forms/StepFlowScreen'
import { Button } from '../../../components/ui/Button'
import { PageHeader } from '../../../components/ui/PageHeader'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { QuickEntryPayStep } from '../components/quick-entry/QuickEntryPayStep'
import { QuickEntryPropertyStep } from '../components/quick-entry/QuickEntryPropertyStep'
import { QuickEntryReviewStep } from '../components/quick-entry/QuickEntryReviewStep'
import { QuickEntryScheduleStep } from '../components/quick-entry/QuickEntryScheduleStep'
import { QuickEntrySuccess } from '../components/quick-entry/QuickEntrySuccess'
import { QuickEntrySummaryBar } from '../components/quick-entry/QuickEntrySummaryBar'
import { QuickEntryWorkerStep } from '../components/quick-entry/QuickEntryWorkerStep'
import {
  buildQuickEntryService,
  getQuickEntryPayrollMonthLabel,
  getQuickEntryTimeLabel,
} from '../services/quickEntryBuilder'
import {
  applyQuickEntryManualHours,
  applyQuickEntrySchedulePatch,
  applyQuickEntryWorkerSelection,
  createQuickEntryDraft,
  resolveQuickEntryPrefill,
  syncQuickEntryHoursWithSchedule,
} from '../services/quickEntryDraft'
import {
  getQuickEntryEffectiveRate,
  getQuickEntryTotalPay,
  validateQuickEntryDraft,
} from '../services/quickEntryValidation'

const steps = ['Trabajador', 'Inmueble', 'Horario', 'Pago', 'Revision']

export function QuickWorkEntryPage() {
  const repositories = getRepositories()
  const workers = repositories.workers.listWorkers().filter((worker) => worker.status !== 'archived')
  const properties = repositories.properties.listProperties().filter((property) => property.status !== 'archived')
  const clients = repositories.clients.listClients()
  const [searchParams] = useSearchParams()
  const [draft, setDraft] = useState(createQuickEntryDraft(resolveQuickEntryPrefill(searchParams)))
  const [savedServiceId, setSavedServiceId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const worker = workers.find((item) => item.id === draft.workerId)
  const property = properties.find((item) => item.id === draft.propertyId)
  const client = clients.find((item) => item.id === property?.clientId)
  const errors = validateQuickEntryDraft(draft, worker?.defaultHourlyRate)
  const savedService = savedServiceId ? repositories.services.getServiceById(savedServiceId) : null
  const payrollMonthLabel = getQuickEntryPayrollMonthLabel(draft.date)
  const totalPay = getQuickEntryTotalPay(draft, worker?.defaultHourlyRate)
  const effectiveRate = getQuickEntryEffectiveRate(draft, worker?.defaultHourlyRate)

  if (savedService && worker && property) {
    return (
      <div className="page-stack">
        <PageHeader
          eyebrow="Quick Entry"
          title="Registro completado"
          description="La entrada rapida ya quedo guardada en modo local-first."
        />
        <QuickEntrySuccess
          service={savedService}
          clientName={client?.name ?? 'Cliente no disponible'}
          propertyName={property.name}
          workerName={worker.name}
          hoursWorked={draft.hoursWorked}
          hourlyRate={effectiveRate}
          totalPay={totalPay}
          payrollMonthLabel={payrollMonthLabel}
          timeLabel={getQuickEntryTimeLabel(draft.startTime, draft.endTime)}
        />
      </div>
    )
  }

  const canContinue =
    (currentStep === 0 && Boolean(draft.workerId)) ||
    (currentStep === 1 && Boolean(draft.propertyId)) ||
    (currentStep === 2 && Boolean(draft.date) && draft.hoursWorked > 0) ||
    (currentStep === 3 && effectiveRate > 0 && errors.length === 0) ||
    currentStep === 4

  const currentStepDescription =
    currentStep === 0
      ? 'Busca y selecciona quien realizo el trabajo.'
      : currentStep === 1
        ? 'Busca el inmueble vinculado al trabajo realizado.'
        : currentStep === 2
          ? 'Define fecha, horario y horas trabajadas.'
          : currentStep === 3
            ? 'Revisa tarifa, extras y deducciones antes del cierre.'
            : 'Añade una nota interna y confirma el resumen final.'

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Quick Entry"
        title="Registrar horas"
        description="Anade trabajador, inmueble, horario, horas y tarifa en una secuencia corta y revisable."
      />

      {errors.length > 0 && currentStep >= 2 ? (
        <WarningBanner title="Revision requerida" tone="warning">
          {errors[0]}
        </WarningBanner>
      ) : null}

      {worker && worker.status !== 'active' ? (
        <WarningBanner title="Trabajador no activo" tone="warning">
          Este trabajador no esta activo. Normalmente no deberias registrar nuevas horas para su nomina interna.
        </WarningBanner>
      ) : null}

      {property && property.status !== 'active' ? (
        <WarningBanner title="Inmueble no activo" tone="warning">
          Este inmueble no esta activo. Revisa antes de registrar trabajo realizado.
        </WarningBanner>
      ) : null}

      <QuickEntrySummaryBar
        draft={draft}
        property={property}
        worker={worker}
        payrollMonthLabel={payrollMonthLabel}
        totalPay={totalPay}
      />

      <StepFlowScreen
        title="Quick Work Entry"
        description="Entrada prioritaria para registrar horas confirmadas sin listas infinitas."
      >
        <div className="page-stack">
          <StepFlowHeader
            currentStep={currentStep}
            steps={steps}
            title={steps[currentStep]}
            description={currentStepDescription}
          />

          {currentStep === 0 ? (
            <QuickEntryWorkerStep
              workerId={draft.workerId}
              workers={workers}
              onChange={(workerId) =>
                setDraft((current) =>
                  applyQuickEntryWorkerSelection(
                    current,
                    workers.find((item) => item.id === workerId),
                  ),
                )
              }
            />
          ) : null}

          {currentStep === 1 ? (
            <QuickEntryPropertyStep
              propertyId={draft.propertyId}
              properties={properties}
              clients={clients}
              onChange={(propertyId) => setDraft((current) => ({ ...current, propertyId }))}
            />
          ) : null}

          {currentStep === 2 ? (
            <QuickEntryScheduleStep
              draft={draft}
              onChange={(patch) =>
                setDraft((current) => {
                  if ('hoursWorked' in patch && typeof patch.hoursWorked === 'number') {
                    return applyQuickEntryManualHours(current, patch.hoursWorked)
                  }

                  return applyQuickEntrySchedulePatch(current, patch)
                })
              }
              onSyncHours={() => setDraft((current) => syncQuickEntryHoursWithSchedule(current))}
            />
          ) : null}

          {currentStep === 3 ? (
            <QuickEntryPayStep
              draft={draft}
              workerDefaultRate={worker?.defaultHourlyRate}
              onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
            />
          ) : null}

          {currentStep === 4 ? (
            <>
              <QuickEntryReviewStep
                notes={draft.notes}
                onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
              />
              <WarningBanner title="Impacto en payroll" tone="info">
                Se sumara al cierre mensual de {payrollMonthLabel}. Total a pagar previsto: {totalPay.toFixed(2)} EUR. Confirmado para nomina interna.
              </WarningBanner>
            </>
          ) : null}

          <StepFlowFooter>
            <FormFlowActions
              secondaryAction={
                currentStep > 0 ? (
                  <Button variant="secondary" onClick={() => setCurrentStep((value) => value - 1)}>
                    Atras
                  </Button>
                ) : undefined
              }
              primaryAction={
                currentStep < steps.length - 1 ? (
                  <Button onClick={() => setCurrentStep((value) => value + 1)} disabled={!canContinue}>
                    Continuar
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      if (!worker || !property || errors.length > 0) {
                        return
                      }

                      const created = repositories.services.createService(
                        buildQuickEntryService(draft, property, worker),
                        'quick_entry',
                      )
                      setSavedServiceId(created.id)
                    }}
                    disabled={!worker || !property || errors.length > 0}
                  >
                    Guardar
                  </Button>
                )
              }
            />
          </StepFlowFooter>
        </div>
      </StepFlowScreen>
    </div>
  )
}
