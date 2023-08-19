import { monitorenvPublicApi } from './api'
import { ApiError } from '../libs/ApiError'

import type { Port } from '../domain/entities/port/types'

const GET_PORT_ERROR_MESSAGE = "Nous n'avons pas pu récupérer ce port."
const GET_PORTS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des ports."

export const portApi = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    createPort: builder.mutation<void, Port.PortData>({
      invalidatesTags: () => [{ type: 'ControlUnits' }, { type: 'Ports' }],
      query: newPortData => ({
        body: newPortData,
        method: 'POST',
        url: `/ports`
      })
    }),

    deletePort: builder.mutation<void, number>({
      invalidatesTags: () => [{ type: 'ControlUnits' }, { type: 'Ports' }],
      query: portId => ({
        method: 'DELETE',
        url: `/ports/${portId}`
      })
    }),

    getPort: builder.query<Port.Port, number>({
      providesTags: () => [{ type: 'Ports' }],
      query: portId => `/ports/${portId}`,
      transformErrorResponse: response => new ApiError(GET_PORT_ERROR_MESSAGE, response)
    }),

    getPorts: builder.query<Port.Port[], void>({
      providesTags: () => [{ type: 'Ports' }],
      query: () => `/ports`,
      transformErrorResponse: response => new ApiError(GET_PORTS_ERROR_MESSAGE, response)
    }),

    updatePort: builder.mutation<void, Port.Port>({
      invalidatesTags: () => [{ type: 'Ports' }],
      query: nextPort => ({
        body: nextPort,
        method: 'POST',
        url: `/ports/${nextPort.id}`
      })
    })
  })
})

export const {
  useCreatePortMutation,
  useDeletePortMutation,
  useGetPortQuery,
  useGetPortsQuery,
  useUpdatePortMutation
} = portApi
