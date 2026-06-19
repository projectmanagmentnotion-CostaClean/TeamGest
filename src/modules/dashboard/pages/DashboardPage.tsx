import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { StatCard } from '../../../components/ui/StatCard'
import { Stepper } from '../../../components/ui/Stepper'
import { WarningBanner } from '../../../components/ui/WarningBanner'

export function DashboardPage() {
  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Inicio</p>
          <h1>Dashboard operativo</h1>
          <p className="page-description">
            Vista central para resumir actividad diaria, servicios activos, incidencias y
            cierres mensuales.
          </p>
        </div>
        <Badge tone="info">Base lista para Sprint 2</Badge>
      </section>

      <section className="stats-grid">
        <StatCard label="Servicios" value="0" hint="Programados, en curso y cerrados." />
        <StatCard label="Trabajadores" value="0" hint="Disponibilidad y coste por hora." />
        <StatCard label="Clientes" value="0" hint="Relaciones y propiedades vinculadas." />
      </section>

      <WarningBanner title="Arquitectura intencional" tone="info">
        Sprint 1 se centra en navegación, consistencia visual y límites claros entre UI y
        lógica futura.
      </WarningBanner>

      <Card
        title="Próximo flujo operativo"
        description="La experiencia StepFlow preparará los procesos de alta, asignación y cierre."
      >
        <Stepper
          currentStep={1}
          steps={[
            'Definir servicio',
            'Asignar trabajadores',
            'Registrar costes',
            'Revisar cierre mensual',
          ]}
        />
      </Card>
    </div>
  )
}
