import { PageHeader } from '../../../components/ui/PageHeader'
import { PropertyFormFlow } from '../components/manage/PropertyFormFlow'

export function NewPropertyPage() {
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Inmuebles" title="Nuevo inmueble" description="Alta local-first del parque operativo." />
      <PropertyFormFlow />
    </div>
  )
}
