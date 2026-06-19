import { Card } from '../../../components/ui/Card'
import { WarningBanner } from '../../../components/ui/WarningBanner'

export function SettingsPage() {
  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Ajustes</p>
          <h1>Configuración del sistema</h1>
          <p className="page-description">
            La configuración futura centralizará preferencias, catálogos y reglas operativas del
            negocio.
          </p>
        </div>
      </section>

      <WarningBanner title="Sin ajustes persistentes" tone="info">
        No se han añadido autenticación, integraciones externas ni almacenamiento real.
      </WarningBanner>

      <Card title="Reservado para siguientes sprints">
        Catálogos de servicios, parámetros de cierres y políticas internas del sistema.
      </Card>
    </div>
  )
}
