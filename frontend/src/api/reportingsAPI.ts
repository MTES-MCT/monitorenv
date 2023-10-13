import { type EntityState, createEntityAdapter } from '@reduxjs/toolkit'

import { monitorenvPrivateApi } from './api'
import { getQueryString } from '../utils/getQueryStringFormatted'

import type { Reporting, ReportingDetailed } from '../domain/entities/reporting'

type ReportingsFilter = {
  reportingType?: string | undefined
  seaFronts?: string[]
  sourcesType?: string[]
  startedAfterDateTime?: string
  startedBeforeDateTime?: string
  status?: string[]
}

const ReportingAdapter = createEntityAdapter<ReportingDetailed>()
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
        url: `reportings/archive`
      })
    }),
    createReporting: build.mutation<Partial<Reporting>, Partial<Reporting>>({
      invalidatesTags: (_, __, { missionId }) => [
        { id: 'LIST', type: 'Reportings' },
        { id: 'LIST', type: 'Missions' },
        { id: missionId, type: 'Missions' }
      ],
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
    deleteReportings: build.mutation({
      invalidatesTags: (_, __, results) =>
        results?.ids
          ? [{ id: 'LIST', type: 'Reportings' }, ...results.ids.map(id => ({ id, type: 'Reportings' as const }))]
          : [{ id: 'LIST', type: 'Reportings' }],
      query: ({ ids }: { ids: number[] }) => ({
        body: ids,
        method: 'PUT',
        url: `reportings/delete`
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
      query: filters => getQueryString('reportings', filters),
      transformResponse: (response: ReportingDetailed[]) => ReportingAdapter.setAll(initialState, response)
    }),
    updateReporting: build.mutation<Reporting, Partial<Reporting>>({
      invalidatesTags: (_, __, { id, missionId }) => [
        { id, type: 'Reportings' },
        { id: 'LIST', type: 'Reportings' },
        { id: 'LIST', type: 'Missions' },
        { id: missionId, type: 'Missions' }
      ],
      query: ({ id, ...patch }) => ({
        body: { id, ...patch },
        method: 'PUT',
        url: `reportings/${id}`
      })
    })
  })
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
