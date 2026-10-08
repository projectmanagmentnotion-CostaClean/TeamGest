import { describe, expect, it } from 'vitest'
import { canUseTeamGestCapability } from '../src/infrastructure/real/accessPolicy'
import { validateMigrationInput } from '../src/infrastructure/real/migrationValidation'

const validBackup = {
  appName: 'TeamGest',
  exportedAt: '2026-10-08T00:00:00.000Z',
  schemaVersion: 1,
  data: {
    createdServices: [],
    serviceOverrides: {},
    archivedServices: {},
    createdWorkers: [{ id: 'worker-1' }],
    workerOverrides: {},
    archivedWorkers: {},
    createdClients: [],
    clientOverrides: {},
    archivedClients: {},
    createdProperties: [],
    propertyOverrides: {},
    archivedProperties: {},
    payrollMonths: {},
    payrollAudit: {},
    appAudit: [],
    settings: {},
    metadata: {},
  },
}

describe('TeamGest future real boundaries', () => {
  it('keeps worker and accountant permissions least-privileged', () => {
    expect(canUseTeamGestCapability('worker', 'payroll.read')).toBe(false)
    expect(canUseTeamGestCapability('accountant_viewer', 'payroll.read')).toBe(true)
    expect(canUseTeamGestCapability('accountant_viewer', 'payroll.write')).toBe(false)
  })

  it('validates a local backup before any future import', () => {
    const report = validateMigrationInput(validBackup)
    expect(report.ready).toBe(true)
    expect(report.summary?.workers).toBe(1)
  })

  it('blocks unsupported schemas and duplicate entity ids', () => {
    const report = validateMigrationInput({
      ...validBackup,
      schemaVersion: 2,
      data: { ...validBackup.data, createdClients: [{ id: 'worker-1' }] },
    })
    expect(report.ready).toBe(false)
    expect(report.issues.map((issue) => issue.code)).toEqual(['UNSUPPORTED_SCHEMA', 'DUPLICATE_ID'])
  })
})
