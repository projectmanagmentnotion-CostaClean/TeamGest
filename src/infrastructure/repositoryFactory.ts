import { createAppSettingsRepository } from './repositories/appSettingsRepository'
import { createClientRepository } from './repositories/clientRepository'
import { createPayrollRepository } from './repositories/payrollRepository'
import { createPropertyRepository } from './repositories/propertyRepository'
import { createServiceRepository } from './repositories/serviceRepository'
import { createWorkerRepository } from './repositories/workerRepository'
import { buildTeamGestBackup, downloadTeamGestBackup } from './storage/storageBackup'
import { getStorageHealthReport } from './storage/storageHealth'
import { getStorageMetadata } from './storage/storageMetadata'
import { migrateStorageIfNeeded } from './storage/storageMigrations'

let repositories: ReturnType<typeof createRepositories> | null = null
let storageTools: ReturnType<typeof createStorageTools> | null = null
let appSettingsRepository: ReturnType<typeof createAppSettingsRepository> | null = null

function createRepositories() {
  const workerRepository = createWorkerRepository()
  const clientRepository = createClientRepository()
  const propertyRepository = createPropertyRepository()
  const serviceRepository = createServiceRepository()

  return {
    workers: workerRepository,
    clients: clientRepository,
    properties: propertyRepository,
    services: serviceRepository,
    payroll: createPayrollRepository({
      listWorkers: workerRepository.listWorkers,
      listServices: serviceRepository.listServices,
    }),
  }
}

function createStorageTools() {
  return {
    migrateStorageIfNeeded,
    getStorageMetadata,
    getStorageHealthReport,
    buildTeamGestBackup,
    downloadTeamGestBackup,
  }
}

export function getRepositories() {
  if (!repositories) {
    // Runtime remains local-first on purpose.
    // Real adapters and backend activation stay disabled until
    // auth, security, and migration strategy are explicitly approved.
    repositories = createRepositories()
  }

  return repositories
}

export function getStorageTools() {
  if (!storageTools) {
    storageTools = createStorageTools()
  }

  return storageTools
}

export function getAppSettingsRepository() {
  if (!appSettingsRepository) {
    appSettingsRepository = createAppSettingsRepository()
  }

  return appSettingsRepository
}
