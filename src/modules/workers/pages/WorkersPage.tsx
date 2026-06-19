import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'

export function WorkersPage() {
  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Trabajadores</p>
          <h1>Equipo y costes hora</h1>
          <p className="page-description">
            Aquí se gestionarán perfiles, tarifas, disponibilidad y seguimiento operativo del
            personal.
          </p>
        </div>
      </section>

      <Card
        title="Alcance previsto"
        description="El módulo incluirá detalle de trabajador, asignaciones, incidencias y resumen mensual."
      >
        <EmptyState
          title="Sin fichas activas todavía"
          description="Sprint 1 deja lista la estructura del módulo sin datos ni formularios reales."
          actionLabel="Nuevo trabajador"
        />
      </Card>
    </div>
  )
}
