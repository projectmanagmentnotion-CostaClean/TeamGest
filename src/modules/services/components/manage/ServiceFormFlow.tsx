import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormField } from '../../../../components/forms/FormField'
import { FormFlowActions } from '../../../../components/forms/FormFlowActions'
import { FormValidationPanel } from '../../../../components/forms/FormValidationPanel'
import { SearchableEntitySelect } from '../../../../components/forms/SearchableEntitySelect'
import { StepFlowFooter } from '../../../../components/forms/StepFlowFooter'
import { StepFlowHeader } from '../../../../components/forms/StepFlowHeader'
import { StepFlowScreen } from '../../../../components/forms/StepFlowScreen'
import { Button } from '../../../../components/ui/Button'
import { Card } from '../../../../components/ui/Card'
import { WarningBanner } from '../../../../components/ui/WarningBanner'
import type { ServiceInput } from '../../../../domain/services/service.inputs'
import type { ServiceJob } from '../../../../domain/services/service.types'
import { getRepositories } from '../../../../infrastructure/repositoryFactory'
import { createEntityId } from '../../../../utils/ids'
import { formatWorkerRoleLabel } from '../../../../utils/labels'
import { createServiceFormDraft } from '../../services/serviceFormDraft'
import { validateServiceForm } from '../../services/serviceFormValidation'
import { ServiceFormSummary } from './ServiceFormSummary'

type ServiceFormFlowProps = {
  service?: ServiceJob
}

const serviceTypeOptions = [
  { label: 'Limpieza basica', value: 'basic_cleaning' },
  { label: 'Limpieza profunda', value: 'deep_cleaning' },
  { label: 'Final de obra', value: 'post_construction' },
  { label: 'Cambio turistico', value: 'airbnb_turnover' },
  { label: 'Gimnasio', value: 'gym_cleaning' },
  { label: 'Oficina', value: 'office_cleaning' },
  { label: 'Cristales', value: 'windows' },
  { label: 'Extra', value: 'extra' },
  { label: 'Otro', value: 'other' },
]

const statusOptions = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Programado', value: 'scheduled' },
  { label: 'En curso', value: 'in_progress' },
  { label: 'Completado', value: 'completed' },
  { label: 'Revisado', value: 'reviewed' },
  { label: 'Cerrado', value: 'closed' },
]

const steps = ['Contexto', 'Equipo', 'Notas y revision']

