import { readJson, writeJson } from './localStorageAdapter'

export type EntityArchiveState = {
  id: string
  archivedAt: string
  reason?: string
}

export type EntityLocalStateConfig = {
  archivedKey: string
  createdKey: string
  overridesKey: string
}

export function listLocalCreated<T>(key: string) {
  return readJson<T[]>(key, [])
}

export function listLocalOverrides<T>(key: string) {
  return readJson<Record<string, Partial<T>>>(key, {})
}

export function listArchivedEntities(key: string) {
  return readJson<Record<string, EntityArchiveState>>(key, {})
}

export function createLocalRecord<T extends { id: string }>(key: string, record: T) {
  const records = listLocalCreated<T>(key)
  const nextRecords = [record, ...records.filter((item) => item.id !== record.id)]
  writeJson(key, nextRecords)
  return record
}

export function upsertLocalOverride<T>(key: string, id: string, patch: Partial<T>) {
  const overrides = listLocalOverrides<T>(key)
  const nextOverrides = {
    ...overrides,
    [id]: {
      ...(overrides[id] ?? {}),
      ...patch,
    },
  }
  writeJson(key, nextOverrides)
  return nextOverrides[id]
}

export function archiveEntity(
  key: string,
  id: string,
  metadata?: Pick<EntityArchiveState, 'reason'>,
) {
  const archived = listArchivedEntities(key)
  const nextValue = {
    ...archived,
    [id]: {
      id,
      archivedAt: new Date().toISOString(),
      reason: metadata?.reason,
    },
  }
  writeJson(key, nextValue)
  return nextValue[id]
}

export function restoreEntity(key: string, id: string) {
  const archived = listArchivedEntities(key)
  if (!(id in archived)) {
    return false
  }

  const nextValue = { ...archived }
  delete nextValue[id]
  writeJson(key, nextValue)
  return true
}

export function deleteLocalRecord<T extends { id: string }>(key: string, id: string) {
  const records = listLocalCreated<T>(key)
  const nextRecords = records.filter((item) => item.id !== id)
  writeJson(key, nextRecords)
  return nextRecords.length !== records.length
}

export function getEntityLocalState(config: EntityLocalStateConfig, id: string) {
  const created = listLocalCreated<{ id: string }>(config.createdKey)
  const overrides = listLocalOverrides<Record<string, unknown>>(config.overridesKey)
  const archived = listArchivedEntities(config.archivedKey)

  return {
    isLocalCreated: created.some((item) => item.id === id),
    override: overrides[id],
    archived: archived[id],
  }
}

export function mergeSeedWithLocal<T extends { id: string }>(
  seedRecords: T[],
  localCreated: T[],
  localOverrides: Record<string, Partial<T>>,
  archivedIds: string[],
) {
  const localCreatedIds = new Set(localCreated.map((record) => record.id))
  const mergedCreated = localCreated.map((record) => ({
    ...record,
    ...(localOverrides[record.id] ?? {}),
  }))
  const mergedSeed = seedRecords
    .filter((record) => !localCreatedIds.has(record.id))
    .map((record) => ({
      ...record,
      ...(localOverrides[record.id] ?? {}),
    }))

  return [...mergedCreated, ...mergedSeed].filter((record) => !archivedIds.includes(record.id))
}
