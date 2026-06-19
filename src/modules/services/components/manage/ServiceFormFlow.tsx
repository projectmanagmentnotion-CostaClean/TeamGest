import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormField } from '../../../../components/forms/FormField'
import { FormFlow } from '../../../../components/forms/FormFlow'
import { FormFlowActions } from '../../../../components/forms/FormFlowActions'
import { FormFlowStep } from '../../../../components/forms/FormFlowStep'
import { FormValidationPanel } from '../../../../components/forms/FormValidationPanel'
import { Button } from '../../../../components/ui/Button'
import type { ServiceInput } from '../../../../domain/services/service.inputs'
import type { ServiceJob } from '../../../../domain/services/service.types'
import { createEntityId } from '../../../../utils/ids'
import { getRepositories } from '../../../../infrastructure/repositoryFactory'
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

export function ServiceFormFlow({ service }: ServiceFormFlowProps) {
  const repositories = getRepositories()
  const navigate = useNavigate()
  const clients = repositories.clients.listClients().filter((client) => client.status !== 'archived')
  const properties = repositories.properties.listProperties()
  const workers = repositories.workers.listWorkers().filter((worker) => worker.status !== 'archived')
  const [draft, setDraft] = useState(createServiceFormDraft(service))
  const availableProperties = properties.filter((property) => property.clientId === draft.clientId)
  const errors = validateServiceForm(draft)

  const updateAssignment = (
    workerId: string,
    patch: Partial<ServiceInput['assignments'][number]>,
  ) => {
    setDraft((current) => {
      const exists = current.assignments.find((assignment) => assignment.workerId === workerId)

      if (!exists) {
        return {
          ...current,
          assignments: [
            ...current.assignments,
            {
              workerId,
              hoursWorked: 1,
              confirmed: current.status !== 'draft',
              ...patch,
            },
          ],
        }
      }

      return {
        ...current,
        assignments: current.assignments.map((assignment) =>
          assignment.workerId === workerId ? { ...assignment, ...patch } : assignment,
        ),
      }
    })
  }

  const toggleWorker = (workerId: string) => {
    setDraft((current) => {
      const exists = current.assignments.some((assignment) => assignment.workerId === workerId)

      return {
        ...current,
        assignments: exists
          ? current.assignments.filter((assignment) => assignment.workerId !== workerId)
          : [
              ...current.assignments,
              {
                workerId,
                hoursWorked: 1,
                hourlyRate: workers.find((item) => item.id === workerId)?.defaultHourlyRate,
                confirmed: current.status !== 'draft',
              },
            ],
      }
    })
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
        id: createEntityId('assignment'),
        serviceJobId: '',
        createdAt: timestamp,
        updatedAt: timestamp,
        ...assignment,
      })),
    })
    navigate(`/services/${created.id}`)
  }

  return (
    <FormFlow
      title={service ? 'Editar servicio' : 'Nuevo servicio'}
      description="Mantenimiento local del servicio fuera del flujo rapido."
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
      <FormFlowStep title="Contexto">
        <div className="form-grid">
          <FormField
            control="select"
            label="Cliente"
            value={draft.clientId}
            options={[
              { label: 'Selecciona cliente', value: '' },
              ...clients.map((client) => ({ label: client.name, value: client.id })),
            ]}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                clientId: value,
                propertyId: '',
              }))
            }
          />
          <FormField
            control="select"
            label="Inmueble"
            value={draft.propertyId}
            options={[
              { label: 'Selecciona inmueble', value: '' },
              ...availableProperties.map((property) => ({ label: property.name, value: property.id })),
            ]}
            onChange={(value) => setDraft((current) => ({ ...current, propertyId: value }))}
          />
          <FormField
            control="select"
            label="Tipo"
            value={draft.serviceType}
            options={serviceTypeOptions}
            onChange={(value) => setDraft((current) => ({ ...current, serviceType: value as ServiceJob['serviceType'] }))}
          />
          <FormField
            control="select"
            label="Estado"
            value={draft.status}
            options={statusOptions}
            onChange={(value) => setDraft((current) => ({ ...current, status: value as ServiceJob['status'] }))}
          />
          <FormField type="date" label="Fecha" value={draft.date} onChange={(value) => setDraft((current) => ({ ...current, date: value }))} />
          <FormField type="time" label="Inicio" value={draft.startTime ?? ''} onChange={(value) => setDraft((current) => ({ ...current, startTime: value }))} />
          <FormField type="time" label="Fin" value={draft.endTime ?? ''} onChange={(value) => setDraft((current) => ({ ...current, endTime: value }))} />
        </div>
      </FormFlowStep>

      <FormFlowStep title="Equipo">
        <div className="cards-grid">
          {workers.map((worker) => {
            const assignment = draft.assignments.find((item) => item.workerId === worker.id)

            return (
              <div key={worker.id} className="row-card">
                <div className="row-card__main">
                  <div>
                    <h4>{worker.name}</h4>
                    <p>{worker.role}</p>
                  </div>
                  <Button variant={assignment ? 'primary' : 'secondary'} size="sm" onClick={() => toggleWorker(worker.id)}>
                    {assignment ? 'Incluido' : 'Agregar'}
                  </Button>
                </div>
                {assignment ? (
                  <div className="form-grid">
                    <FormField
                      type="number"
                      min={0.5}
                      step={0.5}
                      label="Horas"
                      value={assignment.hoursWorked}
                      onChange={(value) => updateAssignment(worker.id, { hoursWorked: Number(value) || 0 })}
                    />
                    <FormField
                      type="number"
                      min={0}
                      step={0.5}
                      label="Tarifa"
                      value={assignment.hourlyRate ?? ''}
                      onChange={(value) => updateAssignment(worker.id, { hourlyRate: value ? Number(value) : undefined })}
                    />
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </FormFlowStep>

      <FormFlowStep title="Notas">
        <FormField
          control="textarea"
          label="Notas internas"
          value={draft.notes ?? ''}
          onChange={(value) => setDraft((current) => ({ ...current, notes: value }))}
        />
      </FormFlowStep>

      <FormFlowActions
        secondaryAction={
          <Button variant="secondary" onClick={() => navigate(service ? `/services/${service.id}` : '/services')}>
            Cancelar
          </Button>
        }
        primaryAction={<Button onClick={save} disabled={errors.length > 0}>{service ? 'Guardar cambios' : 'Crear servicio'}</Button>}
      />
    </FormFlow>
  )
}
