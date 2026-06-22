import { Badge } from '../../../components/ui/Badge'
import { SettingsSection } from './SettingsSection'

type AuditSettingsPanelProps = {
  entriesCount: number
  showTechnicalIds: boolean
}

export function AuditSettingsPanel({
  entriesCount,
  showTechnicalIds,
}: AuditSettingsPanelProps) {
  return (
    <SettingsSection
      title="Auditoria"
      description="El registro es local, ligero y orientado a cambios operativos y de seguridad."
      action={<Badge tone="info">{entriesCount} eventos</Badge>}
    >
      <div className="detail-grid">
        <div>
          <span className="muted-caption">Persistencia</span>
          <strong>Solo navegador</strong>
        </div>
        <div>
          <span className="muted-caption">Payload sensible</span>
          <strong>No se guardan payloads completos</strong>
        </div>
        <div>
          <span className="muted-caption">Ids tecnicos visibles</span>
          <strong>{showTechnicalIds ? 'Si' : 'No'}</strong>
        </div>
        <div>
          <span className="muted-caption">Integraciones externas</span>
          <strong>No activas</strong>
        </div>
      </div>
      <p className="muted-caption">
        Los eventos de ajustes guardan solo seccion y claves cambiadas. No se almacena una copia
        completa del objeto de configuracion.
      </p>
    </SettingsSection>
  )
}
