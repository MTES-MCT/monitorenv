import { monitorenvPublicApi } from './api'
import { ApiError } from '../libs/ApiError'

import type { ControlUnit } from '../domain/entities/controlUnit/types'

const GET_CONTROL_UNIT_RESOURCE_ERROR_MESSAGE = "Nous n'avons pas pu récupérer cette resource."
const GET_CONTROL_UNIT_RESOURCES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des resources."

export const controlUnitResourceApi = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    createControlUnitResource: builder.mutation<void, ControlUnit.NewControlUnitResourceData>({
      invalidatesTags: () => [{ type: 'ControlUnits' }],
      query: newControlUnitResourceData => ({
        body: newControlUnitResourceData,
        method: 'POST',
        url: `/control_unit_resources`
      })
    }),

    deleteControlUnitResource: builder.mutation<void, number>({
      invalidatesTags: () => [{ type: 'ControlUnits' }, { type: 'Ports' }],
      query: controlUnitResourceId => ({
        method: 'DELETE',
        url: `/control_unit_resources/${controlUnitResourceId}`
      })
    }),

    getControlUnitResource: builder.query<ControlUnit.ControlUnitResource, number>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: controlUnitResourceId => `/control_unit_resources/${controlUnitResourceId}`,
      transformErrorResponse: response => new ApiError(GET_CONTROL_UNIT_RESOURCE_ERROR_MESSAGE, response)
    }),

    getControlUnitResources: builder.query<ControlUnit.ControlUnitResource[], void>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: () => `/control_unit_resources`,
      transformErrorResponse: response => new ApiError(GET_CONTROL_UNIT_RESOURCES_ERROR_MESSAGE, response)
    }),

    updateControlUnitResource: builder.mutation<void, ControlUnit.ControlUnitResourceData>({
      invalidatesTags: () => [{ type: 'ControlUnits' }, { type: 'Ports' }],
      query: nextControlUnitResourceData => ({
        body: nextControlUnitResourceData,
        method: 'POST',
        url: `/control_unit_resources/${nextControlUnitResourceData.id}`
      })
    })
  })
})

export const {
  useCreateControlUnitResourceMutation,
  useDeleteControlUnitResourceMutation,
  useGetControlUnitResourceQuery,
  useGetControlUnitResourcesQuery,
  useUpdateControlUnitResourceMutation
} = controlUnitResourceApi
