import { monitorenvPrivateApi } from './api'

import type { NatinfType } from '../domain/entities/natinfs'

export const infractionsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getInfractions: build.query<NatinfType[], void>({
      query: () => `/v1/natinfs`
    })
  })
})

export const { useGetInfractionsQuery } = infractionsAPI
