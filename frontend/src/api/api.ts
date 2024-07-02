import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { normalizeRtkBaseQuery } from '../utils/normalizeRtkBaseQuery'

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
  tagTypes: ['Missions', 'Reportings', 'VigilanceAreas']
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
