import { MetricGrid } from '../../../components/ui/MetricGrid'
import { StatCard } from '../../../components/ui/StatCard'

type DashboardStatsProps = {
  stats: Array<{
    label: string
    value: string
    hint: string
    tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'blocked'
  }>
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <MetricGrid>
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          hint={stat.hint}
          label={stat.label}
          tone={stat.tone}
          value={stat.value}
        />
      ))}
    </MetricGrid>
  )
}
