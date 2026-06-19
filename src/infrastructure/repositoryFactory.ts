import { createClientRepository } from './repositories/clientRepository'
import { createPayrollRepository } from './repositories/payrollRepository'
import { createPropertyRepository } from './repositories/propertyRepository'
import { createServiceRepository } from './repositories/serviceRepository'
import { createWorkerRepository } from './repositories/workerRepository'

let repositories: ReturnType<typeof createRepositories> | null = null

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
    payroll: createPayrollRepository(
      workerRepository.listWorkers(),
      serviceRepository.listServices(),
    ),
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
