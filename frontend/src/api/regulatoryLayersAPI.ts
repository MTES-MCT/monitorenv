import { createEntityAdapter, createSelector, type EntityId, type EntityState, type Middleware } from '@reduxjs/toolkit'
import { boundingExtent } from 'ol/extent'

import { monitorenvPrivateApi } from './api'
import { setToast } from '../domain/shared_slices/Global'
import { getSelectedRegulatoryLayerIds } from '../domain/shared_slices/Regulatory'

import type {
  RegulatoryLayer,
  RegulatoryLayerFromAPI,
  RegulatoryLayers,
  RegulatoryLayersFromAPI
} from '../domain/entities/regulatory'
import type { Coordinate } from 'ol/coordinate'

export const REGULATORY_ZONES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les zones réglementaires"

const RegulatoryLayersAdapter = createEntityAdapter<RegulatoryLayers>()

const regulatoryLayersInitialState = RegulatoryLayersAdapter.getInitialState()

export const regulatoryLayersAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getRegulatoryLayerById: builder.query<RegulatoryLayer, number>({
      query: id => `/v1/regulatory/${id}`,
      transformResponse: (response: RegulatoryLayerFromAPI) => {
        const bbox = boundingExtent(response.geom.coordinates.flat().flat() as Coordinate[])

        return {
          ...response,
          bbox
        }
      }
    }),
    getRegulatoryLayers: builder.query<EntityState<RegulatoryLayers>, void>({
      query: () => `/v1/regulatory`,
      transformResponse: (response: RegulatoryLayersFromAPI[]) =>
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

// TODO Migrate this middleware.
export const regulatoryLayersErrorLoggerMiddleware: Middleware = store => next => action => {
  if (regulatoryLayersAPI.endpoints.getRegulatoryLayers.matchRejected(action)) {
    store.dispatch(setToast({ message: "Nous n'avons pas pu récupérer les Zones Réglementaires" }))
  }
  if (regulatoryLayersAPI.endpoints.getRegulatoryLayerById.matchRejected(action)) {
    store.dispatch(setToast({ message: "Nous n'avons pas pu récupérer la zone réglementaire" }))
  }

  return next(action)
}

export const { useGetRegulatoryLayerByIdQuery, useGetRegulatoryLayersQuery } = regulatoryLayersAPI

export const getSelectedRegulatoryLayers = createSelector(
  [regulatoryLayersAPI.endpoints.getRegulatoryLayers.select(), getSelectedRegulatoryLayerIds],
  (regulatoryLayers, selectedRegulatoryLayerIds) => {
    const emptyArray = []

    return (
      selectedRegulatoryLayerIds
        .map(id => regulatoryLayers?.data?.entities[id])
        .filter((l): l is RegulatoryLayers => !!l) ?? emptyArray
    )
  }
)

export const getRegulatoryLayerZonesByName = createSelector(
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
)
export const getNumberOfRegulatoryLayerZonesByGroupName = createSelector(
  [getRegulatoryLayerZonesByName, (_, name: string) => name],
  (regulatoryLayerZonesByName, name): number => regulatoryLayerZonesByName[name]?.length ?? 0
)
