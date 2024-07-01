import { monitorenvPrivateApi } from './api'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export const vigilanceAreasAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    createVigilanceArea: build.mutation<VigilanceArea.VigilanceArea, VigilanceArea.VigilanceArea>({
      query: vigilanceArea => ({
        body: vigilanceArea,
        method: 'PUT',
        url: `/v1/vigilance_areas`
      })
    }),
    deleteVigilanceArea: build.mutation<void, number>({
      invalidatesTags: [{ id: 'LIST', type: 'VigilanceAreas' }],
      query: id => ({
        method: 'DELETE',
        url: `/v1/vigilance_areas/${id}`
      })
    }),
    getVigilanceArea: build.query<VigilanceArea.VigilanceArea, number>({
      providesTags: (_, __, id) => [{ id, type: 'VigilanceAreas' }],
      query: id => `/v1/vigilance_areas/${id}`
    }),
    getVigilanceAreas: build.query<Array<VigilanceArea.VigilanceArea>, void>({
      providesTags: () => [{ id: 'LIST', type: 'VigilanceAreas' } as const],
      query: () => `/v1/vigilance_areas`
    }),
    updateVigilanceArea: build.mutation<VigilanceArea.VigilanceArea, VigilanceArea.VigilanceArea>({
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
  useGetVigilanceAreaQuery,
  useGetVigilanceAreasQuery,
  useUpdateVigilanceAreaMutation
} = vigilanceAreasAPI
