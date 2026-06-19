import { mockWorkers } from '../mock/mockWorkers'

export function createWorkerRepository() {
  return {
    listWorkers: () => mockWorkers,
    getWorkerById: (id: string) => mockWorkers.find((worker) => worker.id === id),
  }
}
