import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { normalizeRtkBaseQuery } from '../utils/normalizeRtkBaseQuery'

// =============================================================================
// Monitorenv Private API

// We'll need that later on for authentication.
const monitorenvPrivateApiBaseQuery = fetchBaseQuery({
  baseUrl: '/bff/v1'
})
export const monitorenvPrivateApi = createApi({
  baseQuery: normalizeRtkBaseQuery(monitorenvPrivateApiBaseQuery),
  endpoints: () => ({}),
  reducerPath: 'monitorenvPrivateApi',
  tagTypes: []
})

// =============================================================================
// Monitorenv Public API

// We'll need that later on for authentication.
const monitorenvPublicApiBaseQuery = fetchBaseQuery({
  baseUrl: '/api/v1'
})
export const monitorenvPublicApi = createApi({
  baseQuery: normalizeRtkBaseQuery(monitorenvPublicApiBaseQuery),
  endpoints: () => ({}),
  reducerPath: 'monitorenvPublicApi',
  tagTypes: ['Administrations', 'Bases', 'ControlUnits']
})
