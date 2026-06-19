import type { ReactNode } from 'react'
import { Button } from './Button'
import { Card } from './Card'

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  action?: ReactNode
  icon?: string
}

export function EmptyState({ action, actionLabel, description, icon = '+', title }: EmptyStateProps) {
  return (
    <Card className="empty-state">
      <div className="empty-state__content">
        <span className="empty-state__icon">{icon}</span>
        <div className="empty-state__copy">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="empty-state__actions">
          {action ?? null}
          {!action && actionLabel ? (
            <Button variant="secondary" size="sm">
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
