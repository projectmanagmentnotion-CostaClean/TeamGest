import type { WarningLevel } from '../../domain/shared/status.types'
import { CURRENT_STORAGE_SCHEMA_VERSION } from './storageMigrations'
import {
  getStorageSizeEstimate,
  hasKey,
  isLocalStorageAvailable,
  listKeys,
  readText,
  safeParseJson,
} from './localStorageAdapter'
import { getStorageMetadata } from './storageMetadata'
import { TEAMGEST_EXPECTED_STORAGE_KEYS, TEAMGEST_STORAGE_PREFIX } from './storageKeys'

export type StorageHealthReport = {
  level: 'healthy' | 'warning' | 'danger'
  storageAvailable: boolean
  corruptedKeys: string[]
  missingExpectedKeys: string[]
  sizeEstimate: number
  schemaVersion: number | null
  warnings: string[]
}

export function detectCorruptedStorageKeys() {
  return listKeys(TEAMGEST_STORAGE_PREFIX).filter((key) => {
    const rawValue = readText(key)
    if (!rawValue) {
      return false
    }

    const parsed = safeParseJson(rawValue, '__TEAMGEST_CORRUPTED__')
    return parsed === '__TEAMGEST_CORRUPTED__'
  })
}

export function detectStorageAvailability() {
  return isLocalStorageAvailable()
}

export function detectStorageSize() {
  return getStorageSizeEstimate(TEAMGEST_STORAGE_PREFIX)
}

export function detectMissingExpectedKeys() {
  return TEAMGEST_EXPECTED_STORAGE_KEYS.filter((key) => !hasKey(key))
}

export function getStorageHealthLevel(report: Omit<StorageHealthReport, 'level'>) {
  if (!report.storageAvailable || report.corruptedKeys.length > 0) {
    return 'danger' as const
  }

  if (report.missingExpectedKeys.length > 0 || report.sizeEstimate > 4_000_000) {
    return 'warning' as const
  }

  return 'healthy' as const
}

export function getStorageHealthReport(): StorageHealthReport {
  const storageAvailable = detectStorageAvailability()
  const schemaVersion = storageAvailable ? getStorageMetadata().schemaVersion : null
  const corruptedKeys = storageAvailable ? detectCorruptedStorageKeys() : []
  const missingExpectedKeys = storageAvailable
    ? detectMissingExpectedKeys()
    : [...TEAMGEST_EXPECTED_STORAGE_KEYS]
  const sizeEstimate = storageAvailable ? detectStorageSize() : 0
  const warnings: string[] = []

  if (!storageAvailable) {
    warnings.push('El almacenamiento local del navegador no esta disponible en este contexto.')
  }

  if (schemaVersion === null || schemaVersion < CURRENT_STORAGE_SCHEMA_VERSION) {
    warnings.push('La version del esquema local no esta inicializada o requiere migracion.')
  }

  if (corruptedKeys.length > 0) {
    warnings.push(`Se detectaron ${corruptedKeys.length} claves con JSON corrupto.`)
  }

  if (missingExpectedKeys.length > 0) {
    warnings.push('Faltan claves esperadas del espacio local de TeamGest. Se crearan al usar cada modulo.')
  }

  if (sizeEstimate > 4_000_000) {
    warnings.push('El tamano estimado del almacenamiento local se acerca al limite habitual del navegador.')
  }

  return {
    level: getStorageHealthLevel({
      storageAvailable,
      corruptedKeys,
      missingExpectedKeys,
      sizeEstimate,
      schemaVersion,
      warnings,
    }),
    storageAvailable,
    corruptedKeys,
    missingExpectedKeys,
    sizeEstimate,
    schemaVersion,
    warnings,
  }
}

export function mapStorageHealthToWarningLevel(level: StorageHealthReport['level']): WarningLevel {
  if (level === 'danger') {
    return 'danger'
  }

  if (level === 'warning') {
    return 'warning'
  }

  return 'success'
}
