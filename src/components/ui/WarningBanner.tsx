import type { PropsWithChildren } from 'react'
import type { ReactNode } from 'react'

type WarningTone = 'info' | 'warning' | 'danger' | 'success' | 'blocked'

type WarningBannerProps = PropsWithChildren<{
  title: string
  tone?: WarningTone
  action?: ReactNode
  compact?: boolean
}>

export function WarningBanner({
  action,
  children,
  compact = false,
  title,
  tone = 'info',
}: WarningBannerProps) {
  return (
    <section className={`warning-banner warning-banner--${tone}${compact ? ' warning-banner--compact' : ''}`}>
      <div className="warning-banner__header">
        <strong>{title}</strong>
        {action ? <div>{action}</div> : null}
      </div>
      <p>{children}</p>
    </section>
  )
}
