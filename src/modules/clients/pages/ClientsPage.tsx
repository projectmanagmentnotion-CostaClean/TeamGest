import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'

export function ClientsPage() {
  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Clientes</p>
          <h1>Cartera de clientes</h1>
          <p className="page-description">
            Este módulo organizará contactos, condiciones, facturación futura y relación con
            propiedades.
          </p>
        </div>
      </section>

      <Card title="Vista inicial" description="Arquitectura lista para listas, fichas y relaciones.">
        <EmptyState
          title="Sin clientes visibles"
          description="Sprint 1 mantiene el módulo limpio y preparado sin persistencia ni datos simulados."
          actionLabel="Nuevo cliente"
        />
      </Card>
    </div>
  )
}
