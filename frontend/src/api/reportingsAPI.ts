import { EntityState, createEntityAdapter } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Reporting, ReportingDetailed } from '../domain/entities/reporting'

type ReportingsFilter = {
  reportingSourceType?: string[]
  reportingType: string | undefined
  seaFronts: string[]
  startedAfterDateTime?: string
  startedBeforeDateTime?: string
}

const getStartDateFilter = startedAfterDateTime =>
  startedAfterDateTime && `startedAfterDateTime=${encodeURIComponent(startedAfterDateTime)}`
const getEndDateFilter = startedBeforeDateTime =>
  startedBeforeDateTime && `startedBeforeDateTime=${encodeURIComponent(startedBeforeDateTime)}`
const getReportingSourcesTypeFilter = reportingSourceType =>
  reportingSourceType &&
  reportingSourceType?.length > 0 &&
  `reportingSourcesType=${encodeURIComponent(reportingSourceType)}`
const getReportingTypeFilter = reportingType =>
  reportingType && reportingType?.length > 0 && `reportingType=${encodeURIComponent(reportingType)}`
const getSeaFrontsFilter = seaFronts =>
  seaFronts && seaFronts?.length > 0 && `seaFronts=${encodeURIComponent(seaFronts)}`

const ReportingAdapter = createEntityAdapter<ReportingDetailed>()
const initialState = ReportingAdapter.getInitialState()

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
    getReportings: build.query<EntityState<ReportingDetailed>, ReportingsFilter | void>({
      providesTags: result =>
        result?.ids
          ? [{ id: 'LIST', type: 'Reportings' }, ...result.ids.map(id => ({ id, type: 'Reportings' as const }))]
          : [{ id: 'LIST', type: 'Reportings' }],
      query: filter =>
        [
          'reportings?',
          getStartDateFilter(filter?.startedAfterDateTime),
          getEndDateFilter(filter?.startedBeforeDateTime),
          getReportingSourcesTypeFilter(filter?.reportingSourceType),
          getReportingTypeFilter(filter?.reportingType),
          getSeaFrontsFilter(filter?.seaFronts)
        ]
          .filter(v => v)
          .join('&'),
      transformResponse: (response: ReportingDetailed[]) => ReportingAdapter.setAll(initialState, response)
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

export const reportingsBySemaphoreId = (state: any, semaphoreId: number) => {
  const reportings = ReportingAdapter.getSelectors().selectAll(state)

  return reportings.filter(reporting => reporting.semaphoreId === semaphoreId)
}
