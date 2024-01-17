import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { GEOSERVER_REMOTE_URL, MONITORFISH_PUBLIC_URL } from '../env'
import { normalizeRtkBaseQuery } from '../utils/normalizeRtkBaseQuery'

import type { BackendApiErrorResponse } from './types'

// =============================================================================
// GeoServer API

export const geoserverApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${GEOSERVER_REMOTE_URL}/geoserver` }),
  endpoints: () => ({}),
  reducerPath: 'geoserverApi'
})

// =============================================================================
// Monitorenv Private API

// We'll need that later on for authentication.
const monitorenvPrivateApiQuery = fetchBaseQuery({
  baseUrl: '/bff'
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

// =============================================================================
// MonitorFish Public API

const setAuthorizationHeader = headers => {
  headers.set('X-API-KEY', 'test')

  return headers
}

const monitorFishPublicApiQuery = fetchBaseQuery({
  baseUrl: `${MONITORFISH_PUBLIC_URL}/api`,
  prepareHeaders: setAuthorizationHeader
})
export const monitorFishPublicApi = createApi({
  baseQuery: async (args, api, extraOptions) => {
    const result = await normalizeRtkBaseQuery(monitorFishPublicApiQuery)(args, api, extraOptions)
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
  reducerPath: 'monitorFishPublicApi'
})
