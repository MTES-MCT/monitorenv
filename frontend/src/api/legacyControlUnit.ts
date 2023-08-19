import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { ControlUnit } from '../domain/entities/legacyControlUnit'

export const legacyControlUnit = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    getLegacyControlUnits: build.query<ControlUnit[], void>({
      query: () => `legacy_control_units`
    })
  }),
  reducerPath: 'controlUnits'
})

export const { useGetLegacyControlUnitsQuery } = legacyControlUnit
