import type { PropsWithChildren } from 'react'

type FormFlowStepProps = PropsWithChildren<{
  title: string
  description?: string
}>

export function FormFlowStep({ children, description, title }: FormFlowStepProps) {
  return (
    <section className="stack-list">
      <div className="section-header__content">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  )
}
