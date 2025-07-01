import { monitorenvPrivateApi } from './api'

import type { NatinfType } from '../domain/entities/natinfs'
import type { SuspicionOfOffense } from '../domain/entities/reporting'
import type { EnvAction } from 'domain/entities/missions'

export const infractionsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getEnvActionsByMmsi: build.query<EnvAction[], string>({
      query: mmsi => `/v1/infractions/${mmsi}`
    }),
    getInfractions: build.query<NatinfType[], void>({
      query: () => `/v1/natinfs`
    }),
    getSuspicionOfOffense: build.query<SuspicionOfOffense, string>({
      query: mmsi => `/v1/infractions/reportings/${mmsi}`
    })
  })
})

export const { useGetEnvActionsByMmsiQuery, useGetInfractionsQuery, useGetSuspicionOfOffenseQuery } = infractionsAPI
