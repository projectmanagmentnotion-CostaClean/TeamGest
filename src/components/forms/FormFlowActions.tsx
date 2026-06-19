import type { ReactNode } from 'react'
import { ActionBar } from '../ui/ActionBar'

type FormFlowActionsProps = {
  primaryAction: ReactNode
  secondaryAction?: ReactNode
  tertiaryAction?: ReactNode
  aside?: ReactNode
}

export function FormFlowActions({
  aside,
  primaryAction,
  secondaryAction,
  tertiaryAction,
}: FormFlowActionsProps) {
  return (
    <ActionBar aside={aside}>
      {tertiaryAction}
      {secondaryAction}
      {primaryAction}
    </ActionBar>
  )
}
