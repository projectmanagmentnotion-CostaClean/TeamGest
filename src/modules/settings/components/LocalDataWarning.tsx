import { WarningBanner } from '../../../components/ui/WarningBanner'

export function LocalDataWarning() {
  return (
    <WarningBanner title="Datos locales del navegador" tone="warning">
      Este entorno guarda cambios solo en este navegador. Conviene exportar una copia local si vas a seguir operando o hacer cambios importantes.
    </WarningBanner>
  )
}
