import type { ReactNode } from 'react'
import { Badge, type BadgeTone } from './Badge'

type StatusPillProps = {
  children: ReactNode
  tone?: BadgeTone
}

export function StatusPill({ children, tone = 'neutral' }: StatusPillProps) {
  return (
    <Badge className="status-pill" tone={tone}>
      {children}
    </Badge>
  )
}
