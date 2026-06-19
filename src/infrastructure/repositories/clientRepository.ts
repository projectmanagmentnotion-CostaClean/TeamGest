import { mockClients } from '../mock/mockClients'

export function createClientRepository() {
  return {
    listClients: () => mockClients,
    getClientById: (id: string) => mockClients.find((client) => client.id === id),
  }
}
