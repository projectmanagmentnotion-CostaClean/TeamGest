import { FormField } from '../../../../components/forms/FormField'
import type { Property } from '../../../../domain/properties/property.types'

type QuickEntryPropertyStepProps = {
  propertyId: string
  properties: Property[]
  onChange: (propertyId: string) => void
}

export function QuickEntryPropertyStep({
  onChange,
  properties,
  propertyId,
}: QuickEntryPropertyStepProps) {
  return (
    <FormField
      control="select"
      label="Inmueble"
      value={propertyId}
      options={[
        { label: 'Selecciona inmueble', value: '' },
        ...properties.map((property) => ({ label: `${property.name} · ${property.city}`, value: property.id })),
      ]}
      onChange={onChange}
    />
  )
}
