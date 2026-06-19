import type { PropsWithChildren, ReactNode } from 'react'
import { Card } from './Card'

type ConfirmDangerBoxProps = PropsWithChildren<{
  title: string
  description: string
  action?: ReactNode
}>

export function ConfirmDangerBox({
  action,
  children,
  description,
  title,
}: ConfirmDangerBoxProps) {
  return (
    <Card
      className="danger-zone danger-box"
      title={title}
      description={description}
      action={action}
    >
      {children}
    </Card>
  )
}
