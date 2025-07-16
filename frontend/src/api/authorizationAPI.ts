import { monitorenvPrivateApi } from './api'

import type { UserAuthorization } from 'domain/entities/authorization/types'

export const authorizationAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getCurrentUserAuthorization: builder.query<UserAuthorization, void>({
      keepUnusedDataFor: 0,
      query: () => '/v1/authorization/current'
    })
  })
})

export const {
  endpoints: { getCurrentUserAuthorization },
  useGetCurrentUserAuthorizationQuery
} = authorizationAPI
