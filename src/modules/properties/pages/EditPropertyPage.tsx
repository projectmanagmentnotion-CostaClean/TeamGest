import { useParams } from 'react-router-dom'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageHeader } from '../../../components/ui/PageHeader'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { PropertyFormFlow } from '../components/manage/PropertyFormFlow'

export function EditPropertyPage() {
  const { id } = useParams()
  const property = getRepositories().properties.getPropertyById(id ?? '')

  if (!property) {
    return <EmptyState title="Inmueble no encontrado" description="No existe un registro local con ese identificador." />
  }

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Inmuebles" title="Editar inmueble" description="Actualiza la ficha operativa del inmueble." />
      <PropertyFormFlow property={property} />
    </div>
  )
}
