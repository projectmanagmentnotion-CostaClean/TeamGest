import { createEntityId } from '../../utils/ids'
import { readJson, writeJson } from '../storage/localStorageAdapter'
import { APP_AUDIT_KEY } from '../storage/storageKeys'
import type { AppAuditEntry } from './audit.types'

export function listAuditEntries() {
  return readJson<AppAuditEntry[]>(APP_AUDIT_KEY, [])
}

export function writeAuditEntries(entries: AppAuditEntry[]) {
  writeJson(APP_AUDIT_KEY, entries)
  return entries
}

export function createAuditEntry(entry: Omit<AppAuditEntry, 'id' | 'createdAt'>): AppAuditEntry {
  return {
    id: createEntityId('audit'),
    createdAt: new Date().toISOString(),
    ...entry,
  }
}

export function recordAuditEvent(entry: Omit<AppAuditEntry, 'id' | 'createdAt'>) {
  const nextEntry = createAuditEntry(entry)
  const entries = listAuditEntries()
  writeAuditEntries([nextEntry, ...entries].slice(0, 200))
  return nextEntry
}
