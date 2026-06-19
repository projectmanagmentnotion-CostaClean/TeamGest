import { Card } from '../../../components/ui/Card'

type OperationalFocusProps = {
  items: Array<{
    label: string
    value: string
    hint: string
  }>
}

export function OperationalFocus({ items }: OperationalFocusProps) {
  return (
    <section className="focus-grid">
      {items.map((item) => (
        <Card key={item.label} className="focus-card">
          <p className="stat-card__label">{item.label}</p>
          <strong className="stat-card__value">{item.value}</strong>
          <p className="stat-card__hint">{item.hint}</p>
        </Card>
      ))}
    </section>
  )
}
