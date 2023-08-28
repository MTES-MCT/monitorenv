import { monitorenvPublicApi } from './api'
import { ApiError } from '../libs/ApiError'

import type { ControlUnit } from '../domain/entities/controlUnit'

const GET_CONTROL_UNIT_CONTACT_ERROR_MESSAGE = "Nous n'avons pas pu récupérer cette contact."
const GET_CONTROL_UNIT_CONTACTS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des contacts."

export const controlUnitContactsAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    createControlUnitContact: builder.mutation<void, ControlUnit.NewControlUnitContactData>({
      invalidatesTags: () => [{ type: 'ControlUnits' }],
      query: newControlUnitContactData => ({
        body: newControlUnitContactData,
        method: 'POST',
        url: `/control_unit_contacts`
      })
    }),

    getControlUnitContact: builder.query<ControlUnit.ControlUnitContact, number>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: controlUnitContactId => `/control_unit_contacts/${controlUnitContactId}`,
      transformErrorResponse: response => new ApiError(GET_CONTROL_UNIT_CONTACT_ERROR_MESSAGE, response)
    }),

    getControlUnitContacts: builder.query<ControlUnit.ControlUnitContact[], void>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: () => `/control_unit_contacts`,
      transformErrorResponse: response => new ApiError(GET_CONTROL_UNIT_CONTACTS_ERROR_MESSAGE, response)
    }),

    updateControlUnitContact: builder.mutation<void, ControlUnit.ControlUnitContactData>({
      invalidatesTags: () => [{ type: 'ControlUnits' }],
      query: nextControlUnitContactData => ({
        body: nextControlUnitContactData,
        method: 'PUT',
        url: `/control_unit_contacts/${nextControlUnitContactData.id}`
      })
    })
  })
})

export const {
  useCreateControlUnitContactMutation,
  useGetControlUnitContactQuery,
  useGetControlUnitContactsQuery,
  useUpdateControlUnitContactMutation
} = controlUnitContactsAPI
