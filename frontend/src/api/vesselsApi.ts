import { monitorenvPrivateApi } from '@api/api'
import { FrontendApiError } from '@libs/FrontendApiError'
import { getQueryString } from '@utils/getQueryStringFormatted'

import type { Vessel } from '@features/Vessel/types'

const GET_VESSEL_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les informations de ce navire."
const SEARCH_VESSELS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les navires correspondants à cette recherche."
const SAVE_VESSELS_ADDITIONAL_INFORMATION_ERROR_MESSAGE = "Nous n'avons pas pu sauvegarder les observations du navire."
const SAVE_VESSELS_FILE_ERROR_MESSAGE = "Nous n'avons pas pu sauvegarder le fichier."

export const vesselsApi = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getVessel: builder.query<Vessel.Vessel, Vessel.VesselId>({
      providesTags: result => [{ id: result?.shipId, type: 'Vessels' }],
      query: ({ batchId, rowNumber, shipId }) => getQueryString(`/v1/vessels/${shipId}`, { batchId, rowNumber }),
      transformErrorResponse: response => new FrontendApiError(GET_VESSEL_ERROR_MESSAGE, response)
    }),
    saveVesselAdditionalInformation: builder.mutation<
      Vessel.AdditionalInformation,
      { additionalInformation: Vessel.AdditionalInformation; vesselId: Vessel.VesselId }
    >({
      invalidatesTags: () => [{ type: 'Vessels' }],
      query: ({ additionalInformation, vesselId }) => ({
        body: additionalInformation,
        method: 'PUT',
        url: getQueryString(`/v1/vessels/additional_information`, {
          batchId: vesselId.batchId,
          rowNumber: vesselId.rowNumber,
          shipId: vesselId.shipId
        })
      }),
      transformErrorResponse: response =>
        new FrontendApiError(SAVE_VESSELS_ADDITIONAL_INFORMATION_ERROR_MESSAGE, response)
    }),
    saveVesselFile: builder.mutation<Vessel.File[], { files: Vessel.File[]; vesselId: Vessel.VesselId }>({
      invalidatesTags: () => [{ type: 'Vessels' }],
      query: ({ files, vesselId }) => ({
        body: files,
        method: 'PUT',
        url: getQueryString(`/v1/vessels/files`, {
          batchId: vesselId.batchId,
          rowNumber: vesselId.rowNumber,
          shipId: vesselId.shipId
        })
      }),
      transformErrorResponse: response => new FrontendApiError(SAVE_VESSELS_FILE_ERROR_MESSAGE, response)
    }),
    searchVessels: builder.query<Vessel.Identity[], Vessel.ApiSearchFilter>({
      query: filter => `/v1/vessels/search?searched=${filter.searched}`,
      transformErrorResponse: response => new FrontendApiError(SEARCH_VESSELS_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetVesselQuery, useLazyGetVesselQuery, useSearchVesselsQuery } = vesselsApi
