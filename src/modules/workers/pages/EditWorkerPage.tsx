import { useParams } from 'react-router-dom'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageHeader } from '../../../components/ui/PageHeader'
import { getRepositories } from '../../../infrastructure/repositoryFactory'
import { WorkerFormFlow } from '../components/manage/WorkerFormFlow'

export function EditWorkerPage() {
  const { id } = useParams()
  const worker = getRepositories().workers.getWorkerById(id ?? '')

  if (!worker) {
    return <EmptyState title="Trabajador no encontrado" description="No existe un registro local con ese identificador." />
  }

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Trabajadores" title="Editar trabajador" description="Ajusta la ficha operativa sin salir del flujo local-first." />
      <WorkerFormFlow worker={worker} />
    </div>
  )
}
