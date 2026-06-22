import type { ReactNode } from 'react'

type StepFlowFooterProps = {
  children: ReactNode
}

export function StepFlowFooter({ children }: StepFlowFooterProps) {
  return <div className="stepflow-screen__footer">{children}</div>
}
