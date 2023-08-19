import { monitorenvPublicApi } from './api'
import { ApiError } from '../libs/ApiError'

import type { ControlUnit } from '../domain/entities/controlUnit/types'

const GET_CONTROL_UNIT_ADMINISTRATION_ERROR_MESSAGE = "Nous n'avons pas pu récupérer cette administration."
const GET_CONTROL_UNIT_ADMINISTRATIONS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des administrations."

export const controlUnitAdministrationApi = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    createControlUnitAdministration: builder.mutation<void, ControlUnit.NewControlUnitAdministrationData>({
      invalidatesTags: () => [{ type: 'ControlUnits' }],
      query: newControlUnitAdministrationData => ({
        body: newControlUnitAdministrationData,
        method: 'POST',
        url: `/control_unit_administrations`
      })
    }),

    deleteControlUnitAdministration: builder.mutation<void, number>({
      invalidatesTags: () => [{ type: 'ControlUnits' }],
      query: controlUnitAdministrationId => ({
        method: 'DELETE',
        url: `/control_unit_administrations/${controlUnitAdministrationId}`
      })
    }),

    getControlUnitAdministration: builder.query<ControlUnit.ControlUnitAdministration, number>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: controlUnitAdministrationId => `/control_unit_administrations/${controlUnitAdministrationId}`,
      transformErrorResponse: response => new ApiError(GET_CONTROL_UNIT_ADMINISTRATION_ERROR_MESSAGE, response)
    }),

    getControlUnitAdministrations: builder.query<ControlUnit.ControlUnitAdministration[], void>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: () => `/control_unit_administrations`,
      transformErrorResponse: response => new ApiError(GET_CONTROL_UNIT_ADMINISTRATIONS_ERROR_MESSAGE, response)
    }),

    updateControlUnitAdministration: builder.mutation<void, ControlUnit.ControlUnitAdministrationData>({
      invalidatesTags: () => [{ type: 'ControlUnits' }],
      query: nextControlUnitAdministrationData => ({
        body: nextControlUnitAdministrationData,
        method: 'POST',
        url: `/control_unit_administrations/${nextControlUnitAdministrationData.id}`
      })
    })
  })
})

export const {
  useCreateControlUnitAdministrationMutation,
  useDeleteControlUnitAdministrationMutation,
  useGetControlUnitAdministrationQuery,
  useGetControlUnitAdministrationsQuery,
  useUpdateControlUnitAdministrationMutation
} = controlUnitAdministrationApi
