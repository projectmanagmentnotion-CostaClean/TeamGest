import { EmptyState } from '../../../components/ui/EmptyState'
import type { WorkerClosureCardModel } from '../services/monthlyClosure.types'
import { WorkerClosureCard } from './WorkerClosureCard'

type WorkerClosureCardGridProps = {
  title: string
  description: string
  emptyTitle: string
  emptyDescription: string
  cards: WorkerClosureCardModel[]
  month: string
  onMarkReviewed: (workerId: string) => void
  onMarkPaid: (workerId: string) => void
  onRevertPaid: (workerId: string) => void
}

export function WorkerClosureCardGrid({
  cards,
  description,
  emptyDescription,
  emptyTitle,
  month,
  onMarkPaid,
  onMarkReviewed,
  onRevertPaid,
  title,
}: WorkerClosureCardGridProps) {
  return (
    <section className="page-stack">
      <div className="section-header__content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      {cards.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} icon="C" />
      ) : (
        <div className="worker-closure-grid">
          {cards.map((card) => (
            <WorkerClosureCard
              key={card.workerId}
              model={card}
              month={month}
              onMarkReviewed={onMarkReviewed}
              onMarkPaid={onMarkPaid}
              onRevertPaid={onRevertPaid}
            />
          ))}
        </div>
      )}
    </section>
  )
}
