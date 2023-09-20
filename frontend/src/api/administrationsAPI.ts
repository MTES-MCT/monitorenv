import { monitorenvPublicApi } from './api'
import { ApiError } from '../libs/ApiError'

import type { Administration } from '../domain/entities/administration'

const GET_ADMINISTRATION_ERROR_MESSAGE = "Nous n'avons pas pu récupérer cette administration."
const GET_ADMINISTRATIONS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des administrations."

export const administrationsAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    createAdministration: builder.mutation<void, Administration.NewAdministrationData>({
      invalidatesTags: () => [{ type: 'Administrations' }],
      query: newAdministrationData => ({
        body: newAdministrationData,
        method: 'POST',
        url: `/v1/administrations`
      })
    }),

    getAdministration: builder.query<Administration.Administration, number>({
      providesTags: () => [{ type: 'Administrations' }],
      query: administrationId => `/v1/administrations/${administrationId}`,
      transformErrorResponse: response => new ApiError(GET_ADMINISTRATION_ERROR_MESSAGE, response)
    }),

    getAdministrations: builder.query<Administration.Administration[], void>({
      providesTags: () => [{ type: 'Administrations' }],
      query: () => `/v1/administrations`,
      transformErrorResponse: response => new ApiError(GET_ADMINISTRATIONS_ERROR_MESSAGE, response)
    }),

    updateAdministration: builder.mutation<void, Administration.AdministrationData>({
      invalidatesTags: () => [{ type: 'Administrations' }, { type: 'ControlUnits' }],
      query: nextAdministrationData => ({
        body: nextAdministrationData,
        method: 'PUT',
        url: `/v1/administrations/${nextAdministrationData.id}`
      })
    })
  })
})

export const {
  useCreateAdministrationMutation,
  useGetAdministrationQuery,
  useGetAdministrationsQuery,
  useUpdateAdministrationMutation
} = administrationsAPI
