import { useParams } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { WarningBanner } from '../../../components/ui/WarningBanner'

export function ServiceDetailPage() {
  const { id } = useParams()

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Servicio</p>
          <h1>Detalle del servicio</h1>
          <p className="page-description">
            La ficha incluirá tareas, propiedad, cliente, trabajadores, horas y revisión final.
          </p>
        </div>
      </section>

      <WarningBanner title="Sin integración aún" tone="warning">
        La ruta del servicio {id ?? '-'} está lista, pero no hay formularios ni cálculos en
        Sprint 1.
      </WarningBanner>

      <Card title="Espacio reservado">
        Aquí vivirán los estados del servicio, notas internas y coste de mano de obra.
      </Card>
    </div>
  )
}
