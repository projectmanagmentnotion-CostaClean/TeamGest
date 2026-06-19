import type { PropsWithChildren, ReactNode } from 'react'

type ActionBarProps = PropsWithChildren<{
  aside?: ReactNode
}>

export function ActionBar({ aside, children }: ActionBarProps) {
  return (
    <section className="action-bar">
      <div className="action-bar__group">{children}</div>
      {aside ? <div className="action-bar__aside">{aside}</div> : null}
    </section>
  )
}
