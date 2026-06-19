import { Button } from './Button'
import { Card } from './Card'

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
}

export function EmptyState({ actionLabel, description, title }: EmptyStateProps) {
  return (
    <Card className="empty-state">
      <div className="empty-state__content">
        <span className="empty-state__icon">+</span>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        {actionLabel ? (
          <Button variant="secondary" size="sm">
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  )
}
