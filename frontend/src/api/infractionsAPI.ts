import { monitorenvPrivateApi } from './api'

import type { SuspicionOfInfractions } from '../domain/entities/reporting'
import type { EnvAction } from 'domain/entities/missions'

type SuspicionOfInfractionsQuery = {
  idToExclude?: number
  mmsi: string
}
export const infractionsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getEnvActionsByMmsi: build.query<EnvAction[], string>({
      providesTags: () => ['Infractions'],
      query: mmsi => `/v1/infractions/actions/${mmsi}`
    }),
    getSuspicionOfInfractions: build.query<SuspicionOfInfractions, SuspicionOfInfractionsQuery>({
      providesTags: () => ['InfractionsSuspicions'],
      query: ({ idToExclude, mmsi }) =>
        `/v1/infractions/reportings/${mmsi}${idToExclude ? `?idToExclude=${idToExclude}` : ''}`
    })
  })
})

export const { useLazyGetEnvActionsByMmsiQuery, useLazyGetSuspicionOfInfractionsQuery } = infractionsAPI
