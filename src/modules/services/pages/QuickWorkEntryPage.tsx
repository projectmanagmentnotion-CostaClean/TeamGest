import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { QuickEntryShell } from '../components/quick-entry/QuickEntryShell'
import { QuickEntryWorkerStep } from '../components/quick-entry/QuickEntryWorkerStep'
import { QuickEntryPropertyStep } from '../components/quick-entry/QuickEntryPropertyStep'
import { QuickEntryScheduleStep } from '../components/quick-entry/QuickEntryScheduleStep'
import { QuickEntryPayStep } from '../components/quick-entry/QuickEntryPayStep'
import { QuickEntryReviewStep } from '../components/quick-entry/QuickEntryReviewStep'
import { QuickEntrySuccess } from '../components/quick-entry/QuickEntrySuccess'
import { QuickEntrySummaryBar } from '../components/quick-entry/QuickEntrySummaryBar'
import { PageHeader } from '../../../components/ui/PageHeader'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { FormFlowActions } from '../../../components/forms/FormFlowActions'
import { Button } from '../../../components/ui/Button'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { buildQuickEntryService } from '../services/quickEntryBuilder'
import { createQuickEntryDraft } from '../services/quickEntryDraft'
import { validateQuickEntryDraft } from '../services/quickEntryValidation'

export function QuickWorkEntryPage() {
  const repositories = getRepositories()
  const workers = repositories.workers.listWorkers().filter((worker) => worker.status === 'active')
  const properties = repositories.properties.listProperties().filter((property) => property.status !== 'archived')
  const [searchParams] = useSearchParams()
  const [draft, setDraft] = useState(
    createQuickEntryDraft({
      workerId: searchParams.get('workerId') ?? '',
      propertyId: searchParams.get('propertyId') ?? '',
    }),
  )
  const [savedServiceId, setSavedServiceId] = useState<string | null>(null)
  const errors = validateQuickEntryDraft(draft)
  const worker = workers.find((item) => item.id === draft.workerId)
  const property = properties.find((item) => item.id === draft.propertyId)
  const savedService = savedServiceId ? repositories.services.getServiceById(savedServiceId) : null
  const laborCost = useMemo(() => {
    const rate = draft.hourlyRate ?? worker?.defaultHourlyRate ?? 0
    return rate * draft.hoursWorked + (draft.extraAmount ?? 0) - (draft.deductions ?? 0)
  }, [draft, worker?.defaultHourlyRate])

  if (savedService) {
    return (
      <div className="page-stack">
        <PageHeader
          eyebrow="Quick Entry"
          title="Registro completado"
          description="La entrada rapida ya quedo guardada en modo local-first."
        />
        <QuickEntrySuccess service={savedService} />
      </div>
    )
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Quick Entry"
        title="Registrar horas"
        description="Flujo primario para registrar trabajo realizado con una sola asignacion confirmada."
      />

      {errors.length > 0 ? (
        <WarningBanner title="Revision requerida" tone="warning">
          {errors[0]}
        </WarningBanner>
      ) : null}

      <QuickEntrySummaryBar draft={draft} property={property} worker={worker} />

      <QuickEntryShell>
        <div className="page-stack">
          <QuickEntryWorkerStep workerId={draft.workerId} workers={workers} onChange={(workerId) => setDraft((current) => ({ ...current, workerId }))} />
          <QuickEntryPropertyStep propertyId={draft.propertyId} properties={properties} onChange={(propertyId) => setDraft((current) => ({ ...current, propertyId }))} />
          <QuickEntryScheduleStep draft={draft} onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))} />
          <QuickEntryPayStep draft={draft} onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))} />
          <QuickEntryReviewStep notes={draft.notes} onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))} />
          <WarningBanner title="Coste estimado" tone="info">
            Coste laboral previsto: {laborCost.toFixed(2)} EUR
          </WarningBanner>
          <FormFlowActions
            primaryAction={
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
                Guardar horas
              </Button>
            }
          />
        </div>
      </QuickEntryShell>
    </div>
  )
}
