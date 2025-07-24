import { FrontendError } from '@libs/FrontendError'
import { type ControlUnit } from '@mtes-mct/monitor-ui'

import { monitorenvPrivateApi, monitorenvPublicApi } from './api'
import { FrontendApiError } from '../libs/FrontendApiError'

const GET_CONTROL_UNIT_CONTACT_ERROR_MESSAGE = "Nous n'avons pas pu récupérer cette contact."
const GET_CONTROL_UNIT_CONTACTS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des contacts."

export const controlUnitContactsAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    createControlUnitContact: builder.mutation<void, ControlUnit.NewControlUnitContactData>({
      invalidatesTags: () => [{ type: 'ControlUnits' }],
      query: newControlUnitContactData => ({
        body: newControlUnitContactData,
        method: 'POST',
        url: `/v2/control_unit_contacts`
      })
    }),

    deleteControlUnitContact: builder.mutation<void, number>({
      invalidatesTags: () => [{ type: 'ControlUnits' }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled

          // Invalider manuellement le cache d'une autre API
          dispatch(monitorenvPrivateApi.util.invalidateTags([{ id: 'LIST', type: 'VigilanceAreas' }]))
        } catch {
          throw new FrontendError('Impossible de mettre à jour le cache des zones de vigilances')
        }
      },
      query: controlUnitContactId => ({
        method: 'DELETE',
        url: `/v1/control_unit_contacts/${controlUnitContactId}`
      })
    }),

    getControlUnitContact: builder.query<ControlUnit.ControlUnitContact, number>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: controlUnitContactId => `/v1/control_unit_contacts/${controlUnitContactId}`,
      transformErrorResponse: response => new FrontendApiError(GET_CONTROL_UNIT_CONTACT_ERROR_MESSAGE, response)
    }),

    getControlUnitContacts: builder.query<ControlUnit.ControlUnitContact[], void>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: () => `/v1/control_unit_contacts`,
      transformErrorResponse: response => new FrontendApiError(GET_CONTROL_UNIT_CONTACTS_ERROR_MESSAGE, response)
    }),

    patchControlUnitContact: builder.mutation<void, ControlUnit.ControlUnitContactData>({
      invalidatesTags: () => [{ type: 'ControlUnits' }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled

          // Invalider manuellement le cache d'une autre API
          dispatch(monitorenvPrivateApi.util.invalidateTags([{ id: 'LIST', type: 'VigilanceAreas' }]))
        } catch {
          throw new FrontendError('Impossible de mettre à jour le cache des zones de vigilances')
        }
      },
      query: nextControlUnitContactData => ({
        body: nextControlUnitContactData,
        method: 'PATCH',
        url: `/v1/control_unit_contacts/${nextControlUnitContactData.id}`
      })
    })
  })
})

export const {
  useCreateControlUnitContactMutation,
  useDeleteControlUnitContactMutation,
  useGetControlUnitContactQuery,
  useGetControlUnitContactsQuery,
  usePatchControlUnitContactMutation
} = controlUnitContactsAPI
