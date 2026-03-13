import { monitorenvPrivateApi } from './api'

import type { NatinfType } from '../domain/entities/natinfs'

export const natinfsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getNatinfs: build.query<NatinfType[], void>({
      query: () => `/v1/natinfs`
    }),
    getThemesNatinfs: build.query<NatinfType[], number[]>({
      query: ids => ({ body: ids, method: 'POST', url: '/v1/natinfs/themes' })
    })
  })
})

export const { useGetNatinfsQuery, useLazyGetThemesNatinfsQuery } = natinfsAPI
