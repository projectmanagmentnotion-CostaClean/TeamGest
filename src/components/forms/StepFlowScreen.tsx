import type { PropsWithChildren, ReactNode } from 'react'
import { Card } from '../ui/Card'

type StepFlowScreenProps = PropsWithChildren<{
  title: string
  description: string
  sidebar?: ReactNode
}>

export function StepFlowScreen({ children, description, sidebar, title }: StepFlowScreenProps) {
  return (
    <div className="stepflow-layout">
      <Card className="stepflow-screen" title={title} description={description}>
        {children}
      </Card>
      {sidebar ? <div className="stepflow-layout__sidebar">{sidebar}</div> : null}
    </div>
  )
}
