import { getExtentOfLayersGroup } from '@features/layersSelector/utils/getExtentOfLayersGroup'
import { FrontendApiError } from '@libs/FrontendApiError'
import { createEntityAdapter, createSelector, type EntityId, type EntityState } from '@reduxjs/toolkit'
import { boundingExtent, createEmpty, type Extent } from 'ol/extent'
import { createCachedSelector } from 're-reselect'

import { monitorenvPrivateApi } from './api'

import type {
  RegulatoryLayerCompact,
  RegulatoryLayerWithMetadata,
  RegulatoryLayerWithMetadataFromAPI
} from '../domain/entities/regulatory'
import type { HomeRootState } from '@store/index'
import type { Coordinate } from 'ol/coordinate'

const GET_REGULATORY_LAYER_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la zones réglementaire"
const GET_REGULATORY_LAYERS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la/les zones réglementaires"

const RegulatoryLayersAdapter = createEntityAdapter<RegulatoryLayerWithMetadata>()

const regulatoryLayersInitialState = RegulatoryLayersAdapter.getInitialState()

type RegulatoryAreaQueryOption = {
  bbox?: Extent | undefined
  withGeometry?: boolean
  zoom?: number | undefined
}
export const regulatoryLayersAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getRegulatoryAreasByIds: builder.query<RegulatoryLayerWithMetadata[], number[]>({
      query: ids => ({ body: ids, method: 'POST', url: '/v1/regulatory' }),
      transformResponse: (response: RegulatoryLayerWithMetadataFromAPI[]) =>
        response.map(regulatoryArea => {
          const bbox = boundingExtent((regulatoryArea.geom?.coordinates ?? []).flat().flat() as Coordinate[])

          return {
            ...regulatoryArea,
            bbox
          }
        })
    }),
    getRegulatoryLayerById: builder.query<RegulatoryLayerWithMetadata, number>({
      query: id => `/v1/regulatory/${id}`,
      transformErrorResponse: response => new FrontendApiError(GET_REGULATORY_LAYER_ERROR_MESSAGE, response),
      transformResponse: (response: RegulatoryLayerWithMetadataFromAPI) => {
        const bbox = boundingExtent((response.geom?.coordinates ?? []).flat().flat() as Coordinate[])

        return {
          ...response,
          bbox
        }
      }
    }),
    getRegulatoryLayers: builder.query<EntityState<RegulatoryLayerWithMetadata, number>, RegulatoryAreaQueryOption>({
      query: ({ bbox, withGeometry, zoom } = { bbox: undefined, withGeometry: false, zoom: undefined }) =>
        `/v1/regulatory?withGeometry=${withGeometry}${withGeometry && bbox ? `&bbox=${bbox}` : ''}${
          withGeometry && zoom ? `&zoom=${zoom}` : ''
        }`,
      transformErrorResponse: response => new FrontendApiError(GET_REGULATORY_LAYERS_ERROR_MESSAGE, response),
      transformResponse: (response: RegulatoryLayerWithMetadata[]) =>
        RegulatoryLayersAdapter.setAll(
          regulatoryLayersInitialState,
          response.map(regulatoryLayer => {
            const bbox = boundingExtent((regulatoryLayer.geom?.coordinates ?? []).flat().flat() as Coordinate[])

            return {
              ...regulatoryLayer,
              bbox
            }
          })
        )
    })
  })
})

export const { useGetRegulatoryAreasByIdsQuery, useGetRegulatoryLayerByIdQuery, useGetRegulatoryLayersQuery } =
  regulatoryLayersAPI

export const getSelectedRegulatoryLayers = createSelector(
  [
    regulatoryLayersAPI.endpoints.getRegulatoryLayers.select({ withGeometry: false }),
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
  [regulatoryLayersAPI.endpoints.getRegulatoryLayers.select({ withGeometry: false })],
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
  [regulatoryLayersAPI.endpoints.getRegulatoryLayers.select({ withGeometry: false }), (_, ids: number[]) => ids],
  ({ data }, ids) => Object.values(data?.entities ?? []).filter(regulatoryArea => ids.includes(regulatoryArea.id))
)

export const getExtentOfRegulatoryLayersGroupByGroupName = createCachedSelector(
  // FIXME: replace with endpoint findByIds/groupName
  [
    regulatoryLayersAPI.endpoints.getRegulatoryLayers.select({ withGeometry: false }),
    getRegulatoryLayersIdsByGroupName
  ],
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
