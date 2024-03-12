import { FrontendApiError } from '@libs/FrontendApiError'
import { type EntityState, createEntityAdapter, createSelector, type EntityId } from '@reduxjs/toolkit'
import { boundingExtent } from 'ol/extent'

import { monitorenvPrivateApi } from './api'

import type { AMP, AMPFromAPI } from '../domain/entities/AMPs'
import type { Coordinate } from 'ol/coordinate'

const AMPAdapter = createEntityAdapter<AMP>()

const initialState = AMPAdapter.getInitialState()

const GET_AMP_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les Zones AMP"

export const ampsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getAMPs: builder.query<EntityState<AMP>, void>({
      query: () => `/v1/amps`,
      transformErrorResponse: response => new FrontendApiError(GET_AMP_ERROR_MESSAGE, response),
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

export const { useGetAMPsQuery } = ampsAPI

export const getAMPsIdsGroupedByName = createSelector([ampsAPI.endpoints.getAMPs.select()], ampsQuery => {
  const ampIdsByName = ampsQuery.data?.ids.reduce((acc, id) => {
    const amp = ampsQuery.data?.entities[id]
    if (amp) {
      acc[amp.name] = [...(acc[amp.name] ?? []), id]
    }

    return acc
  }, {} as Record<string, EntityId[]>)

  return ampIdsByName
})

export const getNumberOfAMPByGroupName = createSelector(
  [getAMPsIdsGroupedByName, (_, groupName: string) => groupName],
  (ampIdsByName, groupName) => (ampIdsByName && ampIdsByName[groupName]?.length) ?? 0
)
