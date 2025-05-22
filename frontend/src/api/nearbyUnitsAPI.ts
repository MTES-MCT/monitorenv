import { FrontendApiError } from '@libs/FrontendApiError'
import { geoJsonToWKT } from '@utils/geojsonToWKT'

import { monitorenvPrivateApi } from './api'

import type { GeoJSON } from '../domain/types/GeoJSON'
import type { NearbyUnit } from '@features/Dashboard/components/DashboardForm/NearbyUnits/types'

const GET_CONTROL_UNITS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des unités de contrôle."

type GetNearbyUnitsParams = {
  from?: string
  geometry: GeoJSON.Geometry
  to?: string
}
export const privateControlUnitsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getNearbyUnits: builder.query<NearbyUnit[], GetNearbyUnitsParams>({
      providesTags: () => [{ id: 'LIST', type: 'NearbyUnits' }],
      query: ({ from, geometry, to }) =>
        `/v1/control_units/nearby?geometry=${geoJsonToWKT(geometry)}${from ? `&from=${encodeURIComponent(from)}` : ''}${
          to ? `&to=${encodeURIComponent(to)}` : ''
        }`,
      transformErrorResponse: response => new FrontendApiError(GET_CONTROL_UNITS_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetNearbyUnitsQuery } = privateControlUnitsAPI
