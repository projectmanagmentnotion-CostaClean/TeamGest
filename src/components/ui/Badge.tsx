import type { HTMLAttributes, PropsWithChildren } from 'react'

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'blocked'

type BadgeProps = PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    tone?: BadgeTone
  }
>

export function Badge({ children, className = '', tone = 'neutral', ...props }: BadgeProps) {
  const classes = ['badge', `badge--${tone}`, className].filter(Boolean).join(' ')

  return (
    <span {...props} className={classes}>
      {children}
    </span>
  )
}
