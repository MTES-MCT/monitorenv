import { type ControlUnit } from '@mtes-mct/monitor-ui'
import { geoJsonToWKT } from '@utils/geojsonToWKT'

import { monitorenvPrivateApi } from './api'
import { FrontendApiError } from '../libs/FrontendApiError'

import type { Mission } from '../domain/entities/missions'
import type { GeoJSON } from '../domain/types/GeoJSON'

const GET_CONTROL_UNITS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des unités de contrôle."

export const privateControlUnitsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getNearbyUnits: builder.query<NearbyUnits[], GeoJSON.Geometry>({
      query: geometry => `/v1/control_units/nearby?geometry=${geoJsonToWKT(geometry)}`,
      transformErrorResponse: response => new FrontendApiError(GET_CONTROL_UNITS_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetNearbyUnitsQuery } = privateControlUnitsAPI

export type NearbyUnits = {
  controlUnits: ControlUnit.ControlUnit[]
  missions: Mission[]
}
