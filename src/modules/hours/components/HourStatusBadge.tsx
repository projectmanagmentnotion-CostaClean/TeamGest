import type { HourEntryStatus } from '../../../domain/hours/hourEntry.types'
import { StatusPill } from '../../../components/ui/StatusPill'
import { getHourStatusLabel, getHourStatusTone } from '../services/hourStatus'

type HourStatusBadgeProps = {
  status: HourEntryStatus
}

export function HourStatusBadge({ status }: HourStatusBadgeProps) {
  return <StatusPill tone={getHourStatusTone(status)}>{getHourStatusLabel(status)}</StatusPill>
}
