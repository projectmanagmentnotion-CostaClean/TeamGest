import type { PropertyInput } from '../../domain/properties/property.inputs'
import type { Property } from '../../domain/properties/property.types'
import { createEntityId } from '../../utils/ids'
import { recordAuditEvent } from '../audit/auditRepository'
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
  PROPERTIES_ARCHIVED_KEY,
  PROPERTIES_CREATED_KEY,
  PROPERTIES_OVERRIDES_KEY,
} from '../storage/storageKeys'

function readProperties() {
  return mergeSeedWithLocal(
    mockProperties,
    listLocalCreated<Property>(PROPERTIES_CREATED_KEY),
    listLocalOverrides<Property>(PROPERTIES_OVERRIDES_KEY),
    Object.keys(listArchivedEntities(PROPERTIES_ARCHIVED_KEY)),
  )
}

function hasServices(propertyId: string) {
  return mockServices.some((service) => service.propertyId === propertyId)
}

function buildProperty(input: PropertyInput): Property {
  const timestamp = new Date().toISOString()
  return {
    id: createEntityId('property'),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...input,
  }
}

export function createPropertyRepository() {
  return {
    listProperties: () => readProperties(),
    getPropertyById: (id: string) => readProperties().find((property) => property.id === id),
    createProperty: (input: PropertyInput) => {
      const property = buildProperty(input)
      createLocalRecord(PROPERTIES_CREATED_KEY, property)
      restoreEntity(PROPERTIES_ARCHIVED_KEY, property.id)
      recordAuditEvent({
        action: 'property.created',
        entityType: 'property',
        entityId: property.id,
        message: `Se creó el inmueble ${property.name}.`,
      })
      return property
    },
    updateProperty: (id: string, patch: Partial<PropertyInput>) => {
      const localState = getEntityLocalState(
        {
          createdKey: PROPERTIES_CREATED_KEY,
          overridesKey: PROPERTIES_OVERRIDES_KEY,
          archivedKey: PROPERTIES_ARCHIVED_KEY,
        },
        id,
      )
      const current = readProperties().find((property) => property.id === id)
      if (!current) {
        return null
      }

      const nextValue = {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
      }

      if (localState.isLocalCreated) {
        createLocalRecord(PROPERTIES_CREATED_KEY, nextValue)
      } else {
        upsertLocalOverride<Property>(PROPERTIES_OVERRIDES_KEY, id, {
          ...patch,
          updatedAt: nextValue.updatedAt,
        } as Partial<Property>)
      }

      recordAuditEvent({
        action: 'property.updated',
        entityType: 'property',
        entityId: id,
        message: `Se actualizó el inmueble ${nextValue.name}.`,
      })
      return nextValue
    },
    archiveProperty: (id: string) => {
      const property = readProperties().find((item) => item.id === id)
      if (!property) {
        return false
      }

      archiveEntity(PROPERTIES_ARCHIVED_KEY, id)
      recordAuditEvent({
        action: 'property.archived',
        entityType: 'property',
        entityId: id,
        message: `Se archivó el inmueble ${property.name}.`,
      })
      return true
    },
    restoreProperty: (id: string) => {
      const property = [...mockProperties, ...listLocalCreated<Property>(PROPERTIES_CREATED_KEY)].find(
        (item) => item.id === id,
      )
      if (!property) {
        return false
      }

      const restored = restoreEntity(PROPERTIES_ARCHIVED_KEY, id)
      if (restored) {
        recordAuditEvent({
          action: 'property.restored',
          entityType: 'property',
          entityId: id,
          message: `Se restauró el inmueble ${property.name}.`,
        })
      }
      return restored
    },
    canDeleteProperty: (id: string) => {
      const localState = getEntityLocalState(
        {
          createdKey: PROPERTIES_CREATED_KEY,
          overridesKey: PROPERTIES_OVERRIDES_KEY,
          archivedKey: PROPERTIES_ARCHIVED_KEY,
        },
        id,
      )
      if (!localState.isLocalCreated) {
        return {
          allowed: false,
          reason: 'Los inmuebles de semilla solo pueden archivarse en esta versión local.',
        }
      }

      if (hasServices(id)) {
        return {
          allowed: false,
          reason: 'Este inmueble ya tiene servicios asociados. Archívalo en lugar de eliminarlo.',
        }
      }

      return { allowed: true }
    },
    deleteProperty: (id: string) => {
      const policy = createPropertyRepository().canDeleteProperty(id)
      const property = readProperties().find((item) => item.id === id)
      if (!policy.allowed || !property) {
        return false
      }

      const deleted = deleteLocalRecord<Property>(PROPERTIES_CREATED_KEY, id)
      if (deleted) {
        restoreEntity(PROPERTIES_ARCHIVED_KEY, id)
        recordAuditEvent({
          action: 'property.deleted',
          entityType: 'property',
          entityId: id,
          message: `Se eliminó el inmueble local ${property.name}.`,
        })
      }
      return deleted
    },
  }
}
