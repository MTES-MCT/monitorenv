import { FrontendApiError } from '@libs/FrontendApiError'
import { createEntityAdapter, type EntityState } from '@reduxjs/toolkit'
import { boundingExtent } from 'ol/extent'

import { monitorenvPrivateApi } from './api'

import type { RegulatoryLayerWithMetadata } from '../domain/entities/regulatory'
import type { Coordinate } from 'ol/coordinate'

const GET_REGULATORY_LAYERS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la/les zones réglementaires"

const RegulatoryAreasAdapter = createEntityAdapter<RegulatoryLayerWithMetadata>()

const regulatoryLayersInitialState = RegulatoryAreasAdapter.getInitialState()

export const regulatoryAreasAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getRegulatoryAreas: builder.query<EntityState<RegulatoryLayerWithMetadata, number>, void>({
      query: () => `/regulatory-areas`,
      transformErrorResponse: response => new FrontendApiError(GET_REGULATORY_LAYERS_ERROR_MESSAGE, response),
      transformResponse: (response: RegulatoryLayerWithMetadata[]) =>
        RegulatoryAreasAdapter.setAll(
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

export const { useGetRegulatoryAreasQuery } = regulatoryAreasAPI
