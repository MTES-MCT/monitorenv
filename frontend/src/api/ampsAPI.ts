import { type EntityState, createEntityAdapter, type Middleware, createSelector } from '@reduxjs/toolkit'
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

export const getAMPsIdsGroupedByName = createSelector([ampsAPI.endpoints.getAMPs.select()], ampsQuery => {
  const ampIdsByName = ampsQuery.data?.ids.reduce((acc, id) => {
    const amp = ampsQuery.data?.entities[id]
    if (amp) {
      acc[amp.name] = [...(acc[amp.name] ?? []), id]
    }

    return acc
  }, {})

  return ampIdsByName
})

export const getNumberOfAMPByGroupName = createSelector(
  [getAMPsIdsGroupedByName, (_, groupName: string) => groupName],
  (ampIdsByName, groupName) => (ampIdsByName && ampIdsByName[groupName].length) ?? 0
)
