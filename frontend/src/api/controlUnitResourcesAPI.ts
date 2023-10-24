import { monitorenvPublicApi } from './api'
import { ARCHIVE_GENERIC_ERROR_MESSAGE } from './constants'
import { ApiErrorCode } from './types'
import { FrontendApiError } from '../libs/FrontendApiError'
import { newUserError } from '../libs/UserError'

import type { ControlUnit } from '../domain/entities/controlUnit'

export const ARCHIVE_CONTROL_UNITE_RESOURCE_ERROR_MESSAGE = [
  'Certaines unités de cette administration ne sont pas archivées.',
  'Veuillez les archiver pour pouvoir archiver cette administration.'
].join(' ')
const DELETE_CONTROL_UNIT_RESOURCE_ERROR_MESSAGE =
  "Ce moyen est rattaché à des missions. Veuillez l'en détacher avant de la supprimer."
const GET_CONTROL_UNIT_RESOURCE_ERROR_MESSAGE = "Nous n'avons pas pu récupérer cette resource."
const GET_CONTROL_UNIT_RESOURCES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des resources."

export const controlUnitResourcesAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    archiveControlUnitResource: builder.mutation<void, number>({
      invalidatesTags: () => [{ type: 'Bases' }, { type: 'ControlUnits' }],
      query: controlUnitResourceId => ({
        method: 'PUT',
        url: `/v1/control_unit_resources/${controlUnitResourceId}/archive`
      }),
      transformErrorResponse: response => {
        if (response.data.type === ApiErrorCode.UNARCHIVED_CHILD) {
          return newUserError(ARCHIVE_CONTROL_UNITE_RESOURCE_ERROR_MESSAGE)
        }

        return new FrontendApiError(ARCHIVE_GENERIC_ERROR_MESSAGE, response)
      }
    }),

    createControlUnitResource: builder.mutation<void, ControlUnit.NewControlUnitResourceData>({
      invalidatesTags: () => [{ type: 'Bases' }, { type: 'ControlUnits' }],
      query: newControlUnitResourceData => ({
        body: newControlUnitResourceData,
        method: 'POST',
        url: `/v1/control_unit_resources`
      })
    }),

    deleteControlUnitResource: builder.mutation<void, number>({
      invalidatesTags: () => [{ type: 'Bases' }, { type: 'ControlUnits' }],
      query: controlUnitResourceId => ({
        method: 'DELETE',
        url: `/v1/control_unit_resources/${controlUnitResourceId}`
      }),
      transformErrorResponse: response => {
        if (response.data.type === ApiErrorCode.FOREIGN_KEY_CONSTRAINT) {
          return newUserError(DELETE_CONTROL_UNIT_RESOURCE_ERROR_MESSAGE)
        }

        return new FrontendApiError(DELETE_CONTROL_UNIT_RESOURCE_ERROR_MESSAGE, response)
      }
    }),

    getControlUnitResource: builder.query<ControlUnit.ControlUnitResource, number>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: controlUnitResourceId => `/v1/control_unit_resources/${controlUnitResourceId}`,
      transformErrorResponse: response => new FrontendApiError(GET_CONTROL_UNIT_RESOURCE_ERROR_MESSAGE, response)
    }),

    getControlUnitResources: builder.query<ControlUnit.ControlUnitResource[], void>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: () => `/v1/control_unit_resources`,
      transformErrorResponse: response => new FrontendApiError(GET_CONTROL_UNIT_RESOURCES_ERROR_MESSAGE, response)
    }),

    updateControlUnitResource: builder.mutation<void, ControlUnit.ControlUnitResourceData>({
      invalidatesTags: () => [{ type: 'Bases' }, { type: 'ControlUnits' }],
      query: nextControlUnitResourceData => ({
        body: nextControlUnitResourceData,
        method: 'PUT',
        url: `/v1/control_unit_resources/${nextControlUnitResourceData.id}`
      })
    })
  })
})

export const {
  useArchiveControlUnitResourceMutation,
  useCreateControlUnitResourceMutation,
  useDeleteControlUnitResourceMutation,
  useGetControlUnitResourceQuery,
  useGetControlUnitResourcesQuery,
  useUpdateControlUnitResourceMutation
} = controlUnitResourcesAPI
