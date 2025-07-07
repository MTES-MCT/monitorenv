import { monitorenvPrivateApi } from './api'

import type { NatinfType } from '../domain/entities/natinfs'

export const natinfsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getNatinfs: build.query<NatinfType[], void>({
      query: () => `/v1/natinfs`
    })
  })
})

export const { useGetNatinfsQuery } = natinfsAPI
