import { monitorenvPublicApi } from './api'
import { ApiError } from '../libs/ApiError'

import type { Administration } from '../domain/entities/administration/types'

const GET_ADMINISTRATION_ERROR_MESSAGE = "Nous n'avons pas pu récupérer cette administration."
const GET_ADMINISTRATIONS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des administrations."

export const administrationApi = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    createAdministration: builder.mutation<void, Administration.NewAdministrationData>({
      invalidatesTags: () => [{ type: 'Administrations' }],
      query: newAdministrationData => ({
        body: newAdministrationData,
        method: 'POST',
        url: `/administrations`
      })
    }),

    getAdministration: builder.query<Administration.Administration, number>({
      providesTags: () => [{ type: 'Administrations' }],
      query: administrationId => `/administrations/${administrationId}`,
      transformErrorResponse: response => new ApiError(GET_ADMINISTRATION_ERROR_MESSAGE, response)
    }),

    getAdministrations: builder.query<Administration.Administration[], void>({
      providesTags: () => [{ type: 'Administrations' }],
      query: () => `/administrations`,
      transformErrorResponse: response => new ApiError(GET_ADMINISTRATIONS_ERROR_MESSAGE, response)
    }),

    updateAdministration: builder.mutation<void, Administration.AdministrationData>({
      invalidatesTags: () => [{ type: 'Administrations' }, { type: 'ControlUnits' }],
      query: nextAdministrationData => ({
        body: nextAdministrationData,
        method: 'POST',
        url: `/administrations/${nextAdministrationData.id}`
      })
    })
  })
})

export const {
  useCreateAdministrationMutation,
  useGetAdministrationQuery,
  useGetAdministrationsQuery,
  useUpdateAdministrationMutation
} = administrationApi
