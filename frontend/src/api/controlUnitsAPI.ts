import { newUserError } from '@libs/error'
import { type ControlUnit } from '@mtes-mct/monitor-ui'
import { createSelector } from '@reduxjs/toolkit'

import { monitorenvPublicApi } from './api'
import { ApiErrorCode, type BackendApiBooleanResponse } from './types'
import { FrontendApiError } from '../libs/FrontendApiError'

const CAN_DELETE_CONTROL_UNIT_ERROR_MESSAGE = "Nous n'avons pas pu vérifier si cette unité de contrôle est supprimable."
export const DELETE_CONTROL_UNIT_ERROR_MESSAGE = [
  'Cette unité est rattachée à des missions ou des signalements.',
  "Veuillez l'en détacher avant de la supprimer ou bien l'archiver."
].join(' ')
const GET_CONTROL_UNIT_ERROR_MESSAGE = "Nous n'avons pas pu récupérer cette unité de contrôle."
const GET_CONTROL_UNITS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des unités de contrôle."

export const controlUnitsAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    archiveControlUnit: builder.mutation<void, number>({
      invalidatesTags: () => [{ type: 'Administrations' }, { type: 'ControlUnits' }],
      query: controlUnitId => ({
        method: 'PUT',
        url: `/v2/control_units/${controlUnitId}/archive`
      })
    }),

    canDeleteControlUnit: builder.query<boolean, number>({
      forceRefetch: () => true,
      query: controlUnitId => `/v2/control_units/${controlUnitId}/can_delete`,
      transformErrorResponse: response => new FrontendApiError(CAN_DELETE_CONTROL_UNIT_ERROR_MESSAGE, response),
      transformResponse: (response: BackendApiBooleanResponse) => response.value
    }),

    createControlUnit: builder.mutation<void, ControlUnit.NewControlUnitData>({
      invalidatesTags: () => [{ type: 'Administrations' }, { type: 'ControlUnits' }],
      query: newControlUnitData => ({
        body: newControlUnitData,
        method: 'POST',
        url: `/v2/control_units`
      })
    }),

    deleteControlUnit: builder.mutation<void, number>({
      invalidatesTags: () => [{ type: 'Administrations' }, { type: 'ControlUnits' }],
      query: controlUnitId => ({
        method: 'DELETE',
        url: `/v2/control_units/${controlUnitId}`
      }),
      transformErrorResponse: response => {
        if (response.data.code === ApiErrorCode.CANNOT_DELETE_ENTITY) {
          return newUserError(DELETE_CONTROL_UNIT_ERROR_MESSAGE, 'backoffice')
        }

        return new FrontendApiError(DELETE_CONTROL_UNIT_ERROR_MESSAGE, response)
      }
    }),

    getControlUnit: builder.query<ControlUnit.ControlUnit, number>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: controlUnitId => `/v2/control_units/${controlUnitId}`,
      transformErrorResponse: response => new FrontendApiError(GET_CONTROL_UNIT_ERROR_MESSAGE, response)
    }),

    getControlUnits: builder.query<ControlUnit.ControlUnit[], void>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: () => `/v2/control_units`,
      transformErrorResponse: response => new FrontendApiError(GET_CONTROL_UNITS_ERROR_MESSAGE, response)
    }),

    updateControlUnit: builder.mutation<void, ControlUnit.ControlUnitData>({
      invalidatesTags: () => [{ type: 'Administrations' }, { type: 'ControlUnits' }],
      query: nextControlUnitData => ({
        body: nextControlUnitData,
        method: 'PUT',
        url: `/v2/control_units/${nextControlUnitData.id}`
      })
    })
  })
})

export const {
  useArchiveControlUnitMutation,
  useCanDeleteControlUnitQuery,
  useCreateControlUnitMutation,
  useDeleteControlUnitMutation,
  useGetControlUnitQuery,
  useGetControlUnitsQuery,
  useUpdateControlUnitMutation
} = controlUnitsAPI

export const getControlUnitsByIds = createSelector(
  [controlUnitsAPI.endpoints.getControlUnits.select(), (_, ids: number[]) => ids],
  ({ data }, ids) => (data ?? []).filter(controlUnit => ids.includes(controlUnit.id))
)
