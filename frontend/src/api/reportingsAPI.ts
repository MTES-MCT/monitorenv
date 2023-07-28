import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Reporting } from '../domain/entities/reporting'

export const reportingsAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    createReporting: build.mutation<Reporting, Partial<Reporting>>({
      invalidatesTags: [{ id: 'LIST', type: 'Reportings' }],
      query: reporting => ({
        body: reporting,
        method: 'PUT',
        url: 'reportings'
      })
    }),
    deleteReporting: build.mutation({
      invalidatesTags: [{ id: 'LIST', type: 'Reportings' }],
      query: ({ id }) => ({
        method: 'DELETE',
        url: `reportings/${id}`
      })
    }),
    getReporting: build.query<Reporting, number>({
      providesTags: (_, __, id) => [{ id, type: 'Reportings' }],
      query: id => `reportings/${id}`
    }),
    getReportings: build.query<Reporting[], void>({
      providesTags: result =>
        result
          ? // successful query
            [...result.map(({ id }) => ({ id, type: 'Reportings' as const })), { id: 'LIST', type: 'Reportings' }]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Reportings', id: 'LIST' }` is invalidated
            [{ id: 'LIST', type: 'Reportings' }],
      query: () => 'reportings'
    }),
    updateReporting: build.mutation<Reporting, Reporting>({
      invalidatesTags: (_, __, { id }) => [
        { id, type: 'Reportings' },
        { id: 'LIST', type: 'Reportings' }
      ],

      query: ({ id, ...patch }) => ({
        body: { id, ...patch },
        method: 'PUT',
        url: `reportings/${id}`
      })
    })
  }),
  reducerPath: 'reportings',
  tagTypes: ['Reportings']
})

export const {
  useCreateReportingMutation,
  useDeleteReportingMutation,
  useGetReportingQuery,
  useGetReportingsQuery,
  useUpdateReportingMutation
} = reportingsAPI
