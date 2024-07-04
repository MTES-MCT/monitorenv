import { FrontendApiError } from '@libs/FrontendApiError'

import { monitorenvPrivateApi } from './api'
import { ApiErrorCode, type Meta } from './types'

import type { UserAuthorization, UserAuthorizationData } from 'domain/entities/authorization/types'

const ERROR_AUTHENTICATION_REQUIRED = 'Authentification requise'
const ERROR_TOKEN_EXPIRED = "Jeton d'authentification expiré"
const ERROR_AUTHENTICATION_FAILED = "Erreur d'authentification"

export const authorizationAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getCurrentUserAuthorization: builder.query<UserAuthorization, void>({
      keepUnusedDataFor: 0,
      query: () => '/v1/authorization/current',
      transformErrorResponse: (_, meta: Meta) => {
        const authenticateResponse = meta?.response?.headers.get('WWW-Authenticate')
        if (authenticateResponse?.includes('authentication is required')) {
          throw new FrontendApiError(ERROR_AUTHENTICATION_REQUIRED, {
            data: {
              code: ApiErrorCode.AUTHENTICATION_REQUIRED,
              data: { isSuperUser: false },
              type: ApiErrorCode.AUTHENTICATION_REQUIRED
            },
            status: 403
          })
        }
        if (authenticateResponse?.includes('expired')) {
          throw new FrontendApiError(ERROR_TOKEN_EXPIRED, {
            data: {
              code: ApiErrorCode.AUTHENTICATION_REQUIRED,
              data: { isSuperUser: false },
              type: ApiErrorCode.AUTHENTICATION_REQUIRED
            },
            status: 403
          })
        }

        throw new FrontendApiError(ERROR_AUTHENTICATION_FAILED, {
          data: {
            code: ApiErrorCode.AUTHENTICATION_REQUIRED,
            data: { isSuperUser: false },
            type: ApiErrorCode.AUTHENTICATION_REQUIRED
          },
          status: 403
        })
      },
      transformResponse: (response: UserAuthorizationData) => ({
        isSuperUser: response.isSuperUser
      })
    })
  })
})

export const {
  endpoints: { getCurrentUserAuthorization },
  useGetCurrentUserAuthorizationQuery
} = authorizationAPI
