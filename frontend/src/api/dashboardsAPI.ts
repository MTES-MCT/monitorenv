import { FrontendApiError } from '@libs/FrontendApiError'
import { geoJsonToWKT } from '@utils/geojsonToWKT'

import { monitorenvPrivateApi } from './api'

import type { Dashboard } from 'domain/entities/dashboard'
import type { GeoJSON } from 'domain/types/GeoJSON'

const GET_EXTRACTED_AREAS_ERROR_MESSAGE = "Nous n'avons pas pu créer le tableau de bord"

export const dashboardsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getExtratedArea: build.query<Dashboard.ExtractedArea, GeoJSON.Geometry>({
      query: geometry => `/v1/dashboard/extract?geometry=${geoJsonToWKT(geometry)}`,
      transformErrorResponse: response => new FrontendApiError(GET_EXTRACTED_AREAS_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetExtratedAreaQuery } = dashboardsAPI
