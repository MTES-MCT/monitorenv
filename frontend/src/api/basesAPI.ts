import { monitorenvPublicApi } from './api'
import { DELETE_GENERIC_ERROR_MESSAGE } from './constants'
import { ApiErrorCode, type BackendApiBooleanResponse } from './types'
import { FrontendApiError } from '../libs/FrontendApiError'
import { newUserError } from '../libs/UserError'

import type { Base } from '../domain/entities/base'

const CAN_DELETE_BASE_ERROR_MESSAGE = "Nous n'avons pas pu vérifier si cette base est supprimable."
export const DELETE_BASE_ERROR_MESSAGE =
  "Cette base est rattachée à des moyens. Veuillez l'en détacher avant de la supprimer ou bien l'archiver."
const GET_BASE_ERROR_MESSAGE = "Nous n'avons pas pu récupérer cette base."
const GET_BASES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des bases."

export const basesAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    canDeleteBase: builder.query<boolean, number>({
      query: baseId => `/v1/bases/${baseId}/can_delete`,
      transformErrorResponse: response => new FrontendApiError(CAN_DELETE_BASE_ERROR_MESSAGE, response),
      transformResponse: (response: BackendApiBooleanResponse) => response.value
    }),

    createBase: builder.mutation<void, Base.BaseData>({
      invalidatesTags: () => [{ type: 'Bases' }],
      query: newBaseData => ({
        body: newBaseData,
        method: 'POST',
        url: `/v1/bases`
      })
    }),

    deleteBase: builder.mutation<void, number>({
      invalidatesTags: () => [{ type: 'Bases' }],
      query: baseId => ({
        method: 'DELETE',
        url: `/v1/bases/${baseId}`
      }),
      transformErrorResponse: response => {
        if (response.data.type === ApiErrorCode.FOREIGN_KEY_CONSTRAINT) {
          return newUserError(DELETE_BASE_ERROR_MESSAGE)
        }

        return new FrontendApiError(DELETE_GENERIC_ERROR_MESSAGE, response)
      }
    }),

    getBase: builder.query<Base.Base, number>({
      providesTags: () => [{ type: 'Bases' }],
      query: baseId => `/v1/bases/${baseId}`,
      transformErrorResponse: response => new FrontendApiError(GET_BASE_ERROR_MESSAGE, response)
    }),

    getBases: builder.query<Base.Base[], void>({
      providesTags: () => [{ type: 'Bases' }],
      query: () => `/v1/bases`,
      transformErrorResponse: response => new FrontendApiError(GET_BASES_ERROR_MESSAGE, response)
    }),

    updateBase: builder.mutation<void, Base.Base>({
      invalidatesTags: () => [{ type: 'Bases' }, { type: 'ControlUnits' }],
      query: nextBase => ({
        body: nextBase,
        method: 'PUT',
        url: `/v1/bases/${nextBase.id}`
      })
    })
  })
})

export const {
  useCanDeleteBaseQuery,
  useCreateBaseMutation,
  useGetBaseQuery,
  useGetBasesQuery,
  useUpdateBaseMutation
} = basesAPI
