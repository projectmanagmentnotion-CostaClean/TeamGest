import type { BadgeTone } from './Badge'
import { Card } from './Card'

type StatCardProps = {
  label: string
  value: string
  hint: string
  tone?: BadgeTone
}

export function StatCard({ hint, label, tone = 'neutral', value }: StatCardProps) {
  return (
    <Card className={`stat-card stat-card--${tone}`}>
      <p className="stat-card__label">{label}</p>
      <strong className="stat-card__value">{value}</strong>
      <p className="stat-card__hint">{hint}</p>
    </Card>
  )
}
