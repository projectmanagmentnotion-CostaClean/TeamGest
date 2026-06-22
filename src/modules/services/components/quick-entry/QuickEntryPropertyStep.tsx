import { SearchableEntitySelect } from '../../../../components/forms/SearchableEntitySelect'
import { Card } from '../../../../components/ui/Card'
import type { Client } from '../../../../domain/clients/client.types'
import type { Property } from '../../../../domain/properties/property.types'
import { formatPropertyTypeLabel } from '../../../../utils/labels'

type QuickEntryPropertyStepProps = {
  propertyId: string
  properties: Property[]
  clients: Client[]
  onChange: (propertyId: string) => void
}

export function QuickEntryPropertyStep({
  clients,
  onChange,
  properties,
  propertyId,
}: QuickEntryPropertyStepProps) {
  const selectedProperty = properties.find((property) => property.id === propertyId)
  const selectedClient = clients.find((client) => client.id === selectedProperty?.clientId)

  return (
    <section className="page-stack">
      <div className="section-header__content">
        <h3>Selecciona un inmueble</h3>
        <p>Busca por nombre, cliente, ciudad o direccion para evitar listas largas.</p>
      </div>
      <SearchableEntitySelect
        label="Buscar inmueble"
        entityLabel="inmueble"
        value={propertyId}
        placeholder="Buscar inmueble"
        options={properties.map((property) => ({
          id: property.id,
          label: property.name,
          subtitle: `${clients.find((client) => client.id === property.clientId)?.name ?? 'Cliente no disponible'} · ${property.city}`,
          meta: property.address,
          status: property.status,
        }))}
        onChange={onChange}
      />
      {selectedProperty ? (
        <Card title={selectedProperty.name} description="Inmueble seleccionado">
          <div className="detail-grid">
            <div>
              <span className="muted-caption">Cliente</span>
              <strong>{selectedClient?.name ?? 'Cliente no disponible'}</strong>
            </div>
            <div>
              <span className="muted-caption">Ciudad</span>
              <strong>{selectedProperty.city}</strong>
            </div>
            <div>
              <span className="muted-caption">Tipo</span>
              <strong>{formatPropertyTypeLabel(selectedProperty.propertyType)}</strong>
            </div>
          </div>
        </Card>
      ) : null}
    </section>
  )
}
