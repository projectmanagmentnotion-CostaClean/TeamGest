import { Card } from '../ui/Card'

type FormSummaryProps = {
  title: string
  items: Array<{ label: string; value: string }>
}

export function FormSummary({ items, title }: FormSummaryProps) {
  return (
    <Card title={title} description="Resumen del borrador local antes de confirmar cambios.">
      <div className="detail-grid">
        {items.map((item) => (
          <div key={item.label}>
            <span className="muted-caption">{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </Card>
  )
}
