import type { ReactNode } from 'react'
import { EmptyState } from '../../../components/ui/EmptyState'

type HoursEmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
}

export function HoursEmptyState({ action, description, title }: HoursEmptyStateProps) {
  return <EmptyState title={title} description={description} icon="H" action={action} />
}
