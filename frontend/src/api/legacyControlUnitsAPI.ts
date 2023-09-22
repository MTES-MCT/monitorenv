import { monitorenvPublicApi } from './api'

import type { LegacyControlUnit } from '../domain/entities/legacyControlUnit'

export const legacyControlUnitsAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    getLegacyControlUnits: builder.query<LegacyControlUnit[], void>({
      providesTags: () => [{ type: 'ControlUnits' }],
      query: () => `/v1/control_units`
    })
  })
})

export const { useGetLegacyControlUnitsQuery } = legacyControlUnitsAPI
