import type { ReactNode } from 'react'

type PageHeaderProps = {
  eyebrow?: string
  title: string
  description: string
  meta?: ReactNode
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
}

export function PageHeader({
  description,
  eyebrow,
  meta,
  primaryAction,
  secondaryAction,
  title,
}: PageHeaderProps) {
  return (
    <section className="page-header">
      <div className="page-header__content">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {meta ? <div className="page-header__meta">{meta}</div> : null}
      {primaryAction || secondaryAction ? (
        <div className="page-header__actions">
          {secondaryAction}
          {primaryAction}
        </div>
      ) : null}
    </section>
  )
}
