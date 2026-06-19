import { Card } from '../../../components/ui/Card'

type ActivityItem = {
  id: string
  title: string
  text: string
  date: string
  entityLabel?: string
}

type ActivityFeedProps = {
  items: ActivityItem[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card title="Actividad reciente" description="Lectura rápida de la operación reciente y sus movimientos.">
      <div className="timeline-list">
        {items.map((item) => (
          <article key={item.id} className="timeline-item">
            <div className="timeline-item__dot" />
            <div className="timeline-item__content">
              <div className="row-card__main">
                <h4>{item.title}</h4>
                <span className="muted-caption">{item.date}</span>
              </div>
              <p>{item.text}</p>
              {item.entityLabel ? <span className="muted-caption">{item.entityLabel}</span> : null}
            </div>
          </article>
        ))}
      </div>
    </Card>
  )
}
