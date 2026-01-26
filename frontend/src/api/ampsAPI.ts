import { getExtentOfLayersGroup } from '@features/layersSelector/utils/getExtentOfLayersGroup'
import { FrontendApiError } from '@libs/FrontendApiError'
import { createEntityAdapter, createSelector, type EntityId, type EntityState } from '@reduxjs/toolkit'
import { boundingExtent, createEmpty, type Extent } from 'ol/extent'
import { createCachedSelector } from 're-reselect'

import { monitorenvPrivateApi } from './api'

import type { AMP, AMPFromAPI } from '../domain/entities/AMPs'
import type { Coordinate } from 'ol/coordinate'

const AMPAdapter = createEntityAdapter<AMP>()

const initialState = AMPAdapter.getInitialState()

const GET_AMP_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les Zones AMP"

type AmpQueryOption = {
  bbox?: Extent | undefined
  withGeometry?: boolean
  zoom?: number | undefined
}

export const ampsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getAMP: builder.query<AMP, number>({
      query: id => `/v1/amps/${id}`,
      transformErrorResponse: response => new FrontendApiError(GET_AMP_ERROR_MESSAGE, response),
      transformResponse: (response: AMPFromAPI) => {
        const bbox = boundingExtent((response.geom?.coordinates ?? []).flat().flat() as Coordinate[])

        return {
          ...response,
          bbox
        }
      }
    }),
    getAMPs: builder.query<EntityState<AMP, number>, AmpQueryOption>({
      query: ({ bbox, withGeometry, zoom } = { bbox: undefined, withGeometry: false, zoom: undefined }) =>
        `/v1/amps?withGeometry=${withGeometry}${withGeometry && bbox ? `&bbox=${bbox}` : ''}${
          withGeometry && zoom ? `&zoom=${zoom}` : ''
        }`,
      transformErrorResponse: response => new FrontendApiError(GET_AMP_ERROR_MESSAGE, response),
      transformResponse: (response: AMPFromAPI[]) =>
        AMPAdapter.setAll(
          initialState,
          response.map(amp => {
            const bbox = boundingExtent((amp.geom?.coordinates ?? []).flat().flat() as Coordinate[])

            return {
              ...amp,
              bbox
            }
          })
        )
    }),
    getAmpsByIds: builder.query<AMP[], number[]>({
      query: ids => ({ body: ids, method: 'POST', url: '/v1/amps' }),
      transformResponse: (response: AMP[]) =>
        response.map(amp => {
          const bbox = boundingExtent((amp.geom?.coordinates ?? []).flat().flat() as Coordinate[])

          return {
            ...amp,
            bbox
          }
        })
    })
  })
})

export const { useGetAMPQuery, useGetAmpsByIdsQuery, useGetAMPsQuery } = ampsAPI

export const getAMPsIdsGroupedByName = createSelector(
  [ampsAPI.endpoints.getAMPs.select({ withGeometry: false })],
  ampsQuery => {
    const ampIdsByName = ampsQuery.data?.ids.reduce((acc, id) => {
      const amp = ampsQuery.data?.entities[id]
      if (amp) {
        acc[amp.name] = [...(acc[amp.name] ?? []), id]
      }

      return acc
    }, {} as Record<string, EntityId[]>)

    return ampIdsByName
  }
)

export const getAMPsIdsByGroupName = createCachedSelector(
  [getAMPsIdsGroupedByName, (_, groupName: string) => groupName],
  (ampIdsByName, groupName) => ampIdsByName && ampIdsByName[groupName]
)((_, groupName: string) => groupName)

export const getNumberOfAMPByGroupName = createCachedSelector(
  [getAMPsIdsGroupedByName, (_, groupName: string) => groupName],
  (ampIdsByName, groupName) => (ampIdsByName && ampIdsByName[groupName]?.length) ?? 0
)((_, groupName: string) => groupName)

export const getAmpsByIds = createSelector(
  // FIXME: replace with endpoint findByIds
  [ampsAPI.endpoints.getAMPs.select({ withGeometry: false }), (_, ids: number[]) => ids],
  ({ data }, ids) => Object.values(data?.entities ?? []).filter(amp => ids.includes(amp.id))
)

export const getExtentOfAMPLayersGroupByGroupName = createCachedSelector(
  // FIXME: replace with endpoint findByIds
  [ampsAPI.endpoints.getAMPs.select({ withGeometry: false }), getAMPsIdsByGroupName],
  (ampsQuery, ampIdsByName) => {
    const amps = ampIdsByName?.map(id => ampsQuery.data?.entities[id]).filter((amp): amp is AMP => !!amp)
    if (amps) {
      return getExtentOfLayersGroup(amps)
    }

    return createEmpty()
  }
)((_, groupName: string) => groupName)
