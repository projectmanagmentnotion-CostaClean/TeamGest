import { useParams } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'

export function PayrollMonthDetailPage() {
  const { month } = useParams()

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Cierres</p>
          <h1>Detalle mensual</h1>
          <p className="page-description">
            La página mostrará el cierre del mes, validaciones, incidencias y liquidación por
            trabajador.
          </p>
        </div>
      </section>

      <Card title="Mes preparado" description={`Periodo objetivo: ${month ?? '-'}.`}>
        La estructura de detalle está lista para recibir reglas de payroll y resúmenes futuros.
      </Card>
    </div>
  )
}
