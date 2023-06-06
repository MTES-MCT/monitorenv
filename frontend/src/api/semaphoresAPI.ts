import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Semaphore } from '../domain/entities/semaphore'

export const semaphoresAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    getSemaphores: build.query<Semaphore[], void>({
      query: () => 'semaphores'
    })
  }),
  reducerPath: 'semaphores'
})

export const { useGetSemaphoresQuery } = semaphoresAPI
