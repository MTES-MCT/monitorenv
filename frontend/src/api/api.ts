import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { setAuthorizationHeader } from './utils/setAuthorizationHeaders'
import { normalizeRtkBaseQuery } from '../utils/normalizeRtkBaseQuery'

import type { BackendApiErrorResponse } from './types'

// =============================================================================
// Monitorenv Private API

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
  tagTypes: [
    'Missions',
    'Reportings',
    'VigilanceAreas',
    'Dashboards',
    'ExtractArea',
    'NearbyUnits',
    'Suspicions',
    'Infractions'
  ]
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
