import { recordAuditEvent } from '../audit/auditRepository'
import { STORAGE_METADATA_KEY, LEGACY_SERVICES_CREATED_KEY, SERVICES_CREATED_KEY } from './storageKeys'
import { hasKey, readJson, writeJson } from './localStorageAdapter'

export const CURRENT_STORAGE_SCHEMA_VERSION = 1

type StorageMigration = {
  id: string
  description: string
  run: () => void
}

function setSchemaVersionIfMissing() {
  const metadata = readJson<Record<string, unknown> | null>(STORAGE_METADATA_KEY, null)
  if (metadata?.schemaVersion === CURRENT_STORAGE_SCHEMA_VERSION) {
    return
  }

  writeJson(STORAGE_METADATA_KEY, {
    schemaVersion: CURRENT_STORAGE_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    lastBackupAt: typeof metadata?.lastBackupAt === 'string' ? metadata.lastBackupAt : undefined,
    lastImportAt: typeof metadata?.lastImportAt === 'string' ? metadata.lastImportAt : undefined,
    lastResetAt: typeof metadata?.lastResetAt === 'string' ? metadata.lastResetAt : undefined,
  })
}

function migrateLegacyServicesKey() {
  if (!hasKey(LEGACY_SERVICES_CREATED_KEY) || hasKey(SERVICES_CREATED_KEY)) {
    return
  }

  const legacyServices = readJson<unknown[]>(LEGACY_SERVICES_CREATED_KEY, [])
  if (legacyServices.length > 0) {
    writeJson(SERVICES_CREATED_KEY, legacyServices)
  }
}

const STORAGE_MIGRATIONS: StorageMigration[] = [
  {
    id: 'storage-schema-v1',
    description: 'Establece el esquema inicial de almacenamiento local.',
    run: setSchemaVersionIfMissing,
  },
  {
    id: 'services-legacy-key',
    description: 'Copia servicios locales heredados a la clave centralizada TeamGest.',
    run: migrateLegacyServicesKey,
  },
]

export function getPendingMigrations() {
  const pending: StorageMigration[] = []

  if (!hasKey(STORAGE_METADATA_KEY)) {
    pending.push(STORAGE_MIGRATIONS[0])
  }

  if (hasKey(LEGACY_SERVICES_CREATED_KEY) && !hasKey(SERVICES_CREATED_KEY)) {
    pending.push(STORAGE_MIGRATIONS[1])
  }

  return pending
}

export function runStorageMigrations() {
  const pending = getPendingMigrations()
  if (pending.length === 0) {
    return []
  }

  pending.forEach((migration) => migration.run())

  recordAuditEvent({
    action: 'storage.migration_run',
    message: `Se ejecutaron ${pending.length} migraciones locales de almacenamiento.`,
    metadata: {
      migrations: pending.map((migration) => migration.id).join(', '),
    },
  })

  return pending
}

export function migrateStorageIfNeeded() {
  return runStorageMigrations()
}
