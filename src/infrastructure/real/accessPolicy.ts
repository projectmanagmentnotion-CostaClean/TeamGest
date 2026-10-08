export type TeamGestRole = 'owner_admin' | 'manager' | 'worker' | 'accountant_viewer'

export type TeamGestCapability =
  | 'operational.read'
  | 'operational.write'
  | 'payroll.read'
  | 'payroll.write'
  | 'settings.write'
  | 'backup.read'
  | 'migration.execute'
  | 'audit.read'

const roleCapabilities: Record<TeamGestRole, readonly TeamGestCapability[]> = {
  owner_admin: [
    'operational.read',
    'operational.write',
    'payroll.read',
    'payroll.write',
    'settings.write',
    'backup.read',
    'migration.execute',
    'audit.read',
  ],
  manager: [
    'operational.read',
    'operational.write',
    'payroll.read',
    'payroll.write',
    'backup.read',
    'migration.execute',
    'audit.read',
  ],
  worker: ['operational.read'],
  accountant_viewer: ['operational.read', 'payroll.read', 'backup.read', 'audit.read'],
}

export function canUseTeamGestCapability(role: TeamGestRole, capability: TeamGestCapability) {
  return roleCapabilities[role].includes(capability)
}

export function listTeamGestCapabilities(role: TeamGestRole) {
  return [...roleCapabilities[role]]
}

// This policy is intentionally pure and inactive until an approved auth boundary exists.
