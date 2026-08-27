import { FrontendApiError } from '@libs/FrontendApiError'
import { geoJsonToWKT } from '@utils/geojsonToWKT'

import { monitorenvPrivateApi } from './api'

import type { GeoJSON } from '../domain/types/GeoJSON'

const GET_SEA_FRONTS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des façades."
const COMPUTE_SEA_FRONTS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer calculer la façade."
type SeaFront = { seaFront: String }

export const seaFrontsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    computeSeaFrontFromGeometry: builder.query<SeaFront | undefined, GeoJSON.MultiPolygon>({
      query: geometry => `/v1/sea-fronts/compute?geometry=${geoJsonToWKT(geometry)}`,
      transformErrorResponse: response => new FrontendApiError(COMPUTE_SEA_FRONTS_ERROR_MESSAGE, response)
    }),
    getSeaFronts: builder.query<string[], void>({
      query: () => '/v1/sea-fronts',
      transformErrorResponse: response => new FrontendApiError(GET_SEA_FRONTS_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetSeaFrontsQuery, useLazyComputeSeaFrontFromGeometryQuery } = seaFrontsAPI
