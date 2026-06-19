import { useParams } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { WarningBanner } from '../../../components/ui/WarningBanner'

export function WorkerDetailPage() {
  const { id } = useParams()

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Trabajador</p>
          <h1>Ficha del trabajador</h1>
          <p className="page-description">
            Este detalle mostrará perfil, servicios asignados, horas y liquidación del periodo.
          </p>
        </div>
      </section>

      <WarningBanner title="Vista placeholder" tone="warning">
        El identificador actual es {id ?? 'sin definir'} y la lógica del detalle llegará en
        un sprint posterior.
      </WarningBanner>

      <Card title="Qué se construirá aquí">
        Panel de datos personales, historial de servicios, tarifa base y alertas operativas.
      </Card>
    </div>
  )
}
