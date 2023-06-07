import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { AMP } from '../domain/entities/AMPs'

export const ampsAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    getAMPs: build.query<AMP[], void>({
      query: () => `amps`
    })
  }),
  reducerPath: 'amps'
})

export const { useGetAMPsQuery } = ampsAPI
