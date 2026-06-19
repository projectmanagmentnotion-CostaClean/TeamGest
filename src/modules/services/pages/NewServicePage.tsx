import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Stepper } from '../../../components/ui/Stepper'

export function NewServicePage() {
  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Servicios</p>
          <h1>Nuevo servicio</h1>
          <p className="page-description">
            Placeholder de alta futura con un flujo guiado, ligero y apto para móvil.
          </p>
        </div>
      </section>

      <Card
        title="StepFlow futuro"
        description="Esta vista demuestra la composición de componentes sin activar guardado ni reglas reales."
      >
        <Stepper currentStep={0} steps={['Datos base', 'Asignaciones', 'Revisión']} />
        <div className="form-grid">
          <Input label="Título del servicio" placeholder="Pendiente de implementación" />
          <Select
            label="Tipo de servicio"
            defaultValue="basic"
            options={[
              { label: 'Limpieza básica', value: 'basic' },
              { label: 'Limpieza profunda', value: 'deep' },
            ]}
          />
        </div>
      </Card>
    </div>
  )
}
