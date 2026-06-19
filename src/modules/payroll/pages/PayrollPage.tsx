import { Card } from '../../../components/ui/Card'
import { StatCard } from '../../../components/ui/StatCard'
import { WarningBanner } from '../../../components/ui/WarningBanner'

export function PayrollPage() {
  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Cierres</p>
          <h1>Resumen de payroll</h1>
          <p className="page-description">
            Este espacio consolidará horas, coste laboral, incidencias y estados de revisión por
            mes.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Mes activo" value="--" hint="Se definirá con datos reales en sprints futuros." />
        <StatCard label="Horas" value="--" hint="Resumen agregado por trabajador y periodo." />
        <StatCard label="Coste" value="--" hint="Cálculo de mano de obra pendiente." />
      </section>

      <WarningBanner title="Sin cierres calculados" tone="warning">
        Sprint 1 no añade cálculos, revisiones ni persistencia financiera.
      </WarningBanner>

      <Card title="Qué llegará aquí">
        Listado mensual, estados de revisión, diferencias por trabajador y trazabilidad de
        ajustes.
      </Card>
    </div>
  )
}
