import { FrontendApiError } from '@libs/FrontendApiError'

import { monitorenvPrivateApi } from './api'

const GET_SPECIES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des espèces."

type Specy = {
  code: string
  id: number
  name: string
}
export const speciesAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getSpecies: builder.query<Specy[], void>({
      query: () => '/v1/species',
      transformErrorResponse: response => new FrontendApiError(GET_SPECIES_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetSpeciesQuery } = speciesAPI
