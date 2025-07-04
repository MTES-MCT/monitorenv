import { monitorenvPrivateApi } from './api'

import type { NatinfType } from '../domain/entities/natinfs'
import type { SuspicionOfInfractions } from '../domain/entities/reporting'
import type { EnvAction } from 'domain/entities/missions'

type SuspicionOfInfractionsQuery = {
  idsToExclude: number[]
  mmsi: string
}
export const infractionsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getEnvActionsByMmsi: build.query<EnvAction[], string>({
      providesTags: () => ['Infractions'],
      query: mmsi => `/v1/infractions/${mmsi}`
    }),
    getInfractions: build.query<NatinfType[], void>({
      query: () => `/v1/natinfs`
    }),
    getSuspicionOfInfractions: build.query<SuspicionOfInfractions, SuspicionOfInfractionsQuery>({
      providesTags: () => ['Suspicions'],
      query: ({ idsToExclude, mmsi }) =>
        `/v1/infractions/reportings/${mmsi}?${idsToExclude.map(id => `idsToExclude=${id}`).join('&')}`
    })
  })
})

export const { useGetEnvActionsByMmsiQuery, useGetInfractionsQuery, useGetSuspicionOfInfractionsQuery } = infractionsAPI
