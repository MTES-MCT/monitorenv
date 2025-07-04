import { createEntityAdapter, type EntityState } from '@reduxjs/toolkit'

import { monitorenvPrivateApi } from './api'
import { getQueryString } from '../utils/getQueryStringFormatted'

import type { Reporting } from '../domain/entities/reporting'

type ReportingsFilter = {
  isAttachedToMission?: boolean | undefined
  reportingType?: string | undefined
  seaFronts?: string[]
  searchQuery?: string
  sourcesType?: string[]
  startedAfterDateTime?: string
  startedBeforeDateTime?: string
  status?: string[]
  targetTypes?: string[]
}

const ReportingAdapter = createEntityAdapter<Reporting>()
const initialState = ReportingAdapter.getInitialState()

export const reportingsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    archiveReportings: build.mutation({
      invalidatesTags: (_, __, results) =>
        results?.ids
          ? [{ id: 'LIST', type: 'Reportings' }, ...results.ids.map(id => ({ id, type: 'Reportings' as const }))]
          : [{ id: 'LIST', type: 'Reportings' }],
      query: ({ ids }: { ids: number[] }) => ({
        body: ids,
        method: 'PUT',
        url: `/v1/reportings/archive`
      })
    }),
    createReporting: build.mutation<Partial<Reporting>, Partial<Reporting>>({
      invalidatesTags: (_, __, { missionId }) => [
        { id: 'LIST', type: 'Reportings' },
        { id: 'LIST', type: 'Missions' },
        { id: missionId, type: 'Missions' },
        'ExtractArea',
        'Suspicions'
      ],
      query: reporting => ({
        body: reporting,
        method: 'PUT',
        url: '/v1/reportings'
      })
    }),
    deleteReporting: build.mutation({
      invalidatesTags: [{ id: 'LIST', type: 'Reportings' }, 'ExtractArea', 'Suspicions'],
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/v1/reportings/${id}`
      })
    }),
    deleteReportings: build.mutation({
      invalidatesTags: (_, __, results) =>
        results?.ids
          ? [{ id: 'LIST', type: 'Reportings' }, ...results.ids.map(id => ({ id, type: 'Reportings' as const }))]
          : [{ id: 'LIST', type: 'Reportings' }, 'ExtractArea', 'Suspicions'],
      query: ({ ids }: { ids: number[] }) => ({
        body: ids,
        method: 'PUT',
        url: `/v1/reportings/delete`
      })
    }),
    getReporting: build.query<Reporting, number>({
      providesTags: (_, __, id) => [{ id, type: 'Reportings' }],
      query: id => `/v1/reportings/${id}`
    }),
    getReportings: build.query<EntityState<Reporting, number | string>, ReportingsFilter | void>({
      providesTags: result =>
        result?.ids
          ? [{ id: 'LIST', type: 'Reportings' }, ...result.ids.map(id => ({ id, type: 'Reportings' as const }))]
          : [{ id: 'LIST', type: 'Reportings' }],
      query: filters => getQueryString('/v1/reportings', filters),
      transformResponse: (response: Reporting[]) => ReportingAdapter.setAll(initialState, response)
    }),
    getReportingsByIds: build.query<EntityState<Reporting, number | string>, number[]>({
      providesTags: result =>
        result?.ids
          ? [{ id: 'LIST', type: 'Reportings' }, ...result.ids.map(id => ({ id, type: 'Reportings' as const }))]
          : [{ id: 'LIST', type: 'Reportings' }],
      query: ids => ({ body: ids, method: 'POST', url: '/v1/reportings' }),
      transformResponse: (response: Reporting[]) => ReportingAdapter.setAll(initialState, response)
    }),
    updateReporting: build.mutation<Reporting, Partial<Reporting>>({
      invalidatesTags: (_, __, { id, missionId }) => [
        { id, type: 'Reportings' },
        { id: 'LIST', type: 'Reportings' },
        { id: 'LIST', type: 'Missions' },
        { id: missionId, type: 'Missions' },
        'ExtractArea',
        'Suspicions'
      ],
      query: ({ id, ...patch }) => ({
        body: { id, ...patch },
        method: 'PUT',
        url: `/v1/reportings/${id}`
      })
    })
  })
})

export const {
  useCreateReportingMutation,
  useDeleteReportingMutation,
  useGetReportingQuery,
  useGetReportingsByIdsQuery,
  useGetReportingsQuery,
  useUpdateReportingMutation
} = reportingsAPI

export const reportingsBySemaphoreId = (state: any, semaphoreId: number) => {
  const reportings = ReportingAdapter.getSelectors().selectAll(state)

  return reportings.filter(reporting =>
    reporting.reportingSources.some(reportingSource => reportingSource.semaphoreId === semaphoreId)
  )
}
