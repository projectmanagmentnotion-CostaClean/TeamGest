import { Badge } from '../../../components/ui/Badge'
import type { PayrollStatus } from '../../../domain/shared/status.types'
import { formatPayrollStatusLabel, getPayrollStatusTone } from '../../../utils/labels'

type PayrollStatusBadgeProps = {
  status: PayrollStatus
}

export function PayrollStatusBadge({ status }: PayrollStatusBadgeProps) {
  return <Badge tone={getPayrollStatusTone(status)}>{formatPayrollStatusLabel(status)}</Badge>
}
