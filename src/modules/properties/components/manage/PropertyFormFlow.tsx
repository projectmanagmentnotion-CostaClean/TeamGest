import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormField } from '../../../../components/forms/FormField'
import { FormFlow } from '../../../../components/forms/FormFlow'
import { FormFlowActions } from '../../../../components/forms/FormFlowActions'
import { FormFlowStep } from '../../../../components/forms/FormFlowStep'
import { FormValidationPanel } from '../../../../components/forms/FormValidationPanel'
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

export function PropertyFormFlow({ property }: PropertyFormFlowProps) {
  const repositories = getRepositories()
  const navigate = useNavigate()
  const clients = repositories.clients.listClients().filter((item) => item.status !== 'archived')
  const [draft, setDraft] = useState(createPropertyFormDraft(property))
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
    <FormFlow
      title={property ? 'Editar inmueble' : 'Nuevo inmueble'}
      description="Alta local-first del parque operativo."
      sidebar={
        <div className="page-stack">
          <PropertyFormSummary clients={clients} draft={draft} />
          <FormValidationPanel errors={errors} />
        </div>
      }
    >
      <FormFlowStep title="Relacion comercial">
        <div className="form-grid">
          <FormField
            control="select"
            label="Cliente"
            value={draft.clientId}
            options={[
              { label: 'Selecciona cliente', value: '' },
              ...clients.map((client) => ({ label: client.name, value: client.id })),
            ]}
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
          <Button variant="secondary" onClick={() => navigate(property ? `/properties/${property.id}` : '/properties')}>
            Cancelar
          </Button>
        }
        primaryAction={<Button onClick={save} disabled={errors.length > 0}>{property ? 'Guardar cambios' : 'Crear inmueble'}</Button>}
      />
    </FormFlow>
  )
}
