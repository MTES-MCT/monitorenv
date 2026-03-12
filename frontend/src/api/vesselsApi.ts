import { monitorenvPrivateApi } from '@api/api'
import { FrontendApiError } from '@libs/FrontendApiError'
import { getQueryString } from '@utils/getQueryStringFormatted'

import type { Vessel } from '@features/Vessel/types'

const GET_VESSEL_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les informations de ce navire."
const SEARCH_VESSELS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les navires correspondants à cette recherche."

type VesselId = {
  batchId: number | undefined
  rowNumber: number | undefined
  shipId: number | undefined
}

export const vesselsApi = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getVessel: builder.query<Vessel.Vessel, VesselId>({
      query: ({ batchId, rowNumber, shipId }) => getQueryString(`/v1/vessels/${shipId}`, { batchId, rowNumber }),
      transformErrorResponse: response => new FrontendApiError(GET_VESSEL_ERROR_MESSAGE, response)
    }),
    searchVessels: builder.query<Vessel.Identity[], Vessel.ApiSearchFilter>({
      query: filter => `/v1/vessels/search?searched=${filter.searched}`,
      transformErrorResponse: response => new FrontendApiError(SEARCH_VESSELS_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetVesselQuery, useLazyGetVesselQuery, useSearchVesselsQuery } = vesselsApi