export function ServiceFormFlow({ service }: ServiceFormFlowProps) {
  const repositories = getRepositories()
  const navigate = useNavigate()
  const clients = repositories.clients.listClients().filter((client) => client.status !== 'archived')
  const properties = repositories.properties.listProperties()
  const workers = repositories.workers.listWorkers().filter((worker) => worker.status !== 'archived')
  const [draft, setDraft] = useState(createServiceFormDraft(service))
  const [currentStep, setCurrentStep] = useState(0)
  const [workerToAdd, setWorkerToAdd] = useState('')
  const availableProperties = properties.filter((property) => property.clientId === draft.clientId)
  const errors = validateServiceForm(draft)

  const updateAssignment = (
    workerId: string,
    patch: Partial<ServiceInput['assignments'][number]>,
  ) => {
    setDraft((current) => ({
      ...current,
      assignments: current.assignments.map((assignment) =>
        assignment.workerId === workerId ? { ...assignment, ...patch } : assignment,
      ),
    }))
  }

  const addWorker = (workerId: string) => {
    if (!workerId) {
      return
    }

    setDraft((current) => {
      if (current.assignments.some((assignment) => assignment.workerId === workerId)) {
        return current
      }

      return {
        ...current,
        assignments: [
          ...current.assignments,
          {
            assignmentId: service?.assignments.find((assignment) => assignment.workerId === workerId)?.id,
            workerId,
            hoursWorked: 1,
            hourlyRate: workers.find((item) => item.id === workerId)?.defaultHourlyRate,
            confirmed: current.status !== 'draft',
          },
        ],
      }
    })
    setWorkerToAdd('')
  }

  const removeWorker = (workerId: string) => {
    setDraft((current) => ({
      ...current,
      assignments: current.assignments.filter((assignment) => assignment.workerId !== workerId),
    }))
  }

  const save = () => {
    if (errors.length > 0) {
      return
    }

    if (service) {
      const result = repositories.services.updateService(service.id, draft)
      if (result.service) {
        navigate(`/services/${service.id}`)
      }
      return
    }

    const timestamp = new Date().toISOString()
    const created = repositories.services.createService({
      id: createEntityId('service'),
      createdAt: timestamp,
      updatedAt: timestamp,
      ...draft,
      assignments: draft.assignments.map((assignment) => ({
        id: assignment.assignmentId ?? createEntityId('assignment'),
        serviceJobId: '',
        createdAt: timestamp,
        updatedAt: timestamp,
        ...assignment,
      })),
    })
    navigate(`/services/${created.id}`)
  }

  const canContinue =
    (currentStep === 0 && Boolean(draft.clientId && draft.propertyId && draft.date)) ||
    (currentStep === 1 &&
      draft.assignments.length > 0 &&
      draft.assignments.every((assignment) => assignment.hoursWorked > 0))

  return (
    <StepFlowScreen
      title={service ? 'Editar servicio' : 'Nuevo servicio'}
      description="Flujo controlado para preparar un servicio completo sin listas infinitas."
      sidebar={
        <div className="page-stack">
          <ServiceFormSummary
            clients={clients}
            draft={draft}
            properties={properties}
            workers={workers}
          />
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
              ? 'Selecciona cliente, inmueble, fecha y estado operativo.'
              : currentStep === 1
                ? 'Asigna equipo, horas y tarifa evitando paredes de selectores.'
                : 'Revisa notas internas y valida el impacto en cierre antes de guardar.'
          }
        />

        {currentStep === 0 ? (
          <div className="form-grid">
            <SearchableEntitySelect
              label="Buscar cliente"
              entityLabel="cliente"
              value={draft.clientId}
              placeholder="Buscar cliente"
              options={clients.map((client) => ({
                id: client.id,
                label: client.name,
                subtitle: client.phone ?? client.email ?? 'Contacto pendiente',
                status: client.status,
              }))}
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  clientId: value,
                  propertyId: '',
                }))
              }
            />
            <SearchableEntitySelect
              label="Buscar inmueble"
              entityLabel="inmueble"
              value={draft.propertyId}
              placeholder="Buscar inmueble"
              options={availableProperties.map((property) => ({
                id: property.id,
                label: property.name,
                subtitle: `${property.city} - ${property.address}`,
                status: property.status,
              }))}
              disabled={!draft.clientId}
              onChange={(value) => setDraft((current) => ({ ...current, propertyId: value }))}
            />
            <FormField
              control="select"
              label="Tipo"
              hint="Ayuda a clasificar el servicio para seguimiento interno."
              value={draft.serviceType}
              options={serviceTypeOptions}
              onChange={(value) => setDraft((current) => ({ ...current, serviceType: value as ServiceJob['serviceType'] }))}
            />
            <FormField
              control="select"
              label="Estado"
              hint="Usa completado o revisado solo cuando el trabajo ya exista realmente."
              value={draft.status}
              options={statusOptions}
              onChange={(value) => setDraft((current) => ({ ...current, status: value as ServiceJob['status'] }))}
            />
            <FormField
              type="date"
              label="Fecha"
              hint="La fecha define el mes del cierre al que impacta."
              value={draft.date}
              onChange={(value) => setDraft((current) => ({ ...current, date: value }))}
            />
            <FormField
              type="time"
              label="Inicio"
              hint="Opcional si quieres dejar trazado el horario."
              value={draft.startTime ?? ''}
              onChange={(value) => setDraft((current) => ({ ...current, startTime: value }))}
            />
            <FormField
              type="time"
              label="Fin"
              hint="Opcional. Puede ayudar a revisar horas mas tarde."
              value={draft.endTime ?? ''}
              onChange={(value) => setDraft((current) => ({ ...current, endTime: value }))}
            />
          </div>
        ) : null}

        {currentStep === 1 ? (
          <div className="page-stack">
            <Card
              title="Equipo asignado"
              description="Selecciona trabajadores y ajusta sus horas, tarifa, extras o deducciones."
            >
              <div className="detail-grid">
                <div>
                  <span className="muted-caption">Trabajadores</span>
                  <strong>{draft.assignments.length}</strong>
                </div>
                <div>
                  <span className="muted-caption">Horas cargadas</span>
                  <strong>{draft.assignments.reduce((sum, assignment) => sum + assignment.hoursWorked, 0).toFixed(1)} h</strong>
                </div>
              </div>
            </Card>

            <SearchableEntitySelect
              label="Buscar trabajador"
              entityLabel="trabajador"
              value={workerToAdd}
              placeholder="Buscar trabajador"
              options={workers.map((worker) => ({
                id: worker.id,
                label: worker.name,
                subtitle: formatWorkerRoleLabel(worker.role),
                meta: worker.phone ?? worker.email ?? 'Contacto pendiente',
                status: worker.status,
              }))}
              onChange={(value) => setWorkerToAdd(value)}
            />
            <Button variant="secondary" onClick={() => addWorker(workerToAdd)} disabled={!workerToAdd}>
              Anadir trabajador
            </Button>

            {draft.assignments.length === 0 ? (
              <Card title="Trabajadores seleccionados" description="Todavia no hay trabajadores anadidos.">
                <p className="muted-caption">Anade al menos un trabajador antes de continuar.</p>
              </Card>
            ) : (
              <div className="stack-list">
                {draft.assignments.map((assignment) => {
                  const worker = workers.find((item) => item.id === assignment.workerId)
                  return (
                    <Card
                      key={assignment.workerId}
                      title={worker?.name ?? 'Trabajador no disponible'}
                      description={worker ? formatWorkerRoleLabel(worker.role) : 'Sin datos'}
                      action={
                        <Button variant="ghost" size="sm" onClick={() => removeWorker(assignment.workerId)}>
                          Quitar
                        </Button>
                      }
                    >
                      <div className="form-grid">
                        <FormField
                          type="number"
                          min={0.5}
                          step={0.5}
                          label="Horas"
                          hint="Se usaran para el calculo del pago interno."
                          value={assignment.hoursWorked}
                          onChange={(value) => updateAssignment(assignment.workerId, { hoursWorked: Number(value) || 0 })}
                        />
                        <FormField
                          type="number"
                          min={0}
                          step={0.5}
                          label="Tarifa"
                          hint="Si queda vacia, el cierre puede bloquear el pago segun ajustes."
                          value={assignment.hourlyRate ?? ''}
                          onChange={(value) => updateAssignment(assignment.workerId, { hourlyRate: value ? Number(value) : undefined })}
                        />
                        <FormField
                          type="number"
                          min={0}
                          step={0.5}
                          label="Extra"
                          hint="Importe adicional puntual."
                          value={assignment.extraAmount ?? ''}
                          onChange={(value) => updateAssignment(assignment.workerId, { extraAmount: value ? Number(value) : undefined })}
                        />
                        <FormField
                          type="number"
                          min={0}
                          step={0.5}
                          label="Deduccion"
                          hint="Descuento puntual sobre el pago estimado."
                          value={assignment.deductions ?? ''}
                          onChange={(value) => updateAssignment(assignment.workerId, { deductions: value ? Number(value) : undefined })}
                        />
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="page-stack">
            <FormField
              control="textarea"
              label="Notas internas"
              hint="Contexto operativo, observaciones o aclaraciones para revision posterior."
              value={draft.notes ?? ''}
              onChange={(value) => setDraft((current) => ({ ...current, notes: value }))}
            />
            <Card
              title="Revision antes de guardar"
              description="Comprueba que el servicio deja claro quien trabajo, cuando y con que impacto en cierre."
            >
              <div className="detail-grid">
                <div>
                  <span className="muted-caption">Equipo</span>
                  <strong>{draft.assignments.length} asignaciones</strong>
                </div>
                <div>
                  <span className="muted-caption">Horas totales</span>
                  <strong>{draft.assignments.reduce((sum, assignment) => sum + assignment.hoursWorked, 0).toFixed(1)} h</strong>
                </div>
              </div>
            </Card>
            {['completed', 'reviewed', 'closed'].includes(draft.status) ? (
              <WarningBanner title="Impacto en cierre mensual" tone="info">
                Este servicio puede impactar directamente en control de horas y pago interno si sus asignaciones quedan confirmadas y validas.
              </WarningBanner>
            ) : null}
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
                <Button variant="secondary" onClick={() => navigate(service ? `/services/${service.id}` : '/services')}>
                  Cancelar
                </Button>
              )
            }
            primaryAction={
              currentStep < steps.length - 1 ? (
                <Button onClick={() => setCurrentStep((value) => value + 1)} disabled={!canContinue}>
                  Continuar
                </Button>
              ) : (
                <Button onClick={save} disabled={errors.length > 0}>
                  {service ? 'Guardar cambios' : 'Guardar servicio'}
                </Button>
              )
            }
          />
        </StepFlowFooter>
      </div>
    </StepFlowScreen>
  )
}
