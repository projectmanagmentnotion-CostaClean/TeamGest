import { useParams } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'

export function PropertyDetailPage() {
  const { id } = useParams()

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Inmueble</p>
          <h1>Detalle de propiedad</h1>
          <p className="page-description">
            Aquí convivirán la ficha del inmueble, sus servicios asociados y el contexto del
            cliente.
          </p>
        </div>
      </section>

      <Card title="Placeholder activo" description={`Ruta preparada para el inmueble ${id ?? '-'}.`}>
        El siguiente sprint podrá añadir historial de servicios, atributos del espacio y notas
        operativas.
      </Card>
    </div>
  )
}
