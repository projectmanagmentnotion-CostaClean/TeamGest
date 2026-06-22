import type { AppSettings } from '../../domain/settings/appSettings.types'
import type { Client } from '../../domain/clients/client.types'
import type { PayrollMonthState } from '../../domain/payroll/payroll.types'
import type { Property } from '../../domain/properties/property.types'
import type { ServiceJob } from '../../domain/services/service.types'
import type { Worker } from '../../domain/workers/worker.types'
import { getStorageSizeEstimate, readJson, writeJson, clearNamespace, removeItem } from './localStorageAdapter'
import { getStorageMetadata } from './storageMetadata'
import {
  APP_AUDIT_KEY,
  BACKUP_HISTORY_KEY,
  CLIENTS_ARCHIVED_KEY,
  CLIENTS_CREATED_KEY,
  CLIENTS_OVERRIDES_KEY,
  LEGACY_SERVICES_CREATED_KEY,
  PAYROLL_AUDIT_KEY,
  PAYROLL_MONTHS_KEY,
  PROPERTIES_ARCHIVED_KEY,
  PROPERTIES_CREATED_KEY,
  PROPERTIES_OVERRIDES_KEY,
  SERVICES_ARCHIVED_KEY,
  SERVICES_CREATED_KEY,
  SERVICES_OVERRIDES_KEY,
  SETTINGS_KEY,
  STORAGE_METADATA_KEY,
  TEAMGEST_STORAGE_PREFIX,
  WORKERS_ARCHIVED_KEY,
  WORKERS_CREATED_KEY,
  WORKERS_OVERRIDES_KEY,
} from './storageKeys'

export type LocalSettingsState = {
  importMode?: 'text' | 'file'
  activeSection?:
    | 'company'
    | 'hours'
    | 'quick-entry'
    | 'review'
    | 'services'
    | 'display'
    | 'data-safety'
    | 'audit'
    | 'system'
  lastQuickEntryWorkerId?: string
  lastQuickEntryPropertyId?: string
}

export type StoredSettingsPayload = {
  appSettings?: AppSettings | Record<string, unknown>
  localState?: LocalSettingsState
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeLocalSettingsState(value: unknown): LocalSettingsState {
  if (!isRecord(value)) {
    return {}
  }

  return {
    importMode: value.importMode === 'file' ? 'file' : value.importMode === 'text' ? 'text' : undefined,
    activeSection: typeof value.activeSection === 'string' ? (value.activeSection as LocalSettingsState['activeSection']) : undefined,
    lastQuickEntryWorkerId:
      typeof value.lastQuickEntryWorkerId === 'string' ? value.lastQuickEntryWorkerId : undefined,
    lastQuickEntryPropertyId:
      typeof value.lastQuickEntryPropertyId === 'string' ? value.lastQuickEntryPropertyId : undefined,
  }
}

export function normalizeStoredSettingsPayload(value: unknown): StoredSettingsPayload {
  if (!isRecord(value)) {
    return {}
  }

  if ('appSettings' in value || 'localState' in value) {
    return {
      appSettings: isRecord(value.appSettings) ? value.appSettings : undefined,
      localState: normalizeLocalSettingsState(value.localState),
    }
  }

  return {
    localState: normalizeLocalSettingsState(value),
  }
}

export function getStorageOverviewSnapshot() {
  const metadata = getStorageMetadata()
  const localServices = readJson<ServiceJob[]>(SERVICES_CREATED_KEY, [])
  const localWorkers = readJson<Worker[]>(WORKERS_CREATED_KEY, [])
  const localClients = readJson<Client[]>(CLIENTS_CREATED_KEY, [])
  const localProperties = readJson<Property[]>(PROPERTIES_CREATED_KEY, [])
  const payrollMonths = readJson<Record<string, PayrollMonthState>>(PAYROLL_MONTHS_KEY, {})
  const payrollAudit = readJson<Record<string, unknown[]>>(PAYROLL_AUDIT_KEY, {})
  const payrollAuditEntriesCount = Object.values(payrollAudit).reduce(
    (total, entries) => total + entries.length,
    0,
  )

  return {
    metadata,
    localServicesCount: localServices.length,
    localWorkersCount: localWorkers.length,
    localClientsCount: localClients.length,
    localPropertiesCount: localProperties.length,
    payrollMonths,
    payrollAuditEntriesCount,
    estimatedStorageSize: getStorageSizeEstimate(TEAMGEST_STORAGE_PREFIX),
  }
}

export function readLocalSettingsState() {
  return normalizeStoredSettingsPayload(readJson<StoredSettingsPayload | Record<string, unknown>>(SETTINGS_KEY, {})).localState ?? {}
}

export function writeLocalSettingsState(nextState: LocalSettingsState) {
  const current = normalizeStoredSettingsPayload(readJson<StoredSettingsPayload | Record<string, unknown>>(SETTINGS_KEY, {}))
  writeJson(SETTINGS_KEY, {
    ...current,
    localState: nextState,
  })
  return nextState
}

export function readStoredAppSettingsValue() {
  return normalizeStoredSettingsPayload(
    readJson<StoredSettingsPayload | Record<string, unknown>>(SETTINGS_KEY, {}),
  ).appSettings
}

export function writeStoredAppSettingsValue(nextSettings: AppSettings | Record<string, unknown>) {
  const current = normalizeStoredSettingsPayload(
    readJson<StoredSettingsPayload | Record<string, unknown>>(SETTINGS_KEY, {}),
  )
  writeJson(SETTINGS_KEY, {
    ...current,
    appSettings: nextSettings,
  })

  return nextSettings
}

export function clearServiceLocalState() {
  removeItem(SERVICES_CREATED_KEY)
  removeItem(SERVICES_OVERRIDES_KEY)
  removeItem(SERVICES_ARCHIVED_KEY)
  removeItem(LEGACY_SERVICES_CREATED_KEY)
}

export function clearEntityManagementLocalState() {
  removeItem(WORKERS_CREATED_KEY)
  removeItem(WORKERS_OVERRIDES_KEY)
  removeItem(WORKERS_ARCHIVED_KEY)
  removeItem(CLIENTS_CREATED_KEY)
  removeItem(CLIENTS_OVERRIDES_KEY)
  removeItem(CLIENTS_ARCHIVED_KEY)
  removeItem(PROPERTIES_CREATED_KEY)
  removeItem(PROPERTIES_OVERRIDES_KEY)
  removeItem(PROPERTIES_ARCHIVED_KEY)
}

export function clearPayrollLocalState() {
  removeItem(PAYROLL_MONTHS_KEY)
  removeItem(PAYROLL_AUDIT_KEY)
}

export function clearAllTeamGestLocalData() {
  clearNamespace(TEAMGEST_STORAGE_PREFIX)
  removeItem(LEGACY_SERVICES_CREATED_KEY)
  removeItem(STORAGE_METADATA_KEY)
  removeItem(APP_AUDIT_KEY)
  removeItem(BACKUP_HISTORY_KEY)
  removeItem(SETTINGS_KEY)
}
