import { monitorenvPublicApi } from './api'
import { DELETE_GENERIC_ERROR_MESSAGE } from './constants'
import { ApiErrorCode, type BackendApiBooleanResponse } from './types'
import { FrontendApiError } from '../libs/FrontendApiError'
import { newUserError } from '../libs/UserError'

import type { Station } from '../domain/entities/station'

const CAN_DELETE_STATION_ERROR_MESSAGE = "Nous n'avons pas pu vérifier si cette base est supprimable."
export const DELETE_STATION_ERROR_MESSAGE =
  "Cette base est rattachée à des moyens. Veuillez l'en détacher avant de la supprimer ou bien l'archiver."
const GET_STATION_ERROR_MESSAGE = "Nous n'avons pas pu récupérer cette base."
const GET_STATIONS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des bases."

export const stationsAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    canDeleteStation: builder.query<boolean, number>({
      forceRefetch: () => true,
      query: stationId => `/v1/stations/${stationId}/can_delete`,
      transformErrorResponse: response => new FrontendApiError(CAN_DELETE_STATION_ERROR_MESSAGE, response),
      transformResponse: (response: BackendApiBooleanResponse) => response.value
    }),

    createStation: builder.mutation<void, Station.NewStationData>({
      invalidatesTags: () => [{ type: 'Stations' }],
      query: newStationData => ({
        body: newStationData,
        method: 'POST',
        url: `/v1/stations`
      })
    }),

    deleteStation: builder.mutation<void, number>({
      invalidatesTags: () => [{ type: 'Stations' }],
      query: stationId => ({
        method: 'DELETE',
        url: `/v1/stations/${stationId}`
      }),
      transformErrorResponse: response => {
        if (response.data.type === ApiErrorCode.CANNOT_DELETE_ENTITY) {
          return newUserError(DELETE_STATION_ERROR_MESSAGE)
        }

        return new FrontendApiError(DELETE_GENERIC_ERROR_MESSAGE, response)
      }
    }),

    getStation: builder.query<Station.Station, number>({
      providesTags: () => [{ type: 'Stations' }],
      query: stationId => `/v1/stations/${stationId}`,
      transformErrorResponse: response => new FrontendApiError(GET_STATION_ERROR_MESSAGE, response)
    }),

    getStations: builder.query<Station.Station[], void>({
      providesTags: () => [{ type: 'Stations' }],
      query: () => `/v1/stations`,
      transformErrorResponse: response => new FrontendApiError(GET_STATIONS_ERROR_MESSAGE, response)
    }),

    updateStation: builder.mutation<void, Station.StationData>({
      invalidatesTags: () => [{ type: 'ControlUnits' }, { type: 'Stations' }],
      query: nextStation => ({
        body: nextStation,
        method: 'PUT',
        url: `/v1/stations/${nextStation.id}`
      })
    })
  })
})

export const {
  useCanDeleteStationQuery,
  useCreateStationMutation,
  useGetStationQuery,
  useGetStationsQuery,
  useUpdateStationMutation
} = stationsAPI
