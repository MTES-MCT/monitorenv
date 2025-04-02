import { GET_EXTRACTED_AREAS_ERROR_MESSAGE } from '@features/Dashboard/useCases/createDashboard'
import { DELETE_DASHBOARD_ERROR_MESSAGE } from '@features/Dashboard/useCases/deleteDashboard'
import { SAVE_DASHBOARD_ERROR_MESSAGE } from '@features/Dashboard/useCases/saveDashboard'
import { FrontendApiError } from '@libs/FrontendApiError'
import { geoJsonToWKT } from '@utils/geojsonToWKT'

import { monitorenvPrivateApi } from './api'

import type { Dashboard } from '@features/Dashboard/types'
import type { GeoJSON } from 'domain/types/GeoJSON'

const GET_DASHBOARDS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des tableaux de bord"
const GET_DASHBOARD_ERROR_MESSAGE = "Nous n'avons pas pu récupérer le tableau de bord"

export const dashboardsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    delete: build.mutation<void, string>({
      invalidatesTags: [{ id: 'LIST', type: 'Dashboards' }],
      query: id => ({
        method: 'DELETE',
        url: `/v1/dashboards/${id}`
      }),
      transformErrorResponse: response => new FrontendApiError(DELETE_DASHBOARD_ERROR_MESSAGE, response)
    }),
    exportBrief: build.mutation<Dashboard.BriefFileExport, Dashboard.EditableBriefExport>({
      query: brief => ({
        body: brief,
        method: 'POST',
        url: `/v1/dashboards/export-brief`
      })
    }),
    getDashboard: build.query<Dashboard.DashboardFromApi, string>({
      providesTags: (_, __, id) => [{ id, type: 'Dashboards' }],
      query: id => `/v1/dashboards/${id}`,
      transformErrorResponse: response => new FrontendApiError(GET_DASHBOARD_ERROR_MESSAGE, response),
      transformResponse: (response: Dashboard.DashboardFromApi) => response
    }),
    getDashboards: build.query<Dashboard.DashboardFromApi[], void>({
      providesTags: result =>
        result
          ? // successful query
            [...result.map(({ id }) => ({ id, type: 'Dashboards' as const })), { id: 'LIST', type: 'Dashboards' }]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Dashboards', id: 'LIST' }` is invalidated
            [{ id: 'LIST', type: 'Dashboards' }],
      query: () => '/v1/dashboards',
      transformErrorResponse: response => new FrontendApiError(GET_DASHBOARDS_ERROR_MESSAGE, response),
      transformResponse: (response: Dashboard.DashboardFromApi[]) => response
    }),
    getExtratedArea: build.query<Dashboard.ExtractedAreaFromApi, GeoJSON.Geometry>({
      providesTags: ['ExtractArea'],
      query: geometry => `/v1/dashboards/extract?geometry=${geoJsonToWKT(geometry)}`,
      transformErrorResponse: response => new FrontendApiError(GET_EXTRACTED_AREAS_ERROR_MESSAGE, response)
    }),
    save: build.mutation<Dashboard.DashboardFromApi, Dashboard.DashboardToApi>({
      invalidatesTags: (_, __, { id }) => [{ id, type: 'Dashboards' }],
      query: dashboard => ({
        body: dashboard,
        method: 'PUT',
        url: `/v1/dashboards`
      }),
      transformErrorResponse: response => new FrontendApiError(SAVE_DASHBOARD_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetDashboardQuery, useGetDashboardsQuery, useGetExtratedAreaQuery } = dashboardsAPI
