import type { PropsWithChildren } from 'react'

type WarningTone = 'info' | 'warning' | 'danger' | 'success' | 'blocked'

type WarningBannerProps = PropsWithChildren<{
  title: string
  tone?: WarningTone
}>

export function WarningBanner({
  children,
  title,
  tone = 'info',
}: WarningBannerProps) {
  return (
    <section className={`warning-banner warning-banner--${tone}`}>
      <strong>{title}</strong>
      <p>{children}</p>
    </section>
  )
}
