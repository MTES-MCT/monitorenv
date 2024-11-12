import { FrontendApiError } from '@libs/FrontendApiError'
import { createEntityAdapter, createSelector, type EntityState } from '@reduxjs/toolkit'
import { boundingExtent } from 'ol/extent'

import { monitorenvPrivateApi } from './api'

import type {
  RegulatoryLayerCompact,
  RegulatoryLayerCompactFromAPI,
  RegulatoryLayerWithMetadata,
  RegulatoryLayerWithMetadataFromAPI
} from '../domain/entities/regulatory'
import type { HomeRootState } from '@store/index'
import type { Coordinate } from 'ol/coordinate'

const GET_REGULATORY_LAYER_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la zones réglementaire"
const GET_REGULATORY_LAYERS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la/les zones réglementaires"

const RegulatoryLayersAdapter = createEntityAdapter<RegulatoryLayerCompact>()

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
    getRegulatoryLayers: builder.query<EntityState<RegulatoryLayerCompact, number>, void>({
      query: () => `/v1/regulatory`,
      transformErrorResponse: response => new FrontendApiError(GET_REGULATORY_LAYERS_ERROR_MESSAGE, response),
      transformResponse: (response: RegulatoryLayerCompactFromAPI[]) =>
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
        .filter((layer): layer is RegulatoryLayerCompact => !!layer) ?? emptyArray
    )
  }
)

/* export const getRegulatoryLayersIdsGroupedByName = createSelector(
  [regulatoryLayersAPI.endpoints.getRegulatoryLayers.select()],
  regulatoryLayers => {
    const regulatoryLayersIdsByName = {}
    const regulatoryLayersEntities = regulatoryLayers?.data?.entities
    const regulatoryLayersIds = regulatoryLayers?.data?.ids
    if (regulatoryLayersIds && regulatoryLayersEntities) {
      return regulatoryLayersIds?.reduce((acc, layerId) => {
        const name = regulatoryLayersEntities[layerId]?.layer_name
        if (name) {
          acc[name] = [...(acc[name] ?? []), layerId]
        }

        return acc
      }, {} as { [key: string]: EntityId[] })
    }

    return regulatoryLayersIdsByName
  }
) */

/* export const getRegulatoryLayersIdsByGroupName = createCachedSelector(
  [getRegulatoryLayersIdsGroupedByName, (_, groupName: string) => groupName],
  (regulatoryLayersIdsByName, groupName) => regulatoryLayersIdsByName && regulatoryLayersIdsByName[groupName]
)((_, groupName: string) => groupName) */

/* export const getNumberOfRegulatoryLayerZonesByGroupName = createCachedSelector(
  [getRegulatoryLayersIdsGroupedByName, (_, name: string) => name],
  (regulatoryLayerZonesByName, name): number => regulatoryLayerZonesByName[name]?.length ?? 0
)((_, name) => name) */

/* export const getExtentOfRegulatoryLayersGroupByGroupName = createCachedSelector(
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
)((_, groupName: string) => groupName) */
