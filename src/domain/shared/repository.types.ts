export type EntityId = string
export type TimestampString = string

export type RepositoryMode = 'mock' | 'local' | 'real'

export type RepositoryError = {
  code: string
  message: string
  recoverable: boolean
}

export type RepositoryHealth = {
  mode: RepositoryMode
  ready: boolean
  lastCheckedAt: TimestampString
  warnings?: string[]
}

export type ListResult<T> = {
  items: T[]
  total: number
  mode: RepositoryMode
}

export type MutationResult<T> = {
  ok: boolean
  item?: T
  error?: RepositoryError
  mode: RepositoryMode
}
