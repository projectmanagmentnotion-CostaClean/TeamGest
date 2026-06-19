import type { PropsWithChildren } from 'react'

type DetailGridProps = PropsWithChildren<{
  columns?: 2 | 3 | 4
}>

export function DetailGrid({ children, columns = 2 }: DetailGridProps) {
  const className =
    columns === 2 ? 'detail-grid' : columns === 3 ? 'detail-grid detail-grid--three' : 'detail-grid detail-grid--four'

  return <div className={className}>{children}</div>
}
