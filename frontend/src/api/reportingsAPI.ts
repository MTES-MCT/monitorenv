import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Reporting, ReportingDetailed } from '../domain/entities/reporting'

type ReportingsFilter = {
  reportingSource?: string
  reportingStatus?: string[]
  reportingTypes?: string[]
  seaFronts: string[]
  startedAfterDateTime?: string
  startedBeforeDateTime?: string
}

const getStartDateFilter = startedAfterDateTime =>
  startedAfterDateTime && `startedAfterDateTime=${encodeURIComponent(startedAfterDateTime)}`
const getEndDateFilter = startedBeforeDateTime =>
  startedBeforeDateTime && `startedBeforeDateTime=${encodeURIComponent(startedBeforeDateTime)}`
const getReportingSourceFilter = reportingSource =>
  reportingSource && `reportingSource=${encodeURIComponent(reportingSource)}`
const getReportingStatusFilter = reportingStatus =>
  reportingStatus && reportingStatus?.length > 0 && `reportingStatus=${encodeURIComponent(reportingStatus)}`
const getReportingTypesFilter = reportingTypes =>
  reportingTypes && reportingTypes?.length > 0 && `reportingTypes=${encodeURIComponent(reportingTypes)}`
const getSeaFrontsFilter = seaFronts =>
  seaFronts && seaFronts?.length > 0 && `seaFronts=${encodeURIComponent(seaFronts)}`

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
    getReportings: build.query<ReportingDetailed[], ReportingsFilter | void>({
      providesTags: result =>
        result
          ? // successful query
            [...result.map(({ id }) => ({ id, type: 'Reportings' as const })), { id: 'LIST', type: 'Reportings' }]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Reportings', id: 'LIST' }` is invalidated
            [{ id: 'LIST', type: 'Reportings' }],
      query: filter =>
        [
          'reportings?',
          getStartDateFilter(filter?.startedAfterDateTime),
          getEndDateFilter(filter?.startedBeforeDateTime),
          getReportingSourceFilter(filter?.reportingSource),
          getReportingStatusFilter(filter?.reportingStatus),
          getReportingTypesFilter(filter?.reportingTypes),
          getSeaFrontsFilter(filter?.seaFronts)
        ]
          .filter(v => v)
          .join('&')
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
