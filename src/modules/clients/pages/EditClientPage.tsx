import { useParams } from 'react-router-dom'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageHeader } from '../../../components/ui/PageHeader'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { ClientFormFlow } from '../components/manage/ClientFormFlow'

export function EditClientPage() {
  const { id } = useParams()
  const client = getRepositories().clients.getClientById(id ?? '')

  if (!client) {
    return <EmptyState title="Cliente no encontrado" description="No existe un registro local con ese identificador." />
  }

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Clientes" title="Editar cliente" description="Ajusta la ficha comercial sin activar integraciones reales." />
      <ClientFormFlow client={client} />
    </div>
  )
}
