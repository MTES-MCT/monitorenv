import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { ControlUnit } from '../domain/entities/controlUnit'

export const controlUnitsAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    getControlUnits: build.query<ControlUnit[], void>({
      query: () => `control_units`
    })
  }),
  reducerPath: 'controlUnits'
})

export const { useGetControlUnitsQuery } = controlUnitsAPI
