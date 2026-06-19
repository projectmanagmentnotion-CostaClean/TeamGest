export type ServiceStatus =
  | 'draft'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'reviewed'
  | 'closed'
  | 'cancelled'

export type PayrollStatus = 'pending' | 'reviewed' | 'paid' | 'locked'

export type WarningLevel = 'danger' | 'blocked' | 'warning' | 'info' | 'success'
