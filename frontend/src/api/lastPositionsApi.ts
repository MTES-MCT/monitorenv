import { monitorenvPrivateApi } from '@api/api'
import { FrontendApiError } from '@libs/FrontendApiError'

import type { Vessel } from '@features/Vessel/types'

const GET_LAST_POSITIONS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les dernières positions de ce navire."

export const lastPositionsApi = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getLastPositions: builder.query<Vessel.LastPosition[], number>({
      query: id => `/v1/last_positions/${id}`,
      transformErrorResponse: response => new FrontendApiError(GET_LAST_POSITIONS_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetLastPositionsQuery } = lastPositionsApi
