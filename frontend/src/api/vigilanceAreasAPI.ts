import { createEntityAdapter, createSelector, type EntityState } from '@reduxjs/toolkit'
import { boundingExtent } from 'ol/extent'

import { monitorenvPrivateApi } from './api'

import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { Coordinate } from 'ol/coordinate'

const VigilanceAreaLayersAdapter = createEntityAdapter<VigilanceArea.VigilanceAreaLayer>()

const vigilanceAreaLayersInitialState = VigilanceAreaLayersAdapter.getInitialState()

export const vigilanceAreasAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    createVigilanceArea: build.mutation<VigilanceArea.VigilanceArea, VigilanceArea.VigilanceArea>({
      invalidatesTags: [{ id: 'LIST', type: 'VigilanceAreas' }, 'ExtractArea'],
      query: vigilanceArea => ({
        body: vigilanceArea,
        method: 'PUT',
        url: `/v1/vigilance_areas`
      })
    }),
    deleteVigilanceArea: build.mutation<void, number>({
      invalidatesTags: [{ id: 'LIST', type: 'VigilanceAreas' }, 'ExtractArea'],
      query: id => ({
        method: 'DELETE',
        url: `/v1/vigilance_areas/${id}`
      })
    }),
    getTrigrams: build.query<string[], void>({
      query: () => '/v1/vigilance_areas/trigrams'
    }),
    getVigilanceArea: build.query<VigilanceArea.VigilanceArea, number>({
      providesTags: (_, __, id) => [{ id, type: 'VigilanceAreas' }],
      query: id => `/v1/vigilance_areas/${id}`
    }),
    getVigilanceAreas: build.query<EntityState<VigilanceArea.VigilanceAreaLayer, number>, void>({
      providesTags: () => [{ id: 'LIST', type: 'VigilanceAreas' } as const],
      query: () => '/v1/vigilance_areas',
      transformResponse: (response: VigilanceArea.VigilanceAreaLayer[]) =>
        VigilanceAreaLayersAdapter.setAll(
          vigilanceAreaLayersInitialState,
          response.map(vigilanceAreaLayer => {
            const bbox = vigilanceAreaLayer.geom?.coordinates
              ? boundingExtent(vigilanceAreaLayer.geom?.coordinates?.flat().flat() as Coordinate[])
              : []

            return {
              ...vigilanceAreaLayer,
              bbox
            }
          })
        )
    }),
    getVigilanceAreasByIds: build.query<VigilanceArea.VigilanceArea[], number[]>({
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ id, type: 'VigilanceAreas' as const })),
              { id: 'LIST', type: 'VigilanceAreas' }
            ]
          : [{ id: 'LIST', type: 'VigilanceAreas' }],
      query: ids => ({ body: ids, method: 'POST', url: '/v1/vigilance_areas' })
    }),

    updateVigilanceArea: build.mutation<VigilanceArea.VigilanceArea, VigilanceArea.VigilanceArea>({
      invalidatesTags: (_, __, { id }) => [
        { id: 'LIST', type: 'VigilanceAreas' },
        { id, type: 'VigilanceAreas' },
        'ExtractArea'
      ],
      query: ({ id, ...patch }) => ({
        body: { id, ...patch },
        method: 'PUT',
        url: `/v1/vigilance_areas/${id}`
      })
    })
  })
})

export const {
  useCreateVigilanceAreaMutation,
  useGetTrigramsQuery,
  useGetVigilanceAreaQuery,
  useGetVigilanceAreasByIdsQuery,
  useGetVigilanceAreasQuery,
  useUpdateVigilanceAreaMutation
} = vigilanceAreasAPI
export const getVigilanceAreasByIds = createSelector(
  [vigilanceAreasAPI.endpoints.getVigilanceAreas.select(), (_, ids: number[]) => ids],
  ({ data }, ids) => Object.values(data?.entities ?? []).filter(vigilanceArea => ids.includes(vigilanceArea.id))
)
