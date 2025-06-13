import { monitorenvPublicApi } from './api'
import { ARCHIVE_GENERIC_ERROR_MESSAGE, DELETE_GENERIC_ERROR_MESSAGE } from './constants'
import { ApiErrorCode, type BackendApiBooleanResponse } from './types'
import { FrontendApiError } from '../libs/FrontendApiError'
import { newUserError } from '../libs/UserError'

import type { Administration } from '../domain/entities/administration'

export const ARCHIVE_ADMINISTRATION_ERROR_MESSAGE = [
  'Certaines unités de cette administration ne sont pas archivées.',
  'Veuillez les archiver pour pouvoir archiver cette administration.'
].join(' ')
const CAN_ARCHIVE_ADMINISTRATION_ERROR_MESSAGE = "Nous n'avons pas pu vérifier si cette administration est archivable."
const CAN_DELETE_ADMINISTRATION_ERROR_MESSAGE = "Nous n'avons pas pu vérifier si cette administration est supprimable."
export const DELETE_ADMINISTRATION_ERROR_MESSAGE = [
  'Des unités sont encore rattachées à cette administration.',
  'Veuillez les supprimer avant de pouvoir supprimer cette administration.'
].join(' ')
const GET_ADMINISTRATION_ERROR_MESSAGE = "Nous n'avons pas pu récupérer cette administration."
const GET_ADMINISTRATIONS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des administrations."

export const administrationsAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    archiveAdministration: builder.mutation<void, number>({
      invalidatesTags: () => [{ type: 'Administrations' }],
      query: administrationId => ({
        method: 'PUT',
        url: `/v1/administrations/${administrationId}/archive`
      }),
      transformErrorResponse: response => {
        if (response.data.type === ApiErrorCode.UNARCHIVED_CHILD) {
          return newUserError(ARCHIVE_ADMINISTRATION_ERROR_MESSAGE)
        }

        return new FrontendApiError(ARCHIVE_GENERIC_ERROR_MESSAGE, response)
      }
    }),

    canArchiveAdministration: builder.query<boolean, number>({
      forceRefetch: () => true,
      query: administrationId => `/v1/administrations/${administrationId}/can_archive`,
      transformErrorResponse: response => new FrontendApiError(CAN_ARCHIVE_ADMINISTRATION_ERROR_MESSAGE, response),
      transformResponse: (response: BackendApiBooleanResponse) => response.value
    }),

    canDeleteAdministration: builder.query<boolean, number>({
      query: administrationId => `/v1/administrations/${administrationId}/can_delete`,
      transformErrorResponse: response => new FrontendApiError(CAN_DELETE_ADMINISTRATION_ERROR_MESSAGE, response),
      transformResponse: (response: BackendApiBooleanResponse) => response.value
    }),

    createAdministration: builder.mutation<void, Administration.NewAdministrationData>({
      invalidatesTags: () => [{ type: 'Administrations' }],
      query: newAdministrationData => ({
        body: newAdministrationData,
        method: 'POST',
        url: `/v1/administrations`
      })
    }),

    deleteAdministration: builder.mutation<void, number>({
      invalidatesTags: () => [{ type: 'Administrations' }],
      query: administrationId => ({
        method: 'DELETE',
        url: `/v1/administrations/${administrationId}`
      }),
      transformErrorResponse: response => {
        if (response.data.type === ApiErrorCode.CANNOT_DELETE_ENTITY) {
          return newUserError(DELETE_ADMINISTRATION_ERROR_MESSAGE)
        }

        return new FrontendApiError(DELETE_GENERIC_ERROR_MESSAGE, response)
      }
    }),

    getAdministration: builder.query<Administration.Administration, number>({
      providesTags: () => [{ type: 'Administrations' }],
      query: administrationId => `/v1/administrations/${administrationId}`,
      transformErrorResponse: response => new FrontendApiError(GET_ADMINISTRATION_ERROR_MESSAGE, response)
    }),

    getAdministrations: builder.query<Administration.Administration[], void>({
      providesTags: () => [{ type: 'Administrations' }],
      query: () => `/v1/administrations`,
      transformErrorResponse: response => new FrontendApiError(GET_ADMINISTRATIONS_ERROR_MESSAGE, response)
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
  useArchiveAdministrationMutation,
  useCanArchiveAdministrationQuery,
  useCanDeleteAdministrationQuery,
  useCreateAdministrationMutation,
  useDeleteAdministrationMutation,
  useGetAdministrationQuery,
  useGetAdministrationsQuery,
  useUpdateAdministrationMutation
} = administrationsAPI
