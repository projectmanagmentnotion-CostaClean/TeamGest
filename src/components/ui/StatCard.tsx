import { Card } from './Card'

type StatCardProps = {
  label: string
  value: string
  hint: string
}

export function StatCard({ hint, label, value }: StatCardProps) {
  return (
    <Card className="stat-card">
      <p className="stat-card__label">{label}</p>
      <strong className="stat-card__value">{value}</strong>
      <p className="stat-card__hint">{hint}</p>
    </Card>
  )
}
