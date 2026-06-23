import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormField } from '../../../../components/forms/FormField'
import { FormFlowActions } from '../../../../components/forms/FormFlowActions'
import { FormValidationPanel } from '../../../../components/forms/FormValidationPanel'
import { StepFlowFooter } from '../../../../components/forms/StepFlowFooter'
import { StepFlowHeader } from '../../../../components/forms/StepFlowHeader'
import { StepFlowScreen } from '../../../../components/forms/StepFlowScreen'
import { Button } from '../../../../components/ui/Button'
import { Card } from '../../../../components/ui/Card'
import { WarningBanner } from '../../../../components/ui/WarningBanner'
import type { Worker } from '../../../../domain/workers/worker.types'
import { getRepositories } from '../../../../infrastructure/repositoryFactory'
import { createWorkerFormDraft } from '../../services/workerFormDraft'
import { validateWorkerForm } from '../../services/workerFormValidation'
import { WorkerFormSummary } from './WorkerFormSummary'

type WorkerFormFlowProps = {
  worker?: Worker
}

const roleOptions = [
  { label: 'Supervision', value: 'supervisor' },
  { label: 'Limpieza', value: 'cleaner' },
  { label: 'Especialista', value: 'specialist' },
  { label: 'Logistica', value: 'driver' },
]

const statusOptions = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
  { label: 'Archivado', value: 'archived' },
]

const steps = ['Datos base', 'Notas y revision']

export function WorkerFormFlow({ worker }: WorkerFormFlowProps) {
  const repositories = getRepositories()
  const navigate = useNavigate()
  const [draft, setDraft] = useState(createWorkerFormDraft(worker))
  const [currentStep, setCurrentStep] = useState(0)
  const errors = validateWorkerForm(draft)

  const save = () => {
    if (errors.length > 0) {
      return
    }

    if (worker) {
      repositories.workers.updateWorker(worker.id, draft)
      navigate(`/workers/${worker.id}`)
      return
    }

    const created = repositories.workers.createWorker(draft)
    navigate(`/workers/${created.id}`)
  }

  return (
    <StepFlowScreen
      title={worker ? 'Editar trabajador' : 'Nuevo trabajador'}
      description="Alta y mantenimiento local-first del equipo operativo sin formularios infinitos."
      sidebar={
        <div className="page-stack">
          <WorkerFormSummary draft={draft} />
          <FormValidationPanel errors={errors} />
        </div>
      }
    >
      <div className="page-stack">
        <StepFlowHeader
          currentStep={currentStep}
          steps={steps}
          title={steps[currentStep]}
          description={
            currentStep === 0
              ? 'Completa identidad, rol, contacto y tarifa base para que el control de horas y cierres sea fiable.'
              : 'Anade contexto operativo y revisa el resumen antes de guardar.'
          }
        />

        {!draft.defaultHourlyRate ? (
          <WarningBanner title="Tarifa pendiente" tone="warning">
            Este trabajador puede guardarse sin tarifa, pero las horas futuras exigiran revisar o completar la tarifa antes del cierre si ajustes la requiere.
          </WarningBanner>
        ) : null}

        {currentStep === 0 ? (
          <div className="form-grid">
            <FormField
              label="Nombre"
              hint="Nombre visible en registro de horas y cierres mensuales."
              value={draft.name}
              onChange={(value) => setDraft((current) => ({ ...current, name: value }))}
            />
            <FormField
              control="select"
              label="Rol"
              hint="Ayuda a identificar el tipo de trabajo y lectura operativa."
              value={draft.role}
              options={roleOptions}
              onChange={(value) => setDraft((current) => ({ ...current, role: value as Worker['role'] }))}
            />
            <FormField
              label="Telefono"
              hint="Contacto rapido para coordinacion del servicio."
              value={draft.phone ?? ''}
              onChange={(value) => setDraft((current) => ({ ...current, phone: value }))}
            />
            <FormField
              type="email"
              label="Email"
              hint="Opcional. Util si necesitas compartir avisos o seguimiento."
              value={draft.email ?? ''}
              onChange={(value) => setDraft((current) => ({ ...current, email: value }))}
            />
            <FormField
              type="number"
              min={0}
              step={0.5}
              label="Tarifa horaria"
              hint="Se usara como referencia por defecto al registrar horas."
              value={draft.defaultHourlyRate ?? ''}
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  defaultHourlyRate: value ? Number(value) : undefined,
                }))
              }
            />
            <FormField
              control="select"
              label="Estado"
              hint="Solo los trabajadores activos deberian recibir nuevas horas con normalidad."
              value={draft.status}
              options={statusOptions}
              onChange={(value) => setDraft((current) => ({ ...current, status: value as Worker['status'] }))}
            />
          </div>
        ) : null}

        {currentStep === 1 ? (
          <div className="page-stack">
            <FormField
              control="textarea"
              label="Notas internas"
              hint="Contexto breve para coordinacion, disponibilidad o seguimiento."
              value={draft.notes ?? ''}
              onChange={(value) => setDraft((current) => ({ ...current, notes: value }))}
            />
            <Card
              title="Revision antes de guardar"
              description="Comprueba que el trabajador queda listo para registro de horas y cierre mensual."
            >
              <div className="detail-grid">
                <div>
                  <span className="muted-caption">Nombre</span>
                  <strong>{draft.name || 'Pendiente'}</strong>
                </div>
                <div>
                  <span className="muted-caption">Tarifa base</span>
                  <strong>{draft.defaultHourlyRate ? `${draft.defaultHourlyRate} EUR/h` : 'Pendiente'}</strong>
                </div>
              </div>
            </Card>
          </div>
        ) : null}

        <StepFlowFooter>
          <FormFlowActions
            secondaryAction={
              currentStep > 0 ? (
                <Button variant="secondary" onClick={() => setCurrentStep((value) => value - 1)}>
                  Atras
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => navigate(worker ? `/workers/${worker.id}` : '/workers')}>
                  Cancelar
                </Button>
              )
            }
            primaryAction={
              currentStep < steps.length - 1 ? (
                <Button onClick={() => setCurrentStep((value) => value + 1)} disabled={!draft.name.trim()}>
                  Continuar
                </Button>
              ) : (
                <Button onClick={save} disabled={errors.length > 0}>
                  {worker ? 'Guardar cambios' : 'Guardar trabajador'}
                </Button>
              )
            }
          />
        </StepFlowFooter>
      </div>
    </StepFlowScreen>
  )
}
