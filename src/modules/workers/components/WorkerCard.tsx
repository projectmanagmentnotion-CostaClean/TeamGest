import { Link } from 'react-router-dom'
import { EntityCard } from '../../../components/ui/EntityCard'
import { StatusPill } from '../../../components/ui/StatusPill'
import type { Worker } from '../../../domain/workers/worker.types'
import {
  formatEntityStatusLabel,
  formatWorkerRoleLabel,
  getEntityStatusTone,
} from '../../../utils/labels'
import { formatMoney } from '../../../utils/money'

type WorkerCardProps = {
  worker: Worker
  monthlyHours: number
  monthlyPay: number
  monthlyServices: number
  warningCount: number
}

export function WorkerCard({
  monthlyHours,
  monthlyPay,
  monthlyServices,
  warningCount,
  worker,
}: WorkerCardProps) {
  return (
    <EntityCard
      badges={
        <StatusPill tone={getEntityStatusTone(worker.status)}>
          {formatEntityStatusLabel(worker.status)}
        </StatusPill>
      }
      footer={
        <Link className="section-link" to={`/workers/${worker.id}`}>
          Ver detalle
        </Link>
      }
      meta={[
        {
          label: 'Tarifa',
          value: worker.defaultHourlyRate ? formatMoney(worker.defaultHourlyRate) : 'Pendiente',
        },
        {
          label: 'Horas mes',
          value: `${monthlyHours.toFixed(1)} h`,
        },
        {
          label: 'Pago estimado',
          value: formatMoney(monthlyPay),
        },
        {
          label: 'Servicios mes',
          value: String(monthlyServices),
        },
      ]}
      subtitle={formatWorkerRoleLabel(worker.role)}
      title={worker.name}
      warningCount={warningCount}
    />
  )
}
