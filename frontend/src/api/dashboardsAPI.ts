import { FrontendApiError } from '@libs/FrontendApiError'
import { WKT } from 'ol/format'

import { monitorenvPrivateApi } from './api'

import type { Dashboard } from 'domain/entities/dashboard'
import type { GeoJSON } from 'domain/types/GeoJSON'

export const dashboardsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getExtratedArea: build.query<Dashboard.ExtractedArea, GeoJSON.Geometry>({
      query: geometry => `/v1/dashboard/extract?geometry=${geometry}`,
      // TODO: créer erreur fonctionnelle
      transformErrorResponse: response => new FrontendApiError('', response)
    })
  })
})

export const { useGetExtratedAreaQuery } = dashboardsAPI
