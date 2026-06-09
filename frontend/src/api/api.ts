import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError
} from '@reduxjs/toolkit/query/react'
import { normalizeRtkBaseQuery } from '@utils/normalizeRtkBaseQuery'

import type { BackendApiErrorResponse } from './types'

// =============================================================================
// Monitorenv Private API

// We'll need that later on for authentication.
const monitorenvPrivateApiQuery = fetchBaseQuery({
  baseUrl: '/bff',
  credentials: 'include'
})

type BackendBaseQueryError = Omit<FetchBaseQueryError, 'data'> & { data: BackendApiErrorResponse }
type BackendBaseQueryFn = BaseQueryFn<string | FetchArgs, unknown, BackendBaseQueryError>

const makeBaseQuery = (baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>): BackendBaseQueryFn =>
  normalizeRtkBaseQuery(baseQuery) as BackendBaseQueryFn

export const monitorenvPrivateApi = createApi({
  baseQuery: makeBaseQuery(monitorenvPrivateApiQuery),
  endpoints: () => ({}),
  reducerPath: 'monitorenvPrivateApi',
  tagTypes: [
    'Dashboards',
    'ExtractArea',
    'Infractions',
    'InfractionsSuspicions',
    'Missions',
    'NearbyUnits',
    'RegulatoryAreas',
    'Reportings',
    'Tags',
    'VigilanceAreas'
  ]
})

// =============================================================================
// Monitorenv Public API

// We'll need that later on for authentication.
const monitorenvPublicApiQuery = fetchBaseQuery({
  baseUrl: '/api'
})
export const monitorenvPublicApi = createApi({
  baseQuery: makeBaseQuery(monitorenvPublicApiQuery),
  endpoints: () => ({}),
  reducerPath: 'monitorenvPublicApi',
  tagTypes: ['Administrations', 'ControlUnits', 'Stations']
})
