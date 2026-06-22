import type { ClientInput } from '../../domain/clients/client.inputs'
import type { Client } from '../../domain/clients/client.types'
import { createEntityId } from '../../utils/ids'
import { recordAuditEvent } from '../audit/auditRepository'
import { listAllPropertiesSnapshot } from './propertyRepository'
import { listAllServicesSnapshot } from './serviceRepository'
import { mockClients } from '../mock/mockClients'
import {
  archiveEntity,
  createLocalRecord,
  deleteLocalRecord,
  getEntityLocalState,
  listArchivedEntities,
  listLocalCreated,
  listLocalOverrides,
  mergeSeedWithLocal,
  restoreEntity,
  upsertLocalOverride,
} from '../storage/entityLocalStore'
import { CLIENTS_ARCHIVED_KEY, CLIENTS_CREATED_KEY, CLIENTS_OVERRIDES_KEY } from '../storage/storageKeys'

function readAllClients() {
  return mergeSeedWithLocal(
    mockClients,
    listLocalCreated<Client>(CLIENTS_CREATED_KEY),
    listLocalOverrides<Client>(CLIENTS_OVERRIDES_KEY),
    [],
  )
}

function readClients() {
  return readAllClients().filter((client) => !listArchivedEntities(CLIENTS_ARCHIVED_KEY)[client.id])
}

function hasClientDependencies(clientId: string) {
  return (
    listAllPropertiesSnapshot().some((property) => property.clientId === clientId) ||
    listAllServicesSnapshot().some((service) => service.clientId === clientId)
  )
}

function buildClient(input: ClientInput): Client {
  const timestamp = new Date().toISOString()
  return {
    id: createEntityId('client'),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...input,
  }
}

export function createClientRepository() {
  return {
    listClients: () => readClients(),
    getClientById: (id: string) => readAllClients().find((client) => client.id === id),
    createClient: (input: ClientInput) => {
      const client = buildClient(input)
      createLocalRecord(CLIENTS_CREATED_KEY, client)
      restoreEntity(CLIENTS_ARCHIVED_KEY, client.id)
      recordAuditEvent({
        action: 'client.created',
        entityType: 'client',
        entityId: client.id,
        message: `Se creo el cliente ${client.name}.`,
      })
      return client
    },
    updateClient: (id: string, patch: Partial<ClientInput>) => {
      const localState = getEntityLocalState(
        {
          createdKey: CLIENTS_CREATED_KEY,
          overridesKey: CLIENTS_OVERRIDES_KEY,
          archivedKey: CLIENTS_ARCHIVED_KEY,
        },
        id,
      )
      const current = readAllClients().find((client) => client.id === id)
      if (!current) {
        return null
      }

      const nextValue = {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
      }

      if (localState.isLocalCreated) {
        createLocalRecord(CLIENTS_CREATED_KEY, nextValue)
      } else {
        upsertLocalOverride<Client>(CLIENTS_OVERRIDES_KEY, id, {
          ...patch,
          updatedAt: nextValue.updatedAt,
        } as Partial<Client>)
      }

      recordAuditEvent({
        action: 'client.updated',
        entityType: 'client',
        entityId: id,
        message: `Se actualizo el cliente ${nextValue.name}.`,
      })
      return nextValue
    },
    archiveClient: (id: string) => {
      const client = readAllClients().find((item) => item.id === id)
      if (!client) {
        return false
      }

      archiveEntity(CLIENTS_ARCHIVED_KEY, id, {
        reason: hasClientDependencies(id) ? 'linked_operations' : undefined,
      })
      recordAuditEvent({
        action: 'client.archived',
        entityType: 'client',
        entityId: id,
        message: `Se archivo el cliente ${client.name}.`,
      })
      return true
    },
    restoreClient: (id: string) => {
      const client = readAllClients().find((item) => item.id === id)
      if (!client) {
        return false
      }

      const restored = restoreEntity(CLIENTS_ARCHIVED_KEY, id)
      if (restored) {
        recordAuditEvent({
          action: 'client.restored',
          entityType: 'client',
          entityId: id,
          message: `Se restauro el cliente ${client.name}.`,
        })
      }
      return restored
    },
    canDeleteClient: (id: string) => {
      const localState = getEntityLocalState(
        {
          createdKey: CLIENTS_CREATED_KEY,
          overridesKey: CLIENTS_OVERRIDES_KEY,
          archivedKey: CLIENTS_ARCHIVED_KEY,
        },
        id,
      )
      if (!localState.isLocalCreated) {
        return {
          allowed: false,
          reason: 'Los clientes de semilla solo pueden archivarse en esta version local.',
        }
      }

      if (hasClientDependencies(id)) {
        return {
          allowed: false,
          reason: 'Este cliente tiene inmuebles o servicios asociados. Archivarlo es seguro; eliminarlo no.',
        }
      }

      return { allowed: true }
    },
    deleteClient: (id: string) => {
      const policy = createClientRepository().canDeleteClient(id)
      const client = readAllClients().find((item) => item.id === id)
      if (!policy.allowed || !client) {
        return false
      }

      const deleted = deleteLocalRecord<Client>(CLIENTS_CREATED_KEY, id)
      if (deleted) {
        restoreEntity(CLIENTS_ARCHIVED_KEY, id)
        recordAuditEvent({
          action: 'client.deleted',
          entityType: 'client',
          entityId: id,
          message: `Se elimino el cliente local ${client.name}.`,
        })
      }
      return deleted
    },
  }
}
