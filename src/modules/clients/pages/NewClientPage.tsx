import { PageHeader } from '../../../components/ui/PageHeader'
import { ClientFormFlow } from '../components/manage/ClientFormFlow'

export function NewClientPage() {
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Clientes" title="Nuevo cliente" description="Alta comercial local-first para la cartera operativa." />
      <ClientFormFlow />
    </div>
  )
}
