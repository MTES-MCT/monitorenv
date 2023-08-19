import { monitorenvPublicApi } from './api'
import { ApiError } from '../libs/ApiError'

import type { ControlUnit } from '../domain/entities/controlUnit/types'

const GET_CONTROL_UNIT_ERROR_MESSAGE = "Nous n'avons pas pu récupérer cette unité de contrôle."
const GET_CONTROL_UNITS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des unités de contrôle."

export const controlUnitApi = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    createControlUnit: builder.mutation<void, ControlUnit.NewControlUnitData>({
      invalidatesTags: () => [{ type: 'ControlUnits' }],
      query: newControlUnitData => ({
        body: newControlUnitData,
        method: 'POST',
        url: `/next_control_units`
      })
    }),

    deleteControlUnit: builder.mutation<void, number>({
      invalidatesTags: () => [{ type: 'ControlUnits' }],
      query: controlUnitId => ({
        method: 'DELETE',
        url: `/next_control_units/${controlUnitId}`
      })
    }),

    getControlUnit: builder.query<ControlUnit.ControlUnit, number>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: controlUnitId => `/next_control_units/${controlUnitId}`,
      transformErrorResponse: response => new ApiError(GET_CONTROL_UNIT_ERROR_MESSAGE, response)
    }),

    getControlUnits: builder.query<ControlUnit.ControlUnit[], void>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: () => `/next_control_units`,
      transformErrorResponse: response => new ApiError(GET_CONTROL_UNITS_ERROR_MESSAGE, response)
    }),

    updateControlUnit: builder.mutation<void, ControlUnit.ControlUnitData>({
      invalidatesTags: () => [{ type: 'ControlUnits' }],
      query: nextControlUnitData => ({
        body: nextControlUnitData,
        method: 'POST',
        url: `/next_control_units/${nextControlUnitData.id}`
      })
    })
  })
})

export const {
  useCreateControlUnitMutation,
  useDeleteControlUnitMutation,
  useGetControlUnitQuery,
  useGetControlUnitsQuery,
  useUpdateControlUnitMutation
} = controlUnitApi
