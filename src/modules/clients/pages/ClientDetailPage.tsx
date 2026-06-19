import { useParams } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'

export function ClientDetailPage() {
  const { id } = useParams()

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Cliente</p>
          <h1>Detalle de cliente</h1>
          <p className="page-description">
            Se reservará este espacio para datos de contacto, inmuebles asociados y acuerdos
            operativos.
          </p>
        </div>
      </section>

      <Card title="Ruta preparada" description={`Cliente objetivo: ${id ?? '-'}.`}>
        La lógica real llegará después, manteniendo la UI separada de cualquier repositorio o
        backend.
      </Card>
    </div>
  )
}
