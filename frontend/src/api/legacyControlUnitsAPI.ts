import { monitorenvPublicApi } from './api'

import type { ControlUnit } from '../domain/entities/legacyControlUnit'

export const legacyControlUnitsAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    getLegacyControlUnits: builder.query<ControlUnit[], void>({
      query: () => `/v1/control_units`
    })
  })
})

export const { useGetLegacyControlUnitsQuery } = legacyControlUnitsAPI
