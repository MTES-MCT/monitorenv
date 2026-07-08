import { monitorenvPrivateApi } from './api'
import { FrontendApiError } from '../libs/FrontendApiError'

import type { Facade } from '../domain/entities/facades'

const GET_FACADES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des façades."

export const facadesAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getFacades: builder.query<Facade[], void>({
      query: () => '/v1/facades',
      transformErrorResponse: response => new FrontendApiError(GET_FACADES_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetFacadesQuery } = facadesAPI
