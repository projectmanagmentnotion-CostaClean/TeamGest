import type { ClientInput } from '../../domain/clients/client.inputs'
import type { Client } from '../../domain/clients/client.types'
import { createEntityId } from '../../utils/ids'
import { recordAuditEvent } from '../audit/auditRepository'
import { mockClients } from '../mock/mockClients'
import { mockProperties } from '../mock/mockProperties'
import { mockServices } from '../mock/mockServices'
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
import {
  CLIENTS_ARCHIVED_KEY,
  CLIENTS_CREATED_KEY,
  CLIENTS_OVERRIDES_KEY,
} from '../storage/storageKeys'

function readClients() {
  return mergeSeedWithLocal(
    mockClients,
    listLocalCreated<Client>(CLIENTS_CREATED_KEY),
    listLocalOverrides<Client>(CLIENTS_OVERRIDES_KEY),
    Object.keys(listArchivedEntities(CLIENTS_ARCHIVED_KEY)),
  )
}

function hasClientDependencies(clientId: string) {
  return (
    mockProperties.some((property) => property.clientId === clientId) ||
    mockServices.some((service) => service.clientId === clientId)
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
    getClientById: (id: string) => readClients().find((client) => client.id === id),
    createClient: (input: ClientInput) => {
      const client = buildClient(input)
      createLocalRecord(CLIENTS_CREATED_KEY, client)
      restoreEntity(CLIENTS_ARCHIVED_KEY, client.id)
      recordAuditEvent({
        action: 'client.created',
        entityType: 'client',
        entityId: client.id,
        message: `Se creó el cliente ${client.name}.`,
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
      const current = readClients().find((client) => client.id === id)
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
        message: `Se actualizó el cliente ${nextValue.name}.`,
      })
      return nextValue
    },
    archiveClient: (id: string) => {
      const client = readClients().find((item) => item.id === id)
      if (!client) {
        return false
      }

      archiveEntity(CLIENTS_ARCHIVED_KEY, id)
      recordAuditEvent({
        action: 'client.archived',
        entityType: 'client',
        entityId: id,
        message: `Se archivó el cliente ${client.name}.`,
      })
      return true
    },
    restoreClient: (id: string) => {
      const client = [...mockClients, ...listLocalCreated<Client>(CLIENTS_CREATED_KEY)].find(
        (item) => item.id === id,
      )
      if (!client) {
        return false
      }

      const restored = restoreEntity(CLIENTS_ARCHIVED_KEY, id)
      if (restored) {
        recordAuditEvent({
          action: 'client.restored',
          entityType: 'client',
          entityId: id,
          message: `Se restauró el cliente ${client.name}.`,
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
          reason: 'Los clientes de semilla solo pueden archivarse en esta versión local.',
        }
      }

      if (hasClientDependencies(id)) {
        return {
          allowed: false,
          reason: 'Este cliente tiene inmuebles o servicios asociados. Archívalo en lugar de eliminarlo.',
        }
      }

      return { allowed: true }
    },
    deleteClient: (id: string) => {
      const policy = createClientRepository().canDeleteClient(id)
      const client = readClients().find((item) => item.id === id)
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
          message: `Se eliminó el cliente local ${client.name}.`,
        })
      }
      return deleted
    },
  }
}
