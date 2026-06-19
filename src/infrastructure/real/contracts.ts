import type { Client } from '../../domain/clients/client.types'
import type { PayrollAuditEntry, PayrollLockedSnapshot, PayrollMonthState } from '../../domain/payroll/payroll.types'
import type { ServiceJob } from '../../domain/services/service.types'
import type { EntityId, ListResult, MutationResult, RepositoryHealth } from '../../domain/shared/repository.types'
import type { PayrollStatus } from '../../domain/shared/status.types'
import type { Worker } from '../../domain/workers/worker.types'
import type { Property } from '../../domain/properties/property.types'
import type { AppAuditEntry } from '../audit/audit.types'

export type RealWorkerRepository = {
  health: () => Promise<RepositoryHealth>
  listWorkers: () => Promise<ListResult<Worker>>
  getWorkerById: (id: EntityId) => Promise<Worker | null>
}

export type RealClientRepository = {
  health: () => Promise<RepositoryHealth>
  listClients: () => Promise<ListResult<Client>>
  getClientById: (id: EntityId) => Promise<Client | null>
}

export type RealPropertyRepository = {
  health: () => Promise<RepositoryHealth>
  listProperties: () => Promise<ListResult<Property>>
  getPropertyById: (id: EntityId) => Promise<Property | null>
}

export type RealServiceRepository = {
  health: () => Promise<RepositoryHealth>
  listServices: () => Promise<ListResult<ServiceJob>>
  getServiceById: (id: EntityId) => Promise<ServiceJob | null>
  createService: (service: ServiceJob) => Promise<MutationResult<ServiceJob>>
}

export type RealPayrollRepository = {
  health: () => Promise<RepositoryHealth>
  getPayrollMonthState: (month: string) => Promise<PayrollMonthState | null>
  updatePayrollWorkerStatus: (
    month: string,
    workerId: EntityId,
    status: PayrollStatus,
  ) => Promise<MutationResult<PayrollMonthState>>
  updatePayrollMonthStatus: (
    month: string,
    status: PayrollStatus,
  ) => Promise<MutationResult<PayrollMonthState>>
  lockPayrollMonth: (
    month: string,
    snapshot: PayrollLockedSnapshot,
  ) => Promise<MutationResult<PayrollMonthState>>
  getPayrollAuditTrail: (month: string) => Promise<ListResult<PayrollAuditEntry>>
  addPayrollAuditEntry: (
    month: string,
    entry: PayrollAuditEntry,
  ) => Promise<MutationResult<PayrollAuditEntry>>
}

export type RealAuditRepository = {
  health: () => Promise<RepositoryHealth>
  listAuditEntries: () => Promise<ListResult<AppAuditEntry>>
  addAuditEntry: (entry: AppAuditEntry) => Promise<MutationResult<AppAuditEntry>>
}
