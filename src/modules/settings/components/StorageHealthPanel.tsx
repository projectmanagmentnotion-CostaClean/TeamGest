import { Badge } from '../../../components/ui/Badge'
import { EmptyState } from '../../../components/ui/EmptyState'
import { type StorageHealthReport, mapStorageHealthToWarningLevel } from '../../../infrastructure/storage/storageHealth'
import { getWarningLevelTone } from '../../../utils/labels'
import { SettingsSection } from './SettingsSection'

type StorageHealthPanelProps = {
  report: StorageHealthReport
}

export function StorageHealthPanel({ report }: StorageHealthPanelProps) {
  const warningLevel = mapStorageHealthToWarningLevel(report.level)

  return (
    <SettingsSection
      title="Salud del almacenamiento"
      description="Disponibilidad, claves corruptas y señales de riesgo del espacio local."
      action={<Badge tone={getWarningLevelTone(warningLevel)}>{report.level}</Badge>}
    >
      <div className="detail-grid">
        <div>
          <span className="muted-caption">localStorage</span>
          <strong>{report.storageAvailable ? 'Disponible' : 'No disponible'}</strong>
        </div>
        <div>
          <span className="muted-caption">Claves corruptas</span>
          <strong>{report.corruptedKeys.length}</strong>
        </div>
        <div>
          <span className="muted-caption">Claves faltantes</span>
          <strong>{report.missingExpectedKeys.length}</strong>
        </div>
        <div>
          <span className="muted-caption">Esquema detectado</span>
          <strong>{report.schemaVersion ?? 'Sin inicializar'}</strong>
        </div>
      </div>

      {report.warnings.length === 0 ? (
        <EmptyState
          title="Estado saludable"
          description="No se detectaron incidencias activas en el almacenamiento local."
        />
      ) : (
        <div className="stack-list">
          {report.warnings.map((warning) => (
            <div key={warning} className="warning-item">
              <div className="warning-item__header">
                <h4>Acción recomendada</h4>
                <Badge tone={getWarningLevelTone(warningLevel)}>{report.level}</Badge>
              </div>
              <p>{warning}</p>
            </div>
          ))}
        </div>
      )}
    </SettingsSection>
  )
}
