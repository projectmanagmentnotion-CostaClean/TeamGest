import type { WorkerInput } from '../../../domain/workers/worker.inputs'
import type { Worker } from '../../../domain/workers/worker.types'

export function createWorkerFormDraft(worker?: Worker): WorkerInput {
  return {
    name: worker?.name ?? '',
    role: worker?.role ?? 'cleaner',
    phone: worker?.phone ?? '',
    email: worker?.email ?? '',
    defaultHourlyRate: worker?.defaultHourlyRate,
    status: worker?.status ?? 'active',
    notes: worker?.notes ?? '',
  }
}
