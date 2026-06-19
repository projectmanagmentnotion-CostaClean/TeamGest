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
        <StatCard
          label="Servicios locales"
          value={String(overview.localServicesCount)}
          hint="Creados fuera de las semillas."
        />
        <StatCard
          label="Trabajadores locales"
          value={String(overview.localWorkersCount)}
          hint="Altas creadas en este navegador."
          tone="info"
        />
        <StatCard
          label="Clientes locales"
          value={String(overview.localClientsCount)}
          hint="Cartera agregada en modo local."
          tone="info"
        />
        <StatCard
          label="Inmuebles locales"
          value={String(overview.localPropertiesCount)}
          hint="Parque creado localmente."
          tone="info"
        />
        <StatCard
          label="Meses de nomina"
          value={String(overview.payrollMonthsCount)}
          hint="Estados mensuales persistidos."
          tone="info"
        />
        <StatCard
          label="Auditoria app"
          value={String(overview.auditEntriesCount)}
          hint="Eventos criticos recientes."
          tone="warning"
        />
        <StatCard
          label="Tamano estimado"
          value={formatBytes(overview.estimatedStorageSize)}
          hint="Uso aproximado del namespace TeamGest."
          tone="success"
        />
      </div>

      <div className="detail-grid detail-grid--three">
        <div>
          <span className="muted-caption">Modo de almacenamiento</span>
          <strong>{overview.storageMode}</strong>
        </div>
        <div>
          <span className="muted-caption">Version de esquema</span>
          <strong>{overview.schemaVersion}</strong>
        </div>
        <div>
          <span className="muted-caption">Meses bloqueados</span>
          <strong>{overview.lockedMonthsCount}</strong>
        </div>
        <div>
          <span className="muted-caption">Ultimo backup</span>
          <strong>{formatMetaDate(overview.lastBackupAt)}</strong>
        </div>
        <div>
          <span className="muted-caption">Ultima importacion</span>
          <strong>{formatMetaDate(overview.lastImportAt)}</strong>
        </div>
        <div>
          <span className="muted-caption">Ultimo reset</span>
          <strong>{formatMetaDate(overview.lastResetAt)}</strong>
        </div>
      </div>
    </SettingsSection>
  )
}
