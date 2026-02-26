import { FrontendApiError } from '@libs/FrontendApiError'

import { monitorenvPrivateApi } from './api'

import type { Vessel } from '@features/Vessel/types'

const GET_POSITIONS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les positions de ce navire."

type PositionsFilters = {
  from: string
  mmsi: string
  to: string
}

export const positionsApi = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getPositions: builder.query<Vessel.Position[], PositionsFilters>({
      query: ({ from, mmsi, to }) =>
        `/v1/positions/${mmsi}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
      transformErrorResponse: response => new FrontendApiError(GET_POSITIONS_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetPositionsQuery } = positionsApi
