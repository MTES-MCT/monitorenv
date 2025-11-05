import { monitorenvPrivateApi } from './api'

import type { SuspicionOfInfractions } from '../domain/entities/reporting'
import type { EnvActionControlWithControlUnit } from 'domain/entities/missions'

type InfractionsQuery = {
  idToExclude?: number | string
  mmsi: string
}
export const infractionsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getEnvActionsByMmsi: build.query<EnvActionControlWithControlUnit[], InfractionsQuery>({
      providesTags: () => ['Infractions'],
      query: ({ idToExclude, mmsi }) =>
        `/v1/infractions/actions/${mmsi}${idToExclude ? `?idToExclude=${idToExclude}` : ''}`
    }),
    getSuspicionOfInfractions: build.query<SuspicionOfInfractions, InfractionsQuery>({
      providesTags: () => ['InfractionsSuspicions'],
      query: ({ idToExclude, mmsi }) =>
        `/v1/infractions/reportings/${mmsi}${idToExclude ? `?idToExclude=${idToExclude}` : ''}`
    })
  })
})

export const { useLazyGetEnvActionsByMmsiQuery, useLazyGetSuspicionOfInfractionsQuery } = infractionsAPI
