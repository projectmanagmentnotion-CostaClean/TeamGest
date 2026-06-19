import { startTransition, useState } from 'react'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import { listAuditEntries } from '../../../infrastructure/audit/auditRepository'
import { getStorageTools } from '../../../infrastructure/repositoryFactory'
import { AuditLogPanel } from '../components/AuditLogPanel'
import { BackupExportPanel } from '../components/BackupExportPanel'
import { DataSafetyChecklist } from '../components/DataSafetyChecklist'
import { ImportDataPanel } from '../components/ImportDataPanel'
import { LocalDataWarning } from '../components/LocalDataWarning'
import { ResetDemoDataPanel } from '../components/ResetDemoDataPanel'
import { StorageHealthPanel } from '../components/StorageHealthPanel'
import { StorageOverview } from '../components/StorageOverview'
import { getDataSafetyChecklist, getLocalDataRiskLevel } from '../services/dataSafety'
import { getStorageOverview } from '../services/settingsStorage'

export function SettingsPage() {
  const [, setRefreshKey] = useState(0)
  const storageTools = getStorageTools()
  const overview = getStorageOverview()
  const healthReport = storageTools.getStorageHealthReport()
  const auditEntries = listAuditEntries()
  const safetyChecklist = getDataSafetyChecklist()
  const riskLevel = getLocalDataRiskLevel()

  const refreshPage = () => {
    startTransition(() => {
      setRefreshKey((value) => value + 1)
    })
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Ajustes</p>
          <h1>Control local del sistema</h1>
          <p className="page-description">
            Centro de control para revisar el estado local, exportar copias, recuperar datos
            compatibles y proteger el prototipo local-first.
          </p>
        </div>
      </section>

      <LocalDataWarning />

      <StorageOverview overview={overview} />

      <section className="dashboard-grid">
        <StorageHealthPanel report={healthReport} />
        <DataSafetyChecklist items={safetyChecklist} riskLevel={riskLevel} />
      </section>

      <section className="dashboard-grid">
        <BackupExportPanel lastBackupAt={overview.lastBackupAt} onDataChanged={refreshPage} />
        <ImportDataPanel onDataChanged={refreshPage} />
      </section>

      <AuditLogPanel entries={auditEntries} />

      <ResetDemoDataPanel onDataChanged={refreshPage} />

      <WarningBanner title="Notas de seguridad" tone="info">
        Los backups exportados son copias JSON locales del navegador. Sirven para continuidad
        operativa del prototipo, pero no sustituyen backend, seguridad empresarial ni respaldo en
        la nube.
      </WarningBanner>
    </div>
  )
}
