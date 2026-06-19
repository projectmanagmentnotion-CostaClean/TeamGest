import type { PropsWithChildren, ReactNode } from 'react'
import { Card } from '../../../components/ui/Card'
import { SectionHeader } from '../../../components/ui/SectionHeader'

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
    <Card className={className}>
      <SectionHeader action={action} description={description} title={title} />
      {children}
    </Card>
  )
}
