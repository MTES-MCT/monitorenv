import { type EntityState, createEntityAdapter, type Middleware } from '@reduxjs/toolkit'
import { boundingExtent } from 'ol/extent'

import { monitorenvPrivateApi } from './api'
import { setToast } from '../domain/shared_slices/Global'

import type { AMP, AMPFromAPI } from '../domain/entities/AMPs'
import type { Coordinate } from 'ol/coordinate'

const AMPAdapter = createEntityAdapter<AMP>()

const initialState = AMPAdapter.getInitialState()

export const ampsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getAMPs: builder.query<EntityState<AMP>, void>({
      query: () => `/v1/amps`,
      transformResponse: (response: AMPFromAPI[]) =>
        AMPAdapter.setAll(
          initialState,
          response.map(amp => {
            const bbox = boundingExtent(amp.geom.coordinates.flat().flat() as Coordinate[])

            return {
              ...amp,
              bbox
            }
          })
        )
    })
  })
})

// TODO Migrate this middleware.
export const ampsErrorLoggerMiddleware: Middleware = store => next => action => {
  if (ampsAPI.endpoints.getAMPs.matchRejected(action)) {
    store.dispatch(setToast({ message: "Nous n'avons pas pu récupérer les Zones AMP" }))
  }

  return next(action)
}

export const { useGetAMPsQuery } = ampsAPI
