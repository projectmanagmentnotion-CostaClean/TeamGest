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
import type { Property } from '../../../../domain/properties/property.types'
import { getRepositories } from '../../../../infrastructure/repositoryFactory'
import { createPropertyFormDraft } from '../../services/propertyFormDraft'
import { validatePropertyForm } from '../../services/propertyFormValidation'
import { PropertyFormSummary } from './PropertyFormSummary'

type PropertyFormFlowProps = {
  property?: Property
}

const propertyTypeOptions = [
  { label: 'Apartamento', value: 'apartment' },
  { label: 'Casa', value: 'house' },
  { label: 'Oficina', value: 'office' },
  { label: 'Gimnasio', value: 'gym' },
  { label: 'Comercial', value: 'commercial' },
  { label: 'Hotel', value: 'hotel' },
  { label: 'Turistico', value: 'tourist_apartment' },
  { label: 'Otro', value: 'other' },
]

const statusOptions = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
  { label: 'Archivado', value: 'archived' },
]

const steps = ['Relacion comercial', 'Notas y revision']

export function PropertyFormFlow({ property }: PropertyFormFlowProps) {
  const repositories = getRepositories()
  const navigate = useNavigate()
  const clients = repositories.clients.listClients().filter((item) => item.status !== 'archived')
  const [draft, setDraft] = useState(createPropertyFormDraft(property))
  const [currentStep, setCurrentStep] = useState(0)
  const errors = validatePropertyForm(draft)

  const save = () => {
    if (errors.length > 0) {
      return
    }

    if (property) {
      repositories.properties.updateProperty(property.id, draft)
      navigate(`/properties/${property.id}`)
      return
    }

    const created = repositories.properties.createProperty(draft)
    navigate(`/properties/${created.id}`)
  }

  return (
    <StepFlowScreen
      title={property ? 'Editar inmueble' : 'Nuevo inmueble'}
      description="Alta local-first del parque operativo con pasos cortos y buscadores."
      sidebar={
        <div className="page-stack">
          <PropertyFormSummary clients={clients} draft={draft} />
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
              ? 'Vincula el inmueble al cliente correcto y completa su contexto base.'
              : 'Anade notas utiles y revisa que la ficha quede lista para registrar horas y servicios.'
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
              onChange={(value) => setDraft((current) => ({ ...current, clientId: value }))}
            />
            <FormField label="Nombre" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value }))} />
            <FormField label="Direccion" value={draft.address} onChange={(value) => setDraft((current) => ({ ...current, address: value }))} />
            <FormField label="Ciudad" value={draft.city} onChange={(value) => setDraft((current) => ({ ...current, city: value }))} />
            <FormField label="Codigo postal" value={draft.postalCode ?? ''} onChange={(value) => setDraft((current) => ({ ...current, postalCode: value }))} />
            <FormField
              control="select"
              label="Tipo"
              value={draft.propertyType}
              options={propertyTypeOptions}
              onChange={(value) => setDraft((current) => ({ ...current, propertyType: value as Property['propertyType'] }))}
            />
            <FormField type="number" min={0} label="Habitaciones" value={draft.rooms ?? ''} onChange={(value) => setDraft((current) => ({ ...current, rooms: value ? Number(value) : undefined }))} />
            <FormField type="number" min={0} label="Banos" value={draft.bathrooms ?? ''} onChange={(value) => setDraft((current) => ({ ...current, bathrooms: value ? Number(value) : undefined }))} />
            <FormField
              control="select"
              label="Estado"
              value={draft.status}
              options={statusOptions}
              onChange={(value) => setDraft((current) => ({ ...current, status: value as Property['status'] }))}
            />
          </div>
        ) : null}

        {currentStep === 1 ? (
          <FormField
            control="textarea"
            label="Notas internas"
            value={draft.notes ?? ''}
            onChange={(value) => setDraft((current) => ({ ...current, notes: value }))}
          />
        ) : null}

        <StepFlowFooter>
          <FormFlowActions
            secondaryAction={
              currentStep > 0 ? (
                <Button variant="secondary" onClick={() => setCurrentStep((value) => value - 1)}>
                  Atras
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => navigate(property ? `/properties/${property.id}` : '/properties')}>
                  Cancelar
                </Button>
              )
            }
            primaryAction={
              currentStep < steps.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep((value) => value + 1)}
                  disabled={!draft.clientId || !draft.name.trim() || !draft.address.trim() || !draft.city.trim()}
                >
                  Continuar
                </Button>
              ) : (
                <Button onClick={save} disabled={errors.length > 0}>
                  {property ? 'Guardar cambios' : 'Guardar'}
                </Button>
              )
            }
          />
        </StepFlowFooter>
      </div>
    </StepFlowScreen>
  )
}
