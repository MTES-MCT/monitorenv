import { getExtentOfLayersGroup } from '@features/layersSelector/utils/getExtentOfLayersGroup'
import { FrontendApiError } from '@libs/FrontendApiError'
import { createEntityAdapter, createSelector, type EntityId, type EntityState } from '@reduxjs/toolkit'
import { SeaFrontLabels } from 'domain/entities/seaFrontType'
import { boundingExtent, createEmpty } from 'ol/extent'
import { createCachedSelector } from 're-reselect'

import { monitorenvPrivateApi } from './api'

import type {
  RegulatoryLayerCompact,
  RegulatoryLayerWithMetadata,
  RegulatoryLayerWithMetadataFromAPI
} from '../domain/entities/regulatory'
import type { HomeRootState } from '@store/index'
import type { Coordinate } from 'ol/coordinate'
import type { StringDigit } from 'type-fest/source/internal'

const GET_REGULATORY_LAYER_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la zones réglementaire"
const GET_REGULATORY_LAYERS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la/les zones réglementaires"

const RegulatoryLayersAdapter = createEntityAdapter<RegulatoryLayerWithMetadata>()

const regulatoryLayersInitialState = RegulatoryLayersAdapter.getInitialState()

export const regulatoryLayersAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getRegulatoryLayerById: builder.query<RegulatoryLayerWithMetadata, number>({
      query: id => `/v1/regulatory/${id}`,
      transformErrorResponse: response => new FrontendApiError(GET_REGULATORY_LAYER_ERROR_MESSAGE, response),
      transformResponse: (response: RegulatoryLayerWithMetadataFromAPI) => {
        const bbox = boundingExtent(response.geom.coordinates.flat().flat() as Coordinate[])

        return {
          ...response,
          bbox
        }
      }
    }),
    getRegulatoryLayers: builder.query<EntityState<RegulatoryLayerWithMetadata, number>, void>({
      query: () => `/v1/regulatory`,
      transformErrorResponse: response => new FrontendApiError(GET_REGULATORY_LAYERS_ERROR_MESSAGE, response),
      transformResponse: (response: RegulatoryLayerWithMetadata[]) =>
        RegulatoryLayersAdapter.setAll(
          regulatoryLayersInitialState,
          response.map(regulatoryLayer => {
            const bbox = boundingExtent(regulatoryLayer.geom.coordinates.flat().flat() as Coordinate[])

            return {
              ...regulatoryLayer,
              bbox
            }
          })
        )
    })
  })
})

export const { useGetRegulatoryLayerByIdQuery, useGetRegulatoryLayersQuery } = regulatoryLayersAPI

export const getSelectedRegulatoryLayers = createSelector(
  [
    regulatoryLayersAPI.endpoints.getRegulatoryLayers.select(),
    (state: HomeRootState) => state.regulatory.selectedRegulatoryLayerIds
  ],
  (regulatoryLayers, selectedRegulatoryLayerIds) => {
    const emptyArray = []

    return (
      selectedRegulatoryLayerIds
        .map(id => regulatoryLayers?.data?.entities[id])
        .filter((layer): layer is RegulatoryLayerWithMetadata => !!layer) ?? emptyArray
    )
  }
)

export const getRegulatoryLayersIdsGroupedByName = createSelector(
  [regulatoryLayersAPI.endpoints.getRegulatoryLayers.select()],
  regulatoryLayers => {
    const regulatoryLayersIdsByName = {}
    const regulatoryLayersEntities = regulatoryLayers?.data?.entities
    const regulatoryLayersIds = regulatoryLayers?.data?.ids
    if (regulatoryLayersIds && regulatoryLayersEntities) {
      return regulatoryLayersIds?.reduce((acc, layerId) => {
        const name = regulatoryLayersEntities[layerId]?.layerName
        if (name) {
          acc[name] = [...(acc[name] ?? []), layerId]
        }

        return acc
      }, {} as { [key: string]: EntityId[] })
    }

    return regulatoryLayersIdsByName
  }
)

export const getRegulatoryLayersIdsByGroupName = createCachedSelector(
  [getRegulatoryLayersIdsGroupedByName, (_, groupName: string) => groupName],
  (regulatoryLayersIdsByName, groupName) => regulatoryLayersIdsByName && regulatoryLayersIdsByName[groupName]
)((_, groupName: string) => groupName)

export const getNumberOfRegulatoryLayerZonesByGroupName = createCachedSelector(
  [getRegulatoryLayersIdsGroupedByName, (_, name: string) => name],
  (regulatoryLayerZonesByName, name): number => regulatoryLayerZonesByName[name]?.length ?? 0
)((_, name) => name)

export const getRegulatoryAreasByIds = createSelector(
  [regulatoryLayersAPI.endpoints.getRegulatoryLayers.select(), (_, ids: number[]) => ids],
  ({ data }, ids) => Object.values(data?.entities ?? []).filter(regulatoryArea => ids.includes(regulatoryArea.id))
)

export const getExtentOfRegulatoryLayersGroupByGroupName = createCachedSelector(
  [regulatoryLayersAPI.endpoints.getRegulatoryLayers.select(), getRegulatoryLayersIdsByGroupName],
  (regulatoryLayersQuery, regulatoryLayerIdsByName) => {
    const amps = regulatoryLayerIdsByName
      ?.map(id => regulatoryLayersQuery.data?.entities[id])
      .filter((amp): amp is RegulatoryLayerCompact => !!amp)
    if (amps) {
      return getExtentOfLayersGroup(amps)
    }

    return createEmpty()
  }
)((_, groupName: string) => groupName)

export const getRegulatoryLayersByControlPlan = createSelector(
  [regulatoryLayersAPI.endpoints.getRegulatoryLayers.select()],
  regulatoryLayers => {
    const entities = regulatoryLayers?.data?.entities
    const ids = regulatoryLayers?.data?.ids

    if (!ids || !entities) {
      return {}
    }

    return ids.reduce((acc, layerId) => {
      const entity = entities[layerId]
      const layerName = entity?.layerName
      const planRaw = entity?.plan

      if (!layerName || !planRaw) {
        return acc
      }

      const plans = planRaw.split(',').map(p => p.trim())

      plans.forEach(plan => {
        acc[plan] ??= {}
        acc[plan][layerName] ??= []
        acc[plan][layerName].push(entities[layerId])
      })

      return acc
    }, {} as Record<'PIRC' | 'PSCEM', Record<string, RegulatoryLayerCompact[]>>)
  }
)

export const getRegulatoryLayersBySeaFront = createSelector(
  [regulatoryLayersAPI.endpoints.getRegulatoryLayers.select()],
  regulatoryLayers => {
    const entities = regulatoryLayers?.data?.entities
    const ids = regulatoryLayers?.data?.ids

    if (!ids || !entities) {
      return {}
    }

    return ids.reduce((acc, layerId) => {
      const entity = entities[layerId]
      const layerName = entity?.layerName
      const seaFront = entity?.facade

      if (!layerName || !seaFront) {
        return acc
      }
      const allSeaFronts = Object.values(SeaFrontLabels).map(seaFrontLabel => seaFrontLabel.label)

      allSeaFronts.forEach(seaFrontLabel => {
        if (seaFront === seaFrontLabel) {
          acc[seaFrontLabel] ??= {}
          acc[seaFrontLabel][layerName] ??= []
          acc[seaFrontLabel][layerName].push(entities[layerId])
        }
      })

      return acc
    }, {} as Record<StringDigit, Record<string, RegulatoryLayerCompact[]>>)
  }
)
