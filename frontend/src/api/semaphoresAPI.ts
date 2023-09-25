import { type EntityState, createEntityAdapter } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Semaphore } from '../domain/entities/semaphore'

const SemaphoreAdapter = createEntityAdapter<Semaphore>()
const initialState = SemaphoreAdapter.getInitialState()

export const semaphoresAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    getSemaphores: build.query<EntityState<Semaphore>, void>({
      query: () => 'semaphores',
      transformResponse: (response: Semaphore[]) => SemaphoreAdapter.setAll(initialState, response)
    })
  }),
  reducerPath: 'semaphores'
})

export const { useGetSemaphoresQuery } = semaphoresAPI
