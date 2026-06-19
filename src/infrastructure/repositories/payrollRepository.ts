import type { ServiceJob } from '../../domain/services/service.types'
import type { Worker } from '../../domain/workers/worker.types'
import { calculateMonthlyPayrollSummary } from '../../modules/payroll/services/payrollCalculations'

export function createPayrollRepository(workers: Worker[], services: ServiceJob[]) {
  return {
    getPayrollSummaryByMonth: (month: string) => calculateMonthlyPayrollSummary(workers, services, month),
  }
}
