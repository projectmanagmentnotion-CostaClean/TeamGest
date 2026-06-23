import type { HourEntry } from '../../../domain/hours/hourEntry.types'
import type { PayrollMonthState } from '../../../domain/payroll/payroll.types'
import type { AppSettings } from '../../../domain/settings/appSettings.types'
import type { Worker } from '../../../domain/workers/worker.types'
import {
  getAverageRate,
  getConfirmedHours,
  getExcludedHours,
  getIssueCount,
  getPayableTotal,
  getPendingHours,
  getUniqueServiceCount,
  isEntryExcluded,
  isEntryIssue,
  isEntryLocked,
  isEntryPending,
} from './monthlyClosureCalculations'
import {
  buildWorkerClosureWarnings,
  getActionAvailability,
  getSummaryWarnings,
  getWorkerClosureStatusLabel,
} from './monthlyClosureWarnings'
import type {
  MonthlyClosureSummary,
  WorkerClosureCardModel,
  WorkerMonthlyClosureDetail,
} from './monthlyClosure.types'

function getWorkerPayrollStatus(workerId: string, monthState: PayrollMonthState) {
  if (monthState.status === 'locked') {
    return 'locked' as const
  }

  return monthState.workerStatuses[workerId] ?? monthState.status ?? 'pending'
}

function buildWorkerClosureCardModel(
  worker: Worker,
  entries: HourEntry[],
  monthState: PayrollMonthState,
  settings: AppSettings,
): WorkerClosureCardModel {
  const payrollStatus = getWorkerPayrollStatus(worker.id, monthState)
  const confirmedHours = getConfirmedHours(entries, settings)
  const pendingHours = getPendingHours(entries)
  const issueCount = getIssueCount(entries)
  const excludedHours = getExcludedHours(entries)
  const totalPay = getPayableTotal(entries, settings)
  const averageRate = getAverageRate(entries, settings)
  const serviceCount = getUniqueServiceCount(entries)
  const entryCount = entries.length
  const locked = monthState.status === 'locked' || entries.some(isEntryLocked)
  const paid = payrollStatus === 'paid' || payrollStatus === 'locked'
  const reviewed = payrollStatus === 'reviewed' || paid
  const readyToPay = confirmedHours > 0 && pendingHours === 0 && issueCount === 0 && !locked

  const baseModel = {
    workerId: worker.id,
    workerName: worker.name,
    workerRole: worker.role,
    workerStatus: worker.status,
    payrollStatus,
    confirmedHours,
    pendingHours,
    issueCount,
    excludedHours,
    totalPay,
    averageRate,
    serviceCount,
    entryCount,
    reviewed,
    paid,
    locked,
    readyToPay,
  }

  return {
    ...baseModel,
    warnings: buildWorkerClosureWarnings(baseModel, settings),
    statusLabel: getWorkerClosureStatusLabel(baseModel),
    actionAvailability: getActionAvailability(baseModel),
  }
}

export function buildMonthlyClosureCards(params: {
  month: string
  workers: Worker[]
  entries: HourEntry[]
  monthState: PayrollMonthState
  settings: AppSettings
}) {
  const { entries, month, monthState, settings, workers } = params
  const monthEntries = entries.filter((entry) => entry.payrollMonth === month)
  const visibleWorkerIds = new Set(monthEntries.map((entry) => entry.workerId))
  const visibleWorkers = workers.filter(
    (worker) => worker.status === 'active' || visibleWorkerIds.has(worker.id),
  )

  return visibleWorkers
    .map((worker) =>
      buildWorkerClosureCardModel(
        worker,
        monthEntries.filter((entry) => entry.workerId === worker.id),
        monthState,
        settings,
      ),
    )
    .filter((card) => card.entryCount > 0 || card.payrollStatus !== 'pending')
    .sort((left, right) => {
      if (left.locked !== right.locked) {
        return left.locked ? 1 : -1
      }

      if (left.paid !== right.paid) {
        return left.paid ? 1 : -1
      }

      if (left.readyToPay !== right.readyToPay) {
        return left.readyToPay ? -1 : 1
      }

      if (left.issueCount !== right.issueCount) {
        return right.issueCount - left.issueCount
      }

      if (left.pendingHours !== right.pendingHours) {
        return right.pendingHours - left.pendingHours
      }

      return left.workerName.localeCompare(right.workerName, 'es')
    })
}

export function buildMonthlyClosureSummary(
  month: string,
  cards: WorkerClosureCardModel[],
): MonthlyClosureSummary {
  const readyWorkerCount = cards.filter((card) => card.readyToPay && !card.paid && !card.locked).length
  const pendingWorkerCount = cards.filter((card) => card.pendingHours > 0).length
  const issueWorkerCount = cards.filter((card) => card.issueCount > 0).length
  const isLocked = cards.some((card) => card.locked)

  return {
    month,
    workerCount: cards.length,
    readyWorkerCount,
    pendingWorkerCount,
    issueWorkerCount,
    confirmedHours: cards.reduce((sum, card) => sum + card.confirmedHours, 0),
    pendingHours: cards.reduce((sum, card) => sum + card.pendingHours, 0),
    excludedHours: cards.reduce((sum, card) => sum + card.excludedHours, 0),
    totalPay: cards.reduce((sum, card) => sum + card.totalPay, 0),
    isLocked,
    warnings: getSummaryWarnings({
      isLocked,
      issueWorkerCount,
      pendingWorkerCount,
      readyWorkerCount,
    }),
  }
}

export function buildWorkerMonthlyClosureDetail(params: {
  workerId: string
  cards: WorkerClosureCardModel[]
  entries: HourEntry[]
  month: string
  monthState: PayrollMonthState
}) {
  const { cards, entries, month, monthState, workerId } = params
  const card = cards.find((item) => item.workerId === workerId)

  if (!card) {
    return null
  }

  const workerEntries = entries.filter(
    (entry) => entry.payrollMonth === month && entry.workerId === workerId,
  )

  const detail: WorkerMonthlyClosureDetail = {
    card,
    monthState,
    confirmedEntries: workerEntries.filter(
      (entry) => !isEntryPending(entry) && !isEntryIssue(entry) && !isEntryExcluded(entry) && !isEntryLocked(entry),
    ),
    pendingEntries: workerEntries.filter(isEntryPending),
    issueEntries: workerEntries.filter(isEntryIssue),
    excludedEntries: workerEntries.filter(isEntryExcluded),
    lockedEntries: workerEntries.filter(isEntryLocked),
  }

  return detail
}
