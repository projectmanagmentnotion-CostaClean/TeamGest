import { PageHeader } from '../../../components/ui/PageHeader'
import { WorkerFormFlow } from '../components/manage/WorkerFormFlow'

export function NewWorkerPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Trabajadores"
        title="Nuevo trabajador"
        description="Alta local-first del equipo operativo con foco en horas limpias y cierres mensuales fiables."
      />
      <WorkerFormFlow />
    </div>
  )
}
