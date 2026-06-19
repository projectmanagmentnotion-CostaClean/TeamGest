import { CURRENT_STORAGE_SCHEMA_VERSION } from './storageMigrations'
import { readJson, writeJson } from './localStorageAdapter'
import { STORAGE_METADATA_KEY } from './storageKeys'

export type StorageMetadata = {
  schemaVersion: number
  lastBackupAt?: string
  lastImportAt?: string
  lastResetAt?: string
  updatedAt: string
}

function createDefaultStorageMetadata(): StorageMetadata {
  return {
    schemaVersion: CURRENT_STORAGE_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
  }
}

export function getStorageMetadata() {
  return readJson<StorageMetadata>(STORAGE_METADATA_KEY, createDefaultStorageMetadata())
}

export function updateStorageMetadata(partial: Partial<StorageMetadata>) {
  const current = getStorageMetadata()
  const nextValue: StorageMetadata = {
    ...current,
    ...partial,
    schemaVersion: partial.schemaVersion ?? current.schemaVersion ?? CURRENT_STORAGE_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
  }

  writeJson(STORAGE_METADATA_KEY, nextValue)
  return nextValue
}

export function markLastBackupAt(date: string) {
  return updateStorageMetadata({ lastBackupAt: date })
}

export function markLastImportAt(date: string) {
  return updateStorageMetadata({ lastImportAt: date })
}

export function markLastResetAt(date: string) {
  return updateStorageMetadata({ lastResetAt: date })
}
