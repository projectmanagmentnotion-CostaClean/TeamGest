type InlineMetaItem = {
  label: string
  value: string
}

type InlineMetaProps = {
  items: InlineMetaItem[]
}

export function InlineMeta({ items }: InlineMetaProps) {
  return (
    <div className="inline-meta">
      {items.map((item) => (
        <span key={`${item.label}-${item.value}`} className="inline-meta__item">
          <span className="inline-meta__label">{item.label}</span>
          <strong>{item.value}</strong>
        </span>
      ))}
    </div>
  )
}
