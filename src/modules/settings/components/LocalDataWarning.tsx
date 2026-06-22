import { WarningBanner } from '../../../components/ui/WarningBanner'

export function LocalDataWarning() {
  return (
    <WarningBanner title="Datos locales del navegador" tone="warning">
      Este entorno guarda cambios solo en el navegador actual. No hay autenticacion, nube ni copia
      empresarial automatica.
    </WarningBanner>
  )
}
