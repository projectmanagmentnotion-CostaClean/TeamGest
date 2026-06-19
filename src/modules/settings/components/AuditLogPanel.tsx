import { Badge } from '../../../components/ui/Badge'
import { EmptyState } from '../../../components/ui/EmptyState'
import { getAuditActionLabel } from '../../../infrastructure/audit/auditEvents'
import type { AppAuditEntry } from '../../../infrastructure/audit/audit.types'
import { formatDate } from '../../../utils/dates'
import { SettingsSection } from './SettingsSection'

type AuditLogPanelProps = {
  entries: AppAuditEntry[]
}

export function AuditLogPanel({ entries }: AuditLogPanelProps) {
  return (
    <SettingsSection
      title="Auditoría local"
      description="Registro ligero de eventos críticos generados dentro del navegador."
      action={<Badge tone="neutral">{entries.length} eventos</Badge>}
    >
      {entries.length === 0 ? (
        <EmptyState
          title="Sin eventos recientes"
          description="La auditoría local aparecerá aquí cuando se creen servicios, backups o cambios de cierres."
        />
      ) : (
        <div className="timeline-list">
          {entries.slice(0, 12).map((entry) => (
            <article key={entry.id} className="timeline-item">
              <span className="timeline-item__dot" />
              <div className="timeline-item__content">
                <div className="row-card__main">
                  <div>
                    <h4>{getAuditActionLabel(entry.action)}</h4>
                    <p>{entry.message}</p>
                  </div>
                  <Badge tone="info">{formatDate(entry.createdAt)}</Badge>
                </div>
                {entry.entityType || entry.entityId ? (
                  <p className="muted-caption">
                    {entry.entityType ?? 'Entidad'} {entry.entityId ? `· ${entry.entityId}` : ''}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </SettingsSection>
  )
}
