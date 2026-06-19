function getStorageBackend() {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null
  }

  return window.localStorage
}

export function safeParseJson<T>(rawValue: string, fallback: T): T {
  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallback
  }
}

export function isLocalStorageAvailable() {
  const storage = getStorageBackend()

  if (!storage) {
    return false
  }

  try {
    const testKey = '__teamgest_storage_check__'
    storage.setItem(testKey, 'ok')
    storage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export function readJson<T>(key: string, fallback: T): T {
  const storage = getStorageBackend()
  if (!storage) {
    return fallback
  }

  try {
    const rawValue = storage.getItem(key)
    if (!rawValue) {
      return fallback
    }

    return safeParseJson(rawValue, fallback)
  } catch {
    return fallback
  }
}

export function writeJson<T>(key: string, value: T) {
  const storage = getStorageBackend()
  if (!storage) {
    return false
  }

  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeItem(key: string) {
  const storage = getStorageBackend()
  if (!storage) {
    return false
  }

  try {
    storage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function clearNamespace(prefix: string) {
  const storage = getStorageBackend()
  if (!storage) {
    return 0
  }

  const keys = Object.keys(storage).filter((key) => key.startsWith(prefix))
  keys.forEach((key) => {
    try {
      storage.removeItem(key)
    } catch {
      // Ignore individual failures and report what was attempted.
    }
  })

  return keys.length
}

export function listKeys(prefix?: string) {
  const storage = getStorageBackend()
  if (!storage) {
    return [] as string[]
  }

  const keys = Object.keys(storage)
  return prefix ? keys.filter((key) => key.startsWith(prefix)) : keys
}

export function hasKey(key: string) {
  const storage = getStorageBackend()
  if (!storage) {
    return false
  }

  try {
    return storage.getItem(key) !== null
  } catch {
    return false
  }
}

export function readText(key: string) {
  const storage = getStorageBackend()
  if (!storage) {
    return null
  }

  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

export function getStorageSizeEstimate(prefix?: string) {
  const storage = getStorageBackend()
  if (!storage) {
    return 0
  }

  return listKeys(prefix).reduce((total, key) => {
    const value = storage.getItem(key) ?? ''
    return total + key.length + value.length
  }, 0)
}
