import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'

export function ServicesPage() {
  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Servicios</p>
          <h1>Planificación de servicios</h1>
          <p className="page-description">
            Este módulo concentrará altas, seguimiento de estado, asignaciones y coste laboral
            por servicio.
          </p>
        </div>
        <Badge tone="warning">Sin lógica de negocio todavía</Badge>
      </section>

      <Card
        title="Diseñado para crecer"
        description="Las futuras vistas podrán introducir StepFlow, checklist y validaciones por estado."
      >
        <EmptyState
          title="Sin servicios cargados"
          description="La página se limita a la arquitectura visual y a la experiencia base del listado."
          actionLabel="Nuevo servicio"
        />
      </Card>
    </div>
  )
}
