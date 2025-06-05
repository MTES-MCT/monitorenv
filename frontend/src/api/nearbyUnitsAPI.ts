import { FrontendApiError } from '@libs/FrontendApiError'
import { geoJsonToWKT } from '@utils/geojsonToWKT'

import { monitorenvPrivateApi } from './api'

import type { LegacyControlUnit } from '../domain/entities/legacyControlUnit'
import type { Mission } from '../domain/entities/missions'
import type { GeoJSON } from '../domain/types/GeoJSON'

const GET_CONTROL_UNITS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des unités de contrôle."

type GetNearbyUnitsParams = {
  geometry: GeoJSON.Geometry
  startedAfter?: string
  startedBefore?: string
}
export const privateControlUnitsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getNearbyUnits: builder.query<NearbyUnit[], GetNearbyUnitsParams>({
      query: ({ geometry, startedAfter, startedBefore }) =>
        `/v1/control_units/nearby?geometry=${geoJsonToWKT(geometry)}${
          startedAfter ? `&startedAfter=${encodeURIComponent(startedAfter)}` : ''
        }${startedBefore ? `&startedBefore=${encodeURIComponent(startedBefore)}` : ''}`,
      transformErrorResponse: response => new FrontendApiError(GET_CONTROL_UNITS_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetNearbyUnitsQuery } = privateControlUnitsAPI

export type NearbyUnit = {
  controlUnit: LegacyControlUnit
  missions: Mission[]
}
