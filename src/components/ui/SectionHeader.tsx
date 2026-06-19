import type { ReactNode } from 'react'

type SectionHeaderProps = {
  title: string
  description?: string
  meta?: ReactNode
  action?: ReactNode
}

export function SectionHeader({ action, description, meta, title }: SectionHeaderProps) {
  return (
    <header className="section-header">
      <div className="section-header__content">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {meta ? <div className="section-header__meta">{meta}</div> : null}
      {action ? <div className="section-header__action">{action}</div> : null}
    </header>
  )
}
