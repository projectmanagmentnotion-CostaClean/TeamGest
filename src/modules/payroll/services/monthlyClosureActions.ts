import type { PayrollAuditEntry } from '../../../domain/payroll/payroll.types'
import { getPayrollMonthLabel } from './payrollCalculations'
import { createPayrollAuditEntry } from './payrollStorage'

type PayrollRepositoryLike = {
  updatePayrollWorkerStatus: (
    month: string,
    workerId: string,
    status: 'pending' | 'reviewed' | 'paid' | 'locked',
  ) => unknown
  addPayrollAuditEntry: (month: string, entry: PayrollAuditEntry) => unknown
}

function addWorkerAudit(
  repository: PayrollRepositoryLike,
  month: string,
  action: string,
  message: string,
  metadata: Record<string, string>,
) {
  repository.addPayrollAuditEntry(
    month,
    createPayrollAuditEntry(month, action, message, metadata),
  )
}

export function markWorkerClosureReviewed(
  repository: PayrollRepositoryLike,
  month: string,
  workerId: string,
  workerName: string,
) {
  repository.updatePayrollWorkerStatus(month, workerId, 'reviewed')
  addWorkerAudit(
    repository,
    month,
    'Trabajador revisado',
    `${workerName} quedo marcado como revisado en ${getPayrollMonthLabel(month)}.`,
    {
      workerId,
      workerName,
      status: 'reviewed',
    },
  )
}

export function markWorkerClosurePaid(
  repository: PayrollRepositoryLike,
  month: string,
  workerId: string,
  workerName: string,
) {
  repository.updatePayrollWorkerStatus(month, workerId, 'paid')
  addWorkerAudit(
    repository,
    month,
    'Trabajador pagado',
    `${workerName} quedo marcado como pagado internamente en ${getPayrollMonthLabel(month)}.`,
    {
      workerId,
      workerName,
      status: 'paid',
    },
  )
}

export function revertWorkerClosurePaid(
  repository: PayrollRepositoryLike,
  month: string,
  workerId: string,
  workerName: string,
) {
  repository.updatePayrollWorkerStatus(month, workerId, 'reviewed')
  addWorkerAudit(
    repository,
    month,
    'Pago revertido',
    `Se revirtio el estado pagado de ${workerName} en ${getPayrollMonthLabel(month)}.`,
    {
      workerId,
      workerName,
      status: 'reviewed',
    },
  )
}
