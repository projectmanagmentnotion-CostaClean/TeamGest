import type { PropsWithChildren, ReactNode } from 'react'
import { Card } from '../ui/Card'

type FormFlowProps = PropsWithChildren<{
  title: string
  description: string
  sidebar?: ReactNode
}>

export function FormFlow({ children, description, sidebar, title }: FormFlowProps) {
  return (
    <div className="dashboard-grid">
      <Card title={title} description={description}>
        {children}
      </Card>
      {sidebar ? sidebar : null}
    </div>
  )
}
