import { GET_EXTRACTED_AREAS_ERROR_MESSAGE } from '@features/Dashboard/useCases/createDashboard'
import { SAVE_DASHBOARD_ERROR_MESSAGE } from '@features/Dashboard/useCases/saveDashboard'
import { FrontendApiError } from '@libs/FrontendApiError'
import { geoJsonToWKT } from '@utils/geojsonToWKT'

import { monitorenvPrivateApi } from './api'

import type { Dashboard } from '@features/Dashboard/types'
import type { GeoJSON } from 'domain/types/GeoJSON'

export const dashboardsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getExtratedArea: build.query<Dashboard.ExtractedArea, GeoJSON.Geometry>({
      query: geometry => `/v1/dashboards/extract?geometry=${geoJsonToWKT(geometry)}`,
      transformErrorResponse: response => new FrontendApiError(GET_EXTRACTED_AREAS_ERROR_MESSAGE, response)
    }),
    save: build.query<Dashboard.DashboardFromApi, Dashboard.DashboardToApi>({
      query: mission => ({
        body: mission,
        method: 'PUT',
        url: `/v1/dashboards`
      }),
      transformErrorResponse: response => new FrontendApiError(SAVE_DASHBOARD_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetExtratedAreaQuery } = dashboardsAPI
