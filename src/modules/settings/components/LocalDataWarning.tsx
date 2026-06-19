import { WarningBanner } from '../../../components/ui/WarningBanner'

export function LocalDataWarning() {
  return (
    <WarningBanner title="Datos locales, no backend" tone="warning">
      Este entorno guarda cambios solo en el navegador actual. No hay autenticación, nube ni copia
      empresarial automática.
    </WarningBanner>
  )
}
