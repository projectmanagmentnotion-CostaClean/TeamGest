import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react'

type CardProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    title?: string
    description?: string
    action?: ReactNode
  }
>

export function Card({
  action,
  children,
  className = '',
  description,
  title,
  ...props
}: CardProps) {
  const classes = ['card', className].filter(Boolean).join(' ')

  return (
    <section {...props} className={classes}>
      {(title || description || action) && (
        <header className="card__header">
          <div>
            {title ? <h3>{title}</h3> : null}
            {description ? <p>{description}</p> : null}
          </div>
          {action ? <div>{action}</div> : null}
        </header>
      )}
      <div className="card__body">{children}</div>
    </section>
  )
}
