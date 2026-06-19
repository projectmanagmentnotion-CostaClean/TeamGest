export function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(key)
  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return null
  }
}

export function writeJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeItem(key: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(key)
}

export function clearNamespace(namespace: string) {
  if (typeof window === 'undefined') {
    return
  }

  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(namespace))
    .forEach((key) => window.localStorage.removeItem(key))
}
