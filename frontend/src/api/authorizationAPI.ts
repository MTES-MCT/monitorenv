import { monitorenvPrivateApi } from './api'

import type { Meta } from './types'
import type { UserAuthorization, UserAuthorizationData } from 'domain/entities/authorization/types'

export const authorizationAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getCurrentUserAuthorization: builder.query<UserAuthorization, void>({
      keepUnusedDataFor: 0,
      query: () => '/v1/authorization/current',
      transformErrorResponse: (_, meta: Meta) => {
        const authenticateResponse = meta.response?.headers.get('WWW-Authenticate')

        /**
         * We need to reload the app if the WWW-Authenticate header contains:
         * - "authentication is required" : The access_token is missing from the request header.
         *              The user just logged in but the request did not include the access_token just saved in LocalStorage,
         *              there is a race condition.
         * - "expired": The access_token sent to the backend is expired.
         *              The user just re-logged in, but the request did include the previous access_token found in LocalStorage,
         *              there is a race condition.
         */
        if (authenticateResponse?.includes('authentication is required') || authenticateResponse?.includes('expired')) {
          return {
            isLogged: false,
            isSuperUser: false,
            mustReload: true
          }
        }

        return {
          isLogged: false,
          isSuperUser: false,
          mustReload: false
        }
      },
      transformResponse: (response: UserAuthorizationData) => ({
        isLogged: true,
        isSuperUser: response.isSuperUser,
        mustReload: false
      })
    })
  })
})

export const {
  endpoints: { getCurrentUserAuthorization }
} = authorizationAPI
