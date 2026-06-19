import type { ReactNode } from 'react'
import { Card } from './Card'
import { InlineMeta } from './InlineMeta'

type EntityCardProps = {
  title: string
  subtitle?: string
  badges?: ReactNode
  meta?: Array<{ label: string; value: string }>
  footer?: ReactNode
  warningCount?: number
}

export function EntityCard({
  badges,
  footer,
  meta,
  subtitle,
  title,
  warningCount,
}: EntityCardProps) {
  return (
    <Card className="entity-card" title={title} description={subtitle} action={badges}>
      {meta?.length ? <InlineMeta items={meta} /> : null}
      {footer ? (
        <div className="entity-card__footer">
          <span className={warningCount && warningCount > 0 ? 'warning-text' : 'muted-caption'}>
            {warningCount ?? 0} incidencias
          </span>
          {footer}
        </div>
      ) : null}
    </Card>
  )
}
