import { monitorenvPublicApi } from './api'
import { ApiError } from '../libs/ApiError'

import type { Base } from '../domain/entities/base'

const GET_BASE_ERROR_MESSAGE = "Nous n'avons pas pu récupérer cette base."
const GET_BASES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des bases."

export const basesAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    createBase: builder.mutation<void, Base.BaseData>({
      invalidatesTags: () => [{ type: 'ControlUnits' }, { type: 'Bases' }],
      query: newBaseData => ({
        body: newBaseData,
        method: 'POST',
        url: `/v1/bases`
      })
    }),

    getBase: builder.query<Base.Base, number>({
      providesTags: () => [{ type: 'Bases' }],
      query: baseId => `/v1/bases/${baseId}`,
      transformErrorResponse: response => new ApiError(GET_BASE_ERROR_MESSAGE, response)
    }),

    getBases: builder.query<Base.Base[], void>({
      providesTags: () => [{ type: 'Bases' }],
      query: () => `/v1/bases`,
      transformErrorResponse: response => new ApiError(GET_BASES_ERROR_MESSAGE, response)
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

export const { useCreateBaseMutation, useGetBaseQuery, useGetBasesQuery, useUpdateBaseMutation } = basesAPI
