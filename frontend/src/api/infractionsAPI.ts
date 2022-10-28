import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { NatinfType } from '../domain/entities/natinfs'

export const infractionsAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    getInfractions: build.query<NatinfType[], void>({
      query: () => `natinfs`
    })
  }),
  reducerPath: 'natinfs'
})

export const { useGetInfractionsQuery } = infractionsAPI
