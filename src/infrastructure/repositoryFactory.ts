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
    // Future sprints can swap this factory to localStorage or a real backend
    // without changing page-level consumers.
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
