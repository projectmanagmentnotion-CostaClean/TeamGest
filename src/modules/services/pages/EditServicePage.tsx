import { useParams } from 'react-router-dom'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageHeader } from '../../../components/ui/PageHeader'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { ServiceFormFlow } from '../components/manage/ServiceFormFlow'

export function EditServicePage() {
  const { id } = useParams()
  const service = getRepositories().services.getServiceById(id ?? '')

  if (!service) {
    return <EmptyState title="Servicio no encontrado" description="No existe un registro local con ese identificador." />
  }

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Servicios" title="Editar servicio" description="Mantenimiento local de un servicio fuera del flujo rapido." />
      <ServiceFormFlow service={service} />
    </div>
  )
}
