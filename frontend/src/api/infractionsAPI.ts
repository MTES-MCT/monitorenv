import { monitorenvPrivateApi } from './api'

import type { NatinfType } from '../domain/entities/natinfs'
import type { EnvAction } from 'domain/entities/missions'

export const infractionsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getEnvActionsByMmsi: build.query<EnvAction[], string>({
      query: mmsi => `/v1/infractions/${mmsi}`
    }),
    getInfractions: build.query<NatinfType[], void>({
      query: () => `/v1/natinfs`
    })
  })
})

export const { useGetEnvActionsByMmsiQuery, useGetInfractionsQuery } = infractionsAPI
