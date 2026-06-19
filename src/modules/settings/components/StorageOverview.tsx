import { StatCard } from '../../../components/ui/StatCard'
import { formatDate } from '../../../utils/dates'
import type { SettingsStorageOverview } from '../services/settingsStorage'
import { SettingsSection } from './SettingsSection'

type StorageOverviewProps = {
  overview: SettingsStorageOverview
}

function formatMetaDate(value?: string) {
  return value ? formatDate(value) : 'Sin registro'
}

function formatBytes(value: number) {
  if (value < 1024) {
    return `${value} B`
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`
  }

  return `${(value / (1024 * 1024)).toFixed(2)} MB`
}

export function StorageOverview({ overview }: StorageOverviewProps) {
  return (
    <SettingsSection
      title="Resumen local"
      description="Panorama del estado persistido en este navegador."
    >
      <div className="stats-grid">
        <StatCard label="Servicios locales" value={String(overview.localServicesCount)} hint="Creados fuera de las semillas." />
        <StatCard label="Meses de nómina" value={String(overview.payrollMonthsCount)} hint="Estados mensuales persistidos." tone="info" />
        <StatCard label="Auditoría app" value={String(overview.auditEntriesCount)} hint="Eventos críticos recientes." tone="warning" />
        <StatCard label="Tamaño estimado" value={formatBytes(overview.estimatedStorageSize)} hint="Uso aproximado del namespace TeamGest." tone="success" />
      </div>

      <div className="detail-grid detail-grid--three">
        <div>
          <span className="muted-caption">Modo de almacenamiento</span>
          <strong>{overview.storageMode}</strong>
        </div>
        <div>
          <span className="muted-caption">Versión de esquema</span>
          <strong>{overview.schemaVersion}</strong>
        </div>
        <div>
          <span className="muted-caption">Meses bloqueados</span>
          <strong>{overview.lockedMonthsCount}</strong>
        </div>
        <div>
          <span className="muted-caption">Último backup</span>
          <strong>{formatMetaDate(overview.lastBackupAt)}</strong>
        </div>
        <div>
          <span className="muted-caption">Última importación</span>
          <strong>{formatMetaDate(overview.lastImportAt)}</strong>
        </div>
        <div>
          <span className="muted-caption">Último reset</span>
          <strong>{formatMetaDate(overview.lastResetAt)}</strong>
        </div>
      </div>
    </SettingsSection>
  )
}
