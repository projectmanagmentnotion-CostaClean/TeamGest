import { PageHeader } from '../../../components/ui/PageHeader'
import { ServiceFormFlow } from '../components/manage/ServiceFormFlow'

export function NewServicePage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Servicios"
        title="Nuevo servicio"
        description="Alta manual local-first para casos fuera del Quick Work Entry."
      />
      <ServiceFormFlow />
    </div>
  )
}
