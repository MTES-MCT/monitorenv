import { monitorenvPrivateApi } from './api'
import { FrontendApiError } from '../libs/FrontendApiError'

import type { SeaFront } from '../domain/entities/facades'

const GET_SEA_FRONTS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des façades."

export const seaFrontsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getSeaFronts: builder.query<SeaFront[], void>({
      query: () => '/v1/sea-fronts',
      transformErrorResponse: response => new FrontendApiError(GET_SEA_FRONTS_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetSeaFrontsQuery } = seaFrontsAPI
