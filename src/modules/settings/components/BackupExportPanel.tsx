import { useState } from 'react'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { formatDate } from '../../../utils/dates'
import { exportTeamGestBackup } from '../services/dataExport'
import { SettingsSection } from './SettingsSection'

type BackupExportPanelProps = {
  lastBackupAt?: string
  onDataChanged: () => void
}

export function BackupExportPanel({ lastBackupAt, onDataChanged }: BackupExportPanelProps) {
  const [lastMessage, setLastMessage] = useState<string | null>(null)

  const handleExport = () => {
    const result = exportTeamGestBackup()
    setLastMessage(`Backup exportado con ${result.summary.createdServicesCount} servicios locales.`)
    onDataChanged()
  }

  return (
    <SettingsSection
      title="Backup y exportacion"
      description="Descarga una copia JSON con el estado local conocido por TeamGest."
      action={<Badge tone="info">JSON local</Badge>}
    >
      <p className="muted-caption">
        Ultimo backup: {lastBackupAt ? formatDate(lastBackupAt) : 'Todavia no registrado'}
      </p>
      <div className="quick-actions">
        <Button onClick={handleExport}>Exportar copia JSON</Button>
      </div>
      {lastMessage ? <p className="muted-caption">{lastMessage}</p> : null}
    </SettingsSection>
  )
}
