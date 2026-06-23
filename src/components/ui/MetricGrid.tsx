import type { PropsWithChildren } from 'react'

type MetricGridProps = PropsWithChildren<{
  columns?: 2 | 3 | 4 | 5 | 6
}>

export function MetricGrid({ children, columns = 4 }: MetricGridProps) {
  return <section className={`metric-grid metric-grid--${columns}`}>{children}</section>
}
