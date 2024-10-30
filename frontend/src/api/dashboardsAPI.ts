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
    getDashboard: build.query<Dashboard.DashboardFromApi, string>({
      query: id => `/v1/dashboards/${id}`,
      transformErrorResponse: response => new FrontendApiError(GET_DASHBOARD_ERROR_MESSAGE, response),
      transformResponse: (response: Dashboard.DashboardFromApi) => response
    }),
    getDashboards: build.query<Dashboard.Dashboard[], void>({
      query: () => '/v1/dashboards',
      transformErrorResponse: response => new FrontendApiError(GET_DASHBOARDS_ERROR_MESSAGE, response),
      transformResponse: (response: Dashboard.Dashboard[]) => response
    }),
    getExtratedArea: build.query<Dashboard.ExtractedAreaFromApi, GeoJSON.Geometry>({
      query: geometry => `/v1/dashboards/extract?geometry=${geoJsonToWKT(geometry)}`,
      transformErrorResponse: response => new FrontendApiError(GET_EXTRACTED_AREAS_ERROR_MESSAGE, response)
    }),
    save: build.query<Dashboard.DashboardFromApi, Dashboard.DashboardToApi>({
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
