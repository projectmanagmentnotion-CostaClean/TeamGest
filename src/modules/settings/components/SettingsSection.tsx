import type { PropsWithChildren, ReactNode } from 'react'
import { Card } from '../../../components/ui/Card'

type SettingsSectionProps = PropsWithChildren<{
  title: string
  description: string
  action?: ReactNode
  className?: string
}>

export function SettingsSection({
  action,
  children,
  className,
  description,
  title,
}: SettingsSectionProps) {
  return (
    <Card action={action} className={className} description={description} title={title}>
      {children}
    </Card>
  )
}
