import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'

export function PropertiesPage() {
  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Inmuebles</p>
          <h1>Parque de propiedades</h1>
          <p className="page-description">
            El módulo agrupará inmuebles por cliente, tipo, ubicación y necesidades del
            servicio.
          </p>
        </div>
      </section>

      <Card
        title="Base preparada"
        description="Las páginas están listas para conectar datos, filtros y detalle por propiedad."
      >
        <EmptyState
          title="Sin inmuebles cargados"
          description="Todavía no se incluyen datos, importaciones ni formularios reales."
          actionLabel="Nuevo inmueble"
        />
      </Card>
    </div>
  )
}
