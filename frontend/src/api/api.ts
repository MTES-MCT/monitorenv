import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getOIDCUser } from 'auth/getOIDCUser'

import { normalizeRtkBaseQuery } from '../utils/normalizeRtkBaseQuery'
import { sha256 } from '../utils/sha256'

import type { BackendApiErrorResponse } from './types'

// =============================================================================
// GeoServer API

export const geoserverApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.FRONTEND_GEOSERVER_REMOTE_URL}/geoserver` }),
  endpoints: () => ({}),
  reducerPath: 'geoserverApi'
})

// =============================================================================
// Monitorenv Private API

const AUTHORIZATION_HEADER = 'authorization'
const CORRELATION_HEADER = 'X-Correlation-Id'

const setAuthorizationHeader = async headers => {
  const user = getOIDCUser()
  const token = user?.access_token

  // If we have a token set in state, we pass it.
  if (token) {
    headers.set(AUTHORIZATION_HEADER, `Bearer ${token}`)

    if (crypto?.subtle) {
      const hashedToken = await sha256(token)

      headers.set(CORRELATION_HEADER, hashedToken)
    }
  }

  return headers
}
// We'll need that later on for authentication.
const monitorenvPrivateApiQuery = fetchBaseQuery({
  baseUrl: '/bff',
  prepareHeaders: setAuthorizationHeader
})
export const monitorenvPrivateApi = createApi({
  baseQuery: async (args, api, extraOptions) => {
    const result = await normalizeRtkBaseQuery(monitorenvPrivateApiQuery)(args, api, extraOptions)
    if (result.error) {
      return {
        error: {
          data: result.error.data as BackendApiErrorResponse,
          status: result.error.status
        }
      }
    }

    return result
  },
  endpoints: () => ({}),
  reducerPath: 'monitorenvPrivateApi',
  tagTypes: ['Missions', 'Reportings']
})

// =============================================================================
// Monitorenv Public API

// We'll need that later on for authentication.
const monitorenvPublicApiQuery = fetchBaseQuery({
  baseUrl: '/api'
})
export const monitorenvPublicApi = createApi({
  baseQuery: async (args, api, extraOptions) => {
    const result = await normalizeRtkBaseQuery(monitorenvPublicApiQuery)(args, api, extraOptions)
    if (result.error) {
      return {
        error: {
          data: result.error.data as BackendApiErrorResponse,
          status: result.error.status
        }
      }
    }

    return result
  },
  endpoints: () => ({}),
  reducerPath: 'monitorenvPublicApi',
  tagTypes: ['Administrations', 'ControlUnits', 'Stations']
})
