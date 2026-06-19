import type { WarningLevel } from './status.types'

export type WarningItem = {
  level: WarningLevel
  title: string
  message: string
  entityLabel?: string
}
